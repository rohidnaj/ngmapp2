/**
 * WebSocket Manager for Bidirectional Real-Time Communication
 *
 * Provides WebSocket-based communication for real-time synchronization,
 * with fallback to Server-Sent Events for older browsers.
 */

import { WebSocket, WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { EventEmitter } from 'events'
import { SyncEvent, SyncClient, ClientCapabilities } from './advanced-realtime-architecture'

export interface WebSocketConnection {
  ws: WebSocket
  client: SyncClient
  heartbeatInterval?: NodeJS.Timeout
  lastPing: number
}

export class WebSocketManager extends EventEmitter {
  private wss: WebSocketServer
  private connections: Map<string, WebSocketConnection> = new Map()
  private heartbeatInterval: NodeJS.Timeout
  private readonly HEARTBEAT_INTERVAL = 30000
  private readonly CONNECTION_TIMEOUT = 60000

  constructor(server: any) {
    super()
    this.wss = new WebSocketServer({ server })
    this.setupWebSocketServer()
    this.startHeartbeat()
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request)
    })

    this.wss.on('error', (error) => {
      console.error('WebSocket Server Error:', error)
      this.emit('server-error', error)
    })
  }

  private async handleConnection(ws: WebSocket, request: IncomingMessage): Promise<void> {
    try {
      // Extract client information from request
      const clientId = this.extractClientId(request)
      const sessionId = this.extractSessionId(request)
      const userId = this.extractUserId(request)

      // Create client info
      const client: SyncClient = {
        id: clientId,
        sessionId,
        userId,
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        capabilities: await this.detectCapabilities(request),
      }

      // Create connection
      const connection: WebSocketConnection = {
        ws,
        client,
        lastPing: Date.now(),
      }

      this.connections.set(clientId, connection)

      // Setup connection handlers
      this.setupConnectionHandlers(connection)

      // Start heartbeat for this connection
      this.startConnectionHeartbeat(connection)

      // Emit connection event
      this.emit('client-connected', client)

      console.log(`WebSocket client connected: ${clientId}`)

    } catch (error) {
      console.error('Error handling WebSocket connection:', error)
      ws.close(1011, 'Connection setup failed')
    }
  }

  private setupConnectionHandlers(connection: WebSocketConnection): void {
    const { ws, client } = connection

    ws.on('message', (data: Buffer) => {
      this.handleMessage(client.id, data)
    })

    ws.on('close', (code: number, reason: Buffer) => {
      console.log(`WebSocket client disconnected: ${client.id}, code: ${code}`)
      this.handleDisconnection(client.id)
    })

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${client.id}:`, error)
      this.handleDisconnection(client.id)
    })

    ws.on('pong', () => {
      connection.lastPing = Date.now()
    })
  }

  private handleMessage(clientId: string, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString())

      // Update client activity
      const connection = this.connections.get(clientId)
      if (connection) {
        connection.client.lastActivity = Date.now()
      }

      // Handle different message types
      switch (message.type) {
        case 'ping':
          this.handlePing(clientId)
          break
        case 'sync-event':
          this.handleSyncEvent(clientId, message.data)
          break
        case 'subscribe':
          this.handleSubscribe(clientId, message.channels)
          break
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message.channels)
          break
        default:
          this.emit('message', { clientId, message })
      }
    } catch (error) {
      console.error(`Error handling message from client ${clientId}:`, error)
      this.sendToClient(clientId, {
        type: 'error',
        error: 'Invalid message format',
        timestamp: Date.now(),
      })
    }
  }

  private handlePing(clientId: string): void {
    this.sendToClient(clientId, {
      type: 'pong',
      timestamp: Date.now(),
    })
  }

  private handleSyncEvent(clientId: string, event: SyncEvent): void {
    this.emit('sync-event', { clientId, event })
  }

  private handleSubscribe(clientId: string, channels: string[]): void {
    // Handle channel subscriptions (for future use)
    console.log(`Client ${clientId} subscribed to channels:`, channels)
  }

  private handleUnsubscribe(clientId: string, channels: string[]): void {
    // Handle channel unsubscriptions (for future use)
    console.log(`Client ${clientId} unsubscribed from channels:`, channels)
  }

  private handleDisconnection(clientId: string): void {
    const connection = this.connections.get(clientId)
    if (connection) {
      // Clear heartbeat interval
      if (connection.heartbeatInterval) {
        clearInterval(connection.heartbeatInterval)
      }

      // Remove connection
      this.connections.delete(clientId)

      // Emit disconnection event
      this.emit('client-disconnected', connection.client)
    }
  }

  // =============================================================================
  // SENDING MESSAGES
  // =============================================================================

  sendToClient(clientId: string, message: any): boolean {
    const connection = this.connections.get(clientId)
    if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
      return false
    }

    try {
      connection.ws.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error)
      return false
    }
  }

  broadcast(message: any, excludeClientId?: string): void {
    const messageStr = JSON.stringify(message)

    for (const [clientId, connection] of this.connections) {
      if (clientId === excludeClientId) continue
      if (connection.ws.readyState === WebSocket.OPEN) {
        try {
          connection.ws.send(messageStr)
        } catch (error) {
          console.error(`Error broadcasting to client ${clientId}:`, error)
        }
      }
    }
  }

  sendToClients(clientIds: string[], message: any): void {
    const messageStr = JSON.stringify(message)

    for (const clientId of clientIds) {
      const connection = this.connections.get(clientId)
      if (connection && connection.ws.readyState === WebSocket.OPEN) {
        try {
          connection.ws.send(messageStr)
        } catch (error) {
          console.error(`Error sending to client ${clientId}:`, error)
        }
      }
    }
  }

  // =============================================================================
  // HEARTBEAT AND HEALTH CHECKS
  // =============================================================================

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.checkConnections()
    }, this.HEARTBEAT_INTERVAL)
  }

  private startConnectionHeartbeat(connection: WebSocketConnection): void {
    connection.heartbeatInterval = setInterval(() => {
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.ping()
      }
    }, this.HEARTBEAT_INTERVAL)
  }

  private checkConnections(): void {
    const now = Date.now()
    const timeoutThreshold = now - this.CONNECTION_TIMEOUT

    for (const [clientId, connection] of this.connections) {
      // Check if connection is stale
      if (connection.lastPing < timeoutThreshold) {
        console.log(`Connection timeout for client ${clientId}`)
        connection.ws.close(1001, 'Connection timeout')
        continue
      }

      // Send heartbeat
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.ping()
      }
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private extractClientId(request: IncomingMessage): string {
    // Extract from query parameters or headers
    const url = new URL(request.url || '', 'http://localhost')
    return url.searchParams.get('clientId') || `ws-client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private extractSessionId(request: IncomingMessage): string {
    const url = new URL(request.url || '', 'http://localhost')
    return url.searchParams.get('sessionId') || `session-${Date.now()}`
  }

  private extractUserId(request: IncomingMessage): string | undefined {
    const url = new URL(request.url || '', 'http://localhost')
    return url.searchParams.get('userId') || undefined
  }

  private async detectCapabilities(request: IncomingMessage): Promise<ClientCapabilities> {
    // Basic capability detection
    // In a real implementation, this could be more sophisticated
    const userAgent = request.headers['user-agent'] || ''

    return {
      supportsWebSocket: true, // Since they're connecting via WS
      supportsSSE: true, // Most modern browsers support SSE
      supportsFileUpload: true, // Assume support for file uploads
      maxFileSize: 10 * 1024 * 1024, // 10MB default
    }
  }

  getConnectedClients(): SyncClient[] {
    return Array.from(this.connections.values()).map(conn => conn.client)
  }

  getConnectionCount(): number {
    return this.connections.size
  }

  isClientConnected(clientId: string): boolean {
    const connection = this.connections.get(clientId)
    return connection ? connection.ws.readyState === WebSocket.OPEN : false
  }

  // =============================================================================
  // CLEANUP
  // =============================================================================

  async cleanup(): Promise<void> {
    // Clear heartbeat interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    // Close all connections
    for (const [clientId, connection] of this.connections) {
      if (connection.heartbeatInterval) {
        clearInterval(connection.heartbeatInterval)
      }
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.close(1001, 'Server shutdown')
      }
    }

    this.connections.clear()

    // Close WebSocket server
    this.wss.close()
  }
}
