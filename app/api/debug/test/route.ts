/**
 * Debug Test API Route - Test database connectivity and create sample data
 *
 * This endpoint allows testing database connectivity and creating sample data for testing sync.
 */

import dbConnect from '@/lib/mongodb'
import ContentModel from '@/lib/models/content'

export async function GET() {
  try {
    console.log("🧪 Debug Test: Testing database connectivity")

    // Test MongoDB connection
    const mongoose = (await import('mongoose')).default
    await dbConnect()

    const connectionState = mongoose.connection.readyState
    const connectionStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[connectionState] || 'unknown'

    console.log(`Database connection state: ${connectionStatus}`)

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        connectionStatus,
        uri: process.env.MONGODB_URI ? 'configured' : 'missing',
        readyState: connectionState,
        environment: process.env.NODE_ENV || 'unknown',
        name: mongoose.connection.name || 'unknown'
      },
      message: "Database connection test successful"
    })

  } catch (error) {
    console.error("❌ Debug Test Error:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log("🧪 Debug Test: Creating sample data")

    await dbConnect()

    // Check if content already exists
    const existingContent = await ContentModel.findOne()
    if (existingContent) {
      return Response.json({
        success: false,
        message: "Content already exists. Use DELETE to clear first.",
        existingContent: true
      })
    }

    // Create sample data
    const sampleContent = {
      reviews: [
        {
          author: "John Smith",
          date: new Date().toLocaleDateString(),
          content: "Excellent service! The team was professional and completed the work on time."
        },
        {
          author: "Sarah Johnson",
          date: new Date().toLocaleDateString(),
          content: "Highly recommend! Great attention to detail and beautiful results."
        }
      ],
      services: [
        {
          title: "Lawn Maintenance",
          description: "Professional lawn care services including mowing, edging, and fertilization.",
          image: "/placeholder.svg",
          features: ["Weekly mowing", "Edging and trimming", "Fertilization", "Weed control"]
        },
        {
          title: "Garden Design",
          description: "Custom garden design and landscaping services.",
          image: "/placeholder.svg",
          features: ["Custom design plans", "Plant selection", "Hardscaping", "Irrigation systems"]
        }
      ],
      galleryImages: [
        {
          url: "/placeholder.svg",
          title: "Beautiful Garden Transformation",
          description: "Complete garden makeover with new plants and pathways.",
          type: "url"
        },
        {
          url: "/placeholder.svg",
          title: "Lawn Care Excellence",
          description: "Professional lawn maintenance and care.",
          type: "url"
        }
      ],
      testimonials: [
        {
          content: "Outstanding work! Transformed our backyard into a paradise.",
          author: "Mike Wilson",
          location: "Vancouver, BC"
        }
      ],
      blogPosts: [
        {
          title: "Spring Garden Preparation Guide",
          date: new Date().toLocaleDateString(),
          image: "/placeholder.svg",
          excerpt: "Essential tips for preparing your garden for the spring season."
        }
      ],
      home: {
        heroImage: "/placeholder.svg",
        heroTitle: "Transform Your Outdoor Space",
        heroDescription: "Professional landscaping and garden maintenance services.",
        heroButtonText: "Get Free Quote"
      },
      about: {
        story: "We are a professional landscaping company serving the community for over 5 years.",
        image: "/placeholder.svg",
        stats: { years: 5, satisfaction: 98 }
      },
      contactInfo: {
        address: "Vancouver, BC",
        phone: "(555) 123-4567",
        email: "info@example.com",
        businessHours: "Mon-Fri 8AM-6PM"
      }
    }

    const newContent = await ContentModel.create(sampleContent)
    console.log("✅ Created sample content for testing")

    return Response.json({
      success: true,
      message: "Sample content created successfully",
      contentId: newContent._id,
      itemCounts: {
        reviews: sampleContent.reviews.length,
        services: sampleContent.services.length,
        galleryImages: sampleContent.galleryImages.length,
        testimonials: sampleContent.testimonials.length,
        blogPosts: sampleContent.blogPosts.length
      }
    })

  } catch (error) {
    console.error("❌ Debug Test Error:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    console.log("🧪 Debug Test: Clearing all content")

    await dbConnect()

    const result = await ContentModel.deleteMany({})
    console.log(`✅ Deleted ${result.deletedCount} content documents`)

    return Response.json({
      success: true,
      message: `Cleared ${result.deletedCount} content documents`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error("❌ Debug Test Error:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
