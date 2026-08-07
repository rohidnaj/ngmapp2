"use client"

import { useCallback } from "react"
import type { SyncEvent, SyncOperation, SyncResult } from "@/lib/realtime-sync/sync-types"

type WebSocketSyncOptions = {
  config?: any
  onContentUpdate?: (data: any, event: any) => void
  onFileUpdate?: (data: any, event: any) => void
  onClientConnected?: (clientId: string) => void
  onClientDisconnected?: (clientId: string) => void
  onConflictDetected?: (conflicts: any[]) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useWebSocketSync(options: WebSocketSyncOptions = {}) {
  const connect = useCallback(() => {
    // No-op: WebSocket sync disabled
  }, [])

  const disconnect = useCallback(() => {
    // No-op: WebSocket sync disabled
  }, [])

  const sendMessage = useCallback((_message: any): boolean => {
    return false
  }, [])

  const syncOperation = useCallback(async (_operation: Omit<SyncOperation, "id">): Promise<SyncResult> => {
    return { success: false, error: "Sync not available" }
  }, [])

  const broadcastEvent = useCallback((_event: Omit<SyncEvent, "id" | "timestamp" | "clientId">) => {
    return false
  }, [])

  return {
    status: "disconnected" as const,
    clientId: null,
    sessionId: null,
    connectedClients: [],
    lastSyncTime: null,
    isConnected: false,
    pendingOperations: new Map(),
    syncOperation,
    broadcastEvent,
    connect,
    disconnect,
    sendMessage,
  }
}
