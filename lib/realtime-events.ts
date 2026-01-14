// Real-time event system for content synchronization
// Uses Server-Sent Events (SSE) for efficient one-way server-to-client communication

export type ContentEvent = {
  type: "content-update" | "connected" | "heartbeat"
  timestamp: number
  data?: any
  source?: string // ID of the client that made the change (to avoid echo)
}

// In-memory store for SSE connections (works for single instance)
// For production with multiple instances, use Redis pub/sub
class EventEmitter {
  private clients: Map<string, ReadableStreamDefaultController<Uint8Array>> = new Map()
  private lastEventTimestamp: number = Date.now()

  // Add a new SSE client
  addClient(clientId: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    this.clients.set(clientId, controller)
    console.log(`[SSE] Client connected: ${clientId}, total clients: ${this.clients.size}`)

    // Send connected event
    this.sendToClient(clientId, {
      type: "connected",
      timestamp: Date.now(),
      data: { clientId },
    })
  }

  // Remove a client
  removeClient(clientId: string) {
    this.clients.delete(clientId)
    console.log(`[SSE] Client disconnected: ${clientId}, total clients: ${this.clients.size}`)
  }

  // Send event to a specific client
  private sendToClient(clientId: string, event: ContentEvent) {
    const controller = this.clients.get(clientId)
    if (controller) {
      try {
        const data = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(new TextEncoder().encode(data))
      } catch (error) {
        console.error(`[SSE] Error sending to client ${clientId}:`, error)
        this.removeClient(clientId)
      }
    }
  }

  // Broadcast event to all clients except the source
  broadcast(event: ContentEvent, excludeClientId?: string) {
    this.lastEventTimestamp = Date.now()
    const eventWithTimestamp = { ...event, timestamp: this.lastEventTimestamp }

    this.clients.forEach((controller, clientId) => {
      // Don't send to the client that triggered the event
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, eventWithTimestamp)
      }
    })

    console.log(`[SSE] Broadcasted ${event.type} to ${this.clients.size - (excludeClientId ? 1 : 0)} clients`)
  }

  // Send heartbeat to all clients to keep connections alive
  sendHeartbeat() {
    const event: ContentEvent = {
      type: "heartbeat",
      timestamp: Date.now(),
    }

    this.clients.forEach((controller, clientId) => {
      this.sendToClient(clientId, event)
    })
  }

  // Get client count
  getClientCount() {
    return this.clients.size
  }

  // Get last event timestamp
  getLastEventTimestamp() {
    return this.lastEventTimestamp
  }
}

// Singleton instance
export const eventEmitter = new EventEmitter()

// Generate unique client ID
export function generateClientId(): string {
  return `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
