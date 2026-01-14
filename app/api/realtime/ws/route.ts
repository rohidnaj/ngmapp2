/**
 * WebSocket API Route for Real-Time Synchronization
 *
 * Handles WebSocket connections for bidirectional real-time communication
 * between clients and the server.
 */

import { WebSocketManager } from "@/lib/realtime-sync/websocket-manager"
import { RealtimeSyncEngine } from "@/lib/realtime-sync/advanced-realtime-architecture"
import { NextRequest } from "next/server"

// Global WebSocket manager instance
let wsManager: WebSocketManager | null = null
let syncEngine: RealtimeSyncEngine | null = null

function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    // Get the HTTP server instance (this would be available in a real deployment)
    // For Next.js, we need to handle this differently
    const server = globalThis as any

    if (server.httpServer) {
      wsManager = new WebSocketManager(server.httpServer)
      setupWebSocketEventHandlers()
    } else {
      throw new Error('HTTP server not available for WebSocket initialization')
    }
  }
  return wsManager
}

function getSyncEngine(): RealtimeSyncEngine {
  if (!syncEngine) {
    // In production, use Redis URL from environment
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    syncEngine = new RealtimeSyncEngine(redisUrl)
  }
  return syncEngine
}

function setupWebSocketEventHandlers(): void {
  if (!wsManager) return

  const engine = getSyncEngine()

  // Forward WebSocket events to sync engine
  wsManager.on('client-connected', (client: any) => {
    engine.emit('client-connected', client)
  })

  wsManager.on('client-disconnected', (client: any) => {
    engine.emit('client-disconnected', client)
  })

  wsManager.on('sync-event', ({ clientId, event }: any) => {
    engine.emit('sync-event', { clientId, event })
  })

  // Handle sync engine events
  engine.on('sync-event', (event: any) => {
    wsManager?.broadcast(event)
  })

  engine.on('operation-result', (result: any) => {
    wsManager?.sendToClient(result.clientId, {
      type: 'operation-result',
      result,
    })
  })

  engine.on('conflicts-detected', (conflicts: any) => {
    // Broadcast conflicts to all clients for resolution
    wsManager?.broadcast({
      type: 'conflicts-detected',
      conflicts,
      timestamp: Date.now(),
    })
  })
}

// WebSocket endpoint - Next.js doesn't natively support WebSockets in API routes
// This is a placeholder for when WebSocket support is properly configured
export async function GET(request: NextRequest) {
  try {
    // For Next.js, WebSocket connections need to be handled at the server level
    // This would typically be done in a custom server setup (server.js) or
    // using a WebSocket proxy

    // Extract client information from query parameters
    const clientId = request.nextUrl.searchParams.get('clientId') || `ws-client-${Date.now()}`
    const sessionId = request.nextUrl.searchParams.get('sessionId') || `session-${Date.now()}`
    const userId = request.nextUrl.searchParams.get('userId')

    // Return instructions for client to connect via proper WebSocket endpoint
    return Response.json({
      error: 'WebSocket connection not available via API route',
      message: 'Please configure WebSocket support in your Next.js application',
      clientId,
      sessionId,
      userId,
      instructions: {
        setup: 'Configure custom server with WebSocket support',
        alternative: 'Use Server-Sent Events (SSE) at /api/realtime',
      }
    }, { status: 501 })

  } catch (error) {
    console.error('[WebSocket API] Error:', error)
    return Response.json({
      error: 'WebSocket initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Cleanup on process termination
process.on('SIGTERM', async () => {
  if (wsManager) {
    await wsManager.cleanup()
  }
  if (syncEngine) {
    await syncEngine.cleanup()
  }
})

process.on('SIGINT', async () => {
  if (wsManager) {
    await wsManager.cleanup()
  }
  if (syncEngine) {
    await syncEngine.cleanup()
  }
})
