/**
 * Debug API Route - Check Database Content
 *
 * This endpoint allows checking the current database content for debugging purposes.
 * Useful for verifying that content updates are being saved correctly.
 */

import { loadContentFromServer } from "@/app/actions"

export async function GET() {
  try {
    console.log("🔍 Debug: Checking database content")

    const result = await loadContentFromServer()

    if (result.success && result.content) {
      const content = result.content
      const summary = {
        success: true,
        timestamp: new Date().toISOString(),
        domain: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').hostname,
        content: {
          reviews: {
            count: content.reviews?.length || 0,
            lastReview: content.reviews?.[content.reviews.length - 1] || null,
          },
          services: {
            count: content.services?.length || 0,
          },
          galleryImages: {
            count: content.galleryImages?.length || 0,
            lastImage: content.galleryImages?.[content.galleryImages.length - 1] || null,
          },
          testimonials: {
            count: content.testimonials?.length || 0,
          },
          blogPosts: {
            count: content.blogPosts?.length || 0,
          },
        },
        syncInfo: {
          totalItems: (content.reviews?.length || 0) +
                     (content.services?.length || 0) +
                     (content.galleryImages?.length || 0) +
                     (content.testimonials?.length || 0) +
                     (content.blogPosts?.length || 0),
        },
        fullContent: content, // Include full content for detailed debugging
      }

      console.log("✅ Debug: Database content retrieved successfully", {
        reviews: summary.content.reviews.count,
        services: summary.content.services.count,
        gallery: summary.content.galleryImages.count,
      })

      return Response.json(summary, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      })
    } else {
      console.error("❌ Debug: Failed to load content from database")
      return Response.json({
        success: false,
        error: result.message || "Failed to load content",
        timestamp: new Date().toISOString(),
      }, {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    }
  } catch (error) {
    console.error("❌ Debug: Error checking database content:", error)
    return Response.json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }
}
