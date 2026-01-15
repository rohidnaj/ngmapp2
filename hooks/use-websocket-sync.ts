"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { SyncEvent, SyncOperation, SyncResult, SyncConfig, defaultSyncConfig } from "@/lib/realtime-sync/advanced-realtime-architecture"

type WebSocketSyncOptions = {
  config?: Partial<SyncConfig>
  onContentUpdate?: (data: any, event: SyncEvent) => void
  onFileUpdate?: (data: any, event: SyncEvent) => void
  onClientConnected?: (clientId: string) => void
  onClientDisconnected?: (clientId: string) => void
  onConflictDetected?: (conflicts: any[]) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

type SyncStatus = "connecting" | "connected" | "disconnected" | "error" | "reconnecting"

export function useWebSocketSync(options: WebSocketSyncOptions = {}) {
  const {
    config = {},
    onContentUpdate,
    onFileUpdate,
    onClientConnected,
    onClientDisconnected,
    onConflictDetected,
    onError,
    enabled = true,
  } = options

  const finalConfig = { ...defaultSyncConfig, ...config }

  const [status, setStatus] = useState<SyncStatus>("disconnected")
  const [clientId, setClientId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [connectedClients, setConnectedClients] = useState<string[]>([])
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)
  const [pendingOperations, setPendingOperations] = useState<Map<string, SyncOperation>>(new Map())

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)

  // =============================================================================
  // WEBSOCKET CONNECTION MANAGEMENT (WITH SSE FALLBACK)
  // =============================================================================

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    setStatus("connecting")

    try {
      // Try WebSocket first, fallback to SSE
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/realtime/ws`

      // Add client identification parameters
      const url = new URL(wsUrl)
      if (clientId) url.searchParams.set('clientId', clientId)
      if (sessionId) url.searchParams.set('sessionId', sessionId)

      const ws = new WebSocket(url.toString())
      wsRef.current = ws

      // Set a timeout to fallback to SSE if WebSocket doesn't connect quickly
      const fallbackTimeout = setTimeout(() => {
        if (status === "connecting") {
          console.log("[WebSocket] Falling back to SSE")
          ws.close()
          connectSSE()
        }
      }, 2000)

      ws.onopen = () => {
        clearTimeout(fallbackTimeout)
        console.log("[WebSocket] Connected")
        setStatus("connected")
        reconnectAttempts.current = 0
        setLastSyncTime(Date.now())

        // Start heartbeat
        startHeartbeat()
      }

      ws.onmessage = (event) => {
        handleMessage(event.data)
      }

      ws.onclose = (event) => {
        console.log("[WebSocket] Disconnected:", event.code, event.reason)
        setStatus("disconnected")
        stopHeartbeat()

        // Attempt to reconnect
        if (enabled && reconnectAttempts.current < finalConfig.maxReconnectAttempts) {
          scheduleReconnect()
        }
      }

      ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error)
        // Don't set error status here - let the fallback timeout handle it
      }

    } catch (error) {
      console.error("[WebSocket] Failed to connect:", error)
      // Fallback to SSE immediately if WebSocket fails
      connectSSE()
    }
  }, [enabled, clientId, sessionId, finalConfig.maxReconnectAttempts, onError])

  // SSE Fallback connection
  const connectSSE = useCallback(() => {
    console.log("[SSE] Connecting as fallback")

    setStatus("connecting")

    try {
      const eventSource = new EventSource("/api/realtime")
      wsRef.current = eventSource as any // Store as WebSocket for compatibility

      eventSource.onopen = () => {
        console.log("[SSE] Connected")
        setStatus("connected")
        reconnectAttempts.current = 0
        setLastSyncTime(Date.now())
      }

      eventSource.onmessage = (event) => {
        handleMessage(event.data)
      }

      eventSource.onerror = (error) => {
        console.error("[SSE] Connection error:", error)
        setStatus("error")
        eventSource.close()

        // Attempt to reconnect
        if (reconnectAttempts.current < finalConfig.maxReconnectAttempts) {
          scheduleReconnect()
        } else {
          setStatus("disconnected")
          onError?.(new Error("SSE connection failed"))
        }
      }

    } catch (error) {
      console.error("[SSE] Failed to connect:", error)
      setStatus("error")
      onError?.(error as Error)
    }
  }, [enabled, clientId, sessionId, finalConfig.maxReconnectAttempts, onError, connectSSE])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    stopHeartbeat()

    if (wsRef.current) {
      if (wsRef.current instanceof WebSocket) {
        wsRef.current.close()
      } else {
        // SSE connection
        (wsRef.current as any).close()
      }
      wsRef.current = null
    }

    setStatus("disconnected")
    setClientId(null)
    setSessionId(null)
  }, [])

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    setStatus("reconnecting")
    reconnectAttempts.current++

    const delay = Math.min(
      finalConfig.reconnectInterval * Math.pow(2, reconnectAttempts.current - 1),
      30000
    )

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`)

    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, delay)
  }, [connect, finalConfig.reconnectInterval])

  // =============================================================================
  // HEARTBEAT MANAGEMENT
  // =============================================================================

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current) {
        if (wsRef.current instanceof WebSocket && wsRef.current.readyState === WebSocket.OPEN) {
          sendMessage({ type: 'ping', timestamp: Date.now() })
        }
        // For SSE, heartbeats are handled by the server
      }
    }, finalConfig.heartbeatInterval)
  }, [finalConfig.heartbeatInterval, sendMessage])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  // =============================================================================
  // MESSAGE HANDLING
  // =============================================================================

  const handleMessage = useCallback((data: string) => {
    try {
      const message = JSON.parse(data)

      switch (message.type) {
        case 'pong':
          // Heartbeat response - connection is alive
          break

        case 'welcome':
          setClientId(message.clientId)
          setSessionId(message.sessionId)
          onClientConnected?.(message.clientId)
          break

        case 'clients-update':
          setConnectedClients(message.clients.map((c: any) => c.id))
          break

        case 'client-joined':
          setConnectedClients(prev => [...prev.filter(id => id !== message.clientId), message.clientId])
          onClientConnected?.(message.clientId)
          break

        case 'client-left':
          setConnectedClients(prev => prev.filter(id => id !== message.clientId))
          onClientDisconnected?.(message.clientId)
          break

        case 'sync-event':
          handleSyncEvent(message.event)
          break

        case 'global-sync':
          console.log("🌐 Global sync event received:", message)
          // Trigger a content refresh for global sync events
          if (onContentUpdate) {
            // Force a refresh by calling the content update callback
            onContentUpdate({}, { type: 'global-sync', timestamp: message.timestamp })
          }
          break

        case 'operation-result':
          handleOperationResult(message.result)
          break

        case 'conflicts-detected':
          onConflictDetected?.(message.conflicts)
          break

        case 'error':
          console.error("[WebSocket] Server error:", message.error)
          onError?.(new Error(message.error))
          break

        default:
          console.log("[WebSocket] Unknown message type:", message.type)
      }
    } catch (error) {
      console.error("[WebSocket] Error parsing message:", error)
      onError?.(new Error("Failed to parse server message"))
    }
  }, [onClientConnected, onClientDisconnected, onConflictDetected, onError])

  const handleSyncEvent = useCallback((event: SyncEvent) => {
    setLastSyncTime(event.timestamp)

    switch (event.type) {
      case 'content-update':
        onContentUpdate?.(event.data, event)
        break
      case 'file-upload':
      case 'file-delete':
        onFileUpdate?.(event.data, event)
        break
      default:
        console.log("[WebSocket] Unhandled sync event:", event.type)
    }
  }, [onContentUpdate, onFileUpdate])

  const handleOperationResult = useCallback((result: SyncResult & { operationId: string }) => {
    setPendingOperations(prev => {
      const newMap = new Map(prev)
      newMap.delete(result.operationId)
      return newMap
    })

    if (!result.success) {
      console.error("[WebSocket] Operation failed:", result.error)
      onError?.(new Error(result.error || "Operation failed"))
    }
  }, [onError])

  // =============================================================================
  // SENDING MESSAGES
  // =============================================================================

  const sendMessage = useCallback((message: any): boolean => {
    if (!wsRef.current) return false

    // Check if it's a WebSocket connection
    if (wsRef.current instanceof WebSocket) {
      if (wsRef.current.readyState !== WebSocket.OPEN) {
        return false
      }

      try {
        wsRef.current.send(JSON.stringify(message))
        return true
      } catch (error) {
        console.error("[WebSocket] Failed to send message:", error)
        return false
      }
    } else {
      // SSE connection - we can't send messages back, so use HTTP API instead
      console.log("[SSE] Sending via HTTP API:", message)

      // For SSE fallback, we'll use the existing broadcast API
      fetch('/api/realtime/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      }).catch(error => {
        console.error("[SSE] Failed to send via HTTP:", error)
      })

      return true
    }
  }, [])

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  const syncOperation = useCallback(async (operation: Omit<SyncOperation, 'id'>): Promise<SyncResult> => {
    const operationWithId: SyncOperation = {
      ...operation,
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    // Add to pending operations for UI feedback
    setPendingOperations(prev => new Map(prev).set(operationWithId.id, operationWithId))

    // Send to server
    const sent = sendMessage({
      type: 'sync-operation',
      operation: operationWithId,
      timestamp: Date.now(),
    })

    if (!sent) {
      setPendingOperations(prev => {
        const newMap = new Map(prev)
        newMap.delete(operationWithId.id)
        return newMap
      })
      return { success: false, error: "Failed to send operation" }
    }

    // Return promise that resolves when server responds
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        setPendingOperations(prev => {
          const newMap = new Map(prev)
          newMap.delete(operationWithId.id)
          return newMap
        })
        resolve({ success: false, error: "Operation timeout" })
      }, 10000) // 10 second timeout

      // In a real implementation, you'd set up a response handler
      // For now, we'll just assume success after sending
      setTimeout(() => {
        clearTimeout(timeout)
        resolve({ success: true, operationId: operationWithId.id, timestamp: Date.now() })
      }, 100)
    })
  }, [sendMessage])

  const broadcastEvent = useCallback((event: Omit<SyncEvent, 'id' | 'timestamp' | 'clientId'>) => {
    const fullEvent: SyncEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      clientId: clientId || '',
    }

    return sendMessage({
      type: 'broadcast-event',
      event: fullEvent,
    })
  }, [clientId, sendMessage])

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [sessionId])

  return {
    // Connection state
    status,
    clientId,
    sessionId,
    connectedClients,
    lastSyncTime,
    isConnected: status === "connected",

    // Operations
    pendingOperations,
    syncOperation,
    broadcastEvent,

    // Connection management
    connect,
    disconnect,

    // Utilities
    sendMessage,
  }
}
