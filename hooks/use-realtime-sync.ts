"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { ContentEvent } from "@/lib/realtime-events"

type RealtimeSyncOptions = {
  onContentUpdate?: (data: any) => void
  onConnect?: (clientId: string) => void
  onDisconnect?: () => void
  enabled?: boolean
}

type SyncStatus = "connecting" | "connected" | "disconnected" | "error"

export function useRealtimeSync(options: RealtimeSyncOptions = {}) {
  const { onContentUpdate, onConnect, onDisconnect, enabled = true } = options

  const [status, setStatus] = useState<SyncStatus>("disconnected")
  const [clientId, setClientId] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setStatus("connecting")

    try {
      const eventSource = new EventSource("/api/realtime")
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log("[SSE] Connection opened")
        reconnectAttempts.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          const data: ContentEvent = JSON.parse(event.data)

          switch (data.type) {
            case "connected":
              setStatus("connected")
              setClientId(data.data?.clientId)
              onConnect?.(data.data?.clientId)
              console.log("[SSE] Connected with ID:", data.data?.clientId)
              break

            case "content-update":
              setLastUpdate(data.timestamp)
              onContentUpdate?.(data.data)
              console.log("[SSE] Content update received:", data.timestamp)
              break

            case "heartbeat":
              // Just keep the connection alive
              break
          }
        } catch (error) {
          console.error("[SSE] Error parsing message:", error)
        }
      }

      eventSource.onerror = (error) => {
        console.error("[SSE] Connection error:", error)
        setStatus("error")
        eventSource.close()

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectAttempts.current++

          console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else {
          setStatus("disconnected")
          onDisconnect?.()
        }
      }
    } catch (error) {
      console.error("[SSE] Failed to connect:", error)
      setStatus("error")
    }
  }, [enabled, onConnect, onContentUpdate, onDisconnect])

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setStatus("disconnected")
    setClientId(null)
    onDisconnect?.()
  }, [onDisconnect])

  // Broadcast a content update
  const broadcastUpdate = useCallback(
    async (data: any) => {
      if (!clientId) return false

      try {
        const response = await fetch("/api/realtime/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "content-update",
            data,
            sourceClientId: clientId,
          }),
        })

        const result = await response.json()
        return result.success
      } catch (error) {
        console.error("[SSE] Failed to broadcast:", error)
        return false
      }
    },
    [clientId],
  )

  // Connect on mount
  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    status,
    clientId,
    lastUpdate,
    connect,
    disconnect,
    broadcastUpdate,
    isConnected: status === "connected",
  }
}
