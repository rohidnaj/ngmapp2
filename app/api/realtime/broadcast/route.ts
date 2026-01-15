import { eventEmitter, type ContentEvent } from "@/lib/realtime-events"

export const dynamic = "force-dynamic"

// Endpoint to broadcast content updates
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type = "content-update", data, sourceClientId } = body

    const event: ContentEvent = {
      type,
      timestamp: Date.now(),
      data,
      source: sourceClientId,
    }

    // Broadcast to all clients except the source
    eventEmitter.broadcast(event, sourceClientId)

    return Response.json({
      success: true,
      clientCount: eventEmitter.getClientCount(),
      timestamp: event.timestamp,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error("[Broadcast] Error:", error)
    return Response.json({ success: false, error: "Failed to broadcast" }, { status: 500 })
  }
}
