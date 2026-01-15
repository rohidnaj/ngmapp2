import { eventEmitter, type ContentEvent } from "@/lib/realtime-events"
import { loadContentFromServer } from "@/app/actions"

export const dynamic = "force-dynamic"

// Endpoint to broadcast content updates
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type = "content-update", data, sourceClientId } = body

    console.log(`📡 Broadcasting ${type} event from client ${sourceClientId || 'unknown'}`)

    const event: ContentEvent = {
      type,
      timestamp: Date.now(),
      data,
      source: sourceClientId,
    }

    // For global sync events, broadcast to ALL clients (including source)
    if (type === 'global-sync') {
      eventEmitter.broadcast(event) // No exclude parameter = broadcast to everyone
      console.log("🌐 Global sync broadcast sent to all clients")
    } else {
      // For regular updates, exclude the source client
      eventEmitter.broadcast(event, sourceClientId)
    }

    const clientCount = eventEmitter.getClientCount()
    console.log(`✅ Broadcast complete. ${clientCount} clients notified.`)

    return Response.json({
      success: true,
      clientCount,
      timestamp: event.timestamp,
      type,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error("[Broadcast] Error:", error)
    return Response.json({
      success: false,
      error: "Failed to broadcast",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
