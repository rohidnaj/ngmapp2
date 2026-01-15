import { eventEmitter, generateClientId } from "@/lib/realtime-events"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// SSE endpoint for real-time updates
export async function GET(request: Request) {
  const clientId = generateClientId()

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Register this client
      eventEmitter.addClient(clientId, controller)

      // Set up heartbeat interval (every 30 seconds)
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = `data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`
          controller.enqueue(new TextEncoder().encode(heartbeat))
        } catch (error) {
          clearInterval(heartbeatInterval)
        }
      }, 30000)

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval)
        eventEmitter.removeClient(clientId)
      })
    },
    cancel() {
      eventEmitter.removeClient(clientId)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      Connection: "keep-alive",
      "X-Client-Id": clientId,
    },
  })
}
