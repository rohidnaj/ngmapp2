/**
 * Pure types and constants for the real-time sync system.
 * Deliberately has ZERO imports from Node.js built-ins or server-only
 * packages (redis, etc.) so it can be safely imported from client
 * components/hooks without pulling server code into the browser bundle.
 *
 * The server-only engine in advanced-realtime-architecture.ts re-exports
 * everything here for backward compatibility with server-side importers.
 */

export interface SyncEvent {
  id: string
  type: 'content-update' | 'file-upload' | 'file-delete' | 'user-action' | 'system-event'
  timestamp: number
  clientId: string
  sessionId: string
  data: any
  version: number
  parentVersion?: number
  checksum?: string
}

export interface SyncClient {
  id: string
  sessionId: string
  userId?: string
  connectedAt: number
  lastActivity: number
  capabilities: ClientCapabilities
}

export interface ClientCapabilities {
  supportsWebSocket: boolean
  supportsSSE: boolean
  supportsFileUpload: boolean
  maxFileSize: number
}

export interface SyncOperation {
  id: string
  type: 'create' | 'update' | 'delete' | 'batch'
  entityType: string
  entityId: string
  data: any
  optimistic: boolean
  conflictResolution?: 'merge' | 'overwrite' | 'manual'
}

export interface ConflictResolution {
  operationId: string
  conflicts: Conflict[]
  resolution: 'accept-local' | 'accept-remote' | 'merge' | 'manual'
  mergedData?: any
}

export interface Conflict {
  field: string
  localValue: any
  remoteValue: any
  lastModified: number
}

export interface SyncResult {
  success: boolean
  operationId?: string
  timestamp?: number
  requiresManualResolution?: boolean
  conflicts?: Conflict[]
  error?: string
}

export interface SyncConfig {
  enableOptimisticUpdates: boolean
  enableConflictResolution: boolean
  enableFileSync: boolean
  maxReconnectAttempts: number
  reconnectInterval: number
  heartbeatInterval: number
}

// Default configuration
export const defaultSyncConfig: SyncConfig = {
  enableOptimisticUpdates: true,
  enableConflictResolution: true,
  enableFileSync: true,
  maxReconnectAttempts: 5,
  reconnectInterval: 3000,
  heartbeatInterval: 30000,
}
