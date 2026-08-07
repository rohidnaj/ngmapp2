"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { saveContentToServer, loadContentFromServer } from "@/app/actions"
import { useWebSocketSync } from "@/hooks/use-websocket-sync"

// Define types for all content sections
export type Service = {
  title: string
  description: string
  image: string
  features: string[]
}

export type Testimonial = {
  content: string
  author: string
  location: string
}

export type GalleryImage = {
  url: string
  title: string
  description: string
  type?: 'upload' | 'url' // 'upload' for uploaded files, 'url' for external URLs
  fileId?: string // For uploaded files
}

export type Review = {
  author: string
  date: string
  content: string
}

export type BlogPost = {
  title: string
  date: string
  image: string
  excerpt: string
}

export type ContactInfo = {
  address: string
  phone: string
  email: string
  businessHours: string
}

export type AboutInfo = {
  story: string
  image: string
  stats: {
    years: number
    satisfaction: number
  }
}

export type HomeInfo = {
  heroImage: string
  heroTitle: string
  heroDescription: string
  heroButtonText: string
}

// Define the content state type
export type ContentState = {
  home: HomeInfo
  about: AboutInfo
  services: Service[]
  testimonials: Testimonial[]
  galleryImages: GalleryImage[]
  reviews: Review[]
  blogPosts: BlogPost[]
  contactInfo: ContactInfo
}

export type SyncStatus = "connecting" | "connected" | "disconnected" | "syncing" | "error"

// Define the context type
type ContentContextType = {
  content: ContentState
  updateContent: (newContent: Partial<ContentState>) => void
  updateService: (index: number, service: Service) => void
  updateTestimonial: (index: number, testimonial: Testimonial) => void
  updateGalleryImage: (index: number, image: GalleryImage) => void
  updateReview: (index: number, review: Review) => void
  updateBlogPost: (index: number, post: BlogPost) => void
  addService: (service: Service) => void
  addTestimonial: (testimonial: Testimonial) => void
  addGalleryImage: (image: GalleryImage) => void
  addReview: (review: Review) => void
  addBlogPost: (post: BlogPost) => void
  removeService: (index: number) => void
  removeTestimonial: (index: number) => void
  removeGalleryImage: (index: number) => void
  removeReview: (index: number) => void
  removeBlogPost: (index: number) => void
  refreshContent: () => void
  syncStatus: SyncStatus
  lastSyncTime: number | null
  clientId: string | null
}

// Create the context
export const ContentContext = createContext<ContentContextType>({
  content: {} as ContentState,
  updateContent: () => {},
  updateService: () => {},
  updateTestimonial: () => {},
  updateGalleryImage: () => {},
  updateReview: () => {},
  updateBlogPost: () => {},
  addService: () => {},
  addTestimonial: () => {},
  addGalleryImage: () => {},
  addReview: () => {},
  addBlogPost: () => {},
  removeService: () => {},
  removeTestimonial: () => {},
  removeGalleryImage: () => {},
  removeReview: () => {},
  removeBlogPost: () => {},
  refreshContent: () => {},
  syncStatus: "disconnected",
  lastSyncTime: null,
  clientId: null,
})

// Initial content state
const initialContent: ContentState = {
  home: {
    heroImage: "https://public.readdy.ai/ai/img_res/3b7ff92339c24e7d261f9a1598864e06.jpg",
    heroTitle: "Transform Your Outdoor Space",
    heroDescription:
      "Professional landscaping and garden maintenance services in British Columbia. We bring your dream garden to life.",
    heroButtonText: "Explore Our Services",
  },
  about: {
    story:
      "Najm Garden & Maintenance started with a simple goal—to help people keep their outdoor spaces beautiful and stress-free. With a passion for landscaping and years of experience, we built a company that values hard work, reliability, and quality service. From small gardens to large yards, we treat every project with care, making sure your outdoor space looks its best. Whether it's lawn care, trimming, planting, or cleanups, we're here to help. We believe a great yard brings joy, and we're proud to be a part of that. Let's grow something amazing together!",
    image: "https://cdn.pixabay.com/photo/2016/09/19/17/15/beautiful-home-1680787_1280.jpg",
    stats: {
      years: 10,
      satisfaction: 98,
    },
  },
  services: [
    {
      title: "Lawn Maintenance",
      description: "Professional lawn care services including mowing, edging, and seasonal maintenance.",
      image: "https://public.readdy.ai/ai/img_res/73879fc841bfcbaa6c141e302d18a863.jpg",
      features: [
        "Weekly/Bi-weekly mowing",
        "Edging and trimming",
        "Fertilization",
        "Weed control",
        "Seasonal clean-up",
      ],
    },
    {
      title: "Garden Design",
      description: "Custom garden design services to create your perfect outdoor living space.",
      image: "https://public.readdy.ai/ai/img_res/6dc820df0599e0a09b7c83d00428bcc7.jpg",
      features: [
        "Custom design plans",
        "Plant selection",
        "Color coordination",
        "Seasonal planning",
        "Sustainable designs",
      ],
    },
  ],
  testimonials: [
    {
      content:
        "Younger, family run business who does good work for reasonable prices. Highly recommend them for their service, efficiency and quality of work.",
      author: "Jonathan Fernandes",
      location: "Google review",
    },
    {
      content:
        "I had an excellent experience with Najm. He was extremely knowledgeable and very efficient and fast with his service. I would highly recommend this company.",
      author: "nimnao7",
      location: "Google review",
    },
    {
      content: "Very prompt response. Courteous and responsive to our questions and requests.",
      author: "Anne P",
      location: "Google review",
    },
  ],
  galleryImages: [
    {
      url: "https://public.readdy.ai/ai/img_res/0883d917ca46bf004446c24d1ef88ffb.jpg",
      title: "Modern Garden Oasis",
      description: "Contemporary design with water features",
    },
    {
      url: "https://public.readdy.ai/ai/img_res/0d1dc6fd3fc58dafc76897e35252efa4.jpg",
      title: "Flowering Paradise",
      description: "Seasonal color display",
    },
    {
      url: "https://public.readdy.ai/ai/img_res/d44c3ed1674bfe247874c3a61f4b8627.jpg",
      title: "Outdoor Living",
      description: "Custom patio design",
    },
    {
      url: "https://public.readdy.ai/ai/img_res/03e99e7a08defaaa5c9ff98777bd7da9.jpg",
      title: "Zen Garden",
      description: "Minimalist design",
    },
    {
      url: "https://public.readdy.ai/ai/img_res/315816a473d998f23ecf7e296398c209.jpg",
      title: "Evening Garden",
      description: "Landscape lighting",
    },
    {
      url: "https://public.readdy.ai/ai/img_res/725674077dd1c9f996b66ab6094c7f1c.jpg",
      title: "Sustainable Garden",
      description: "Eco-friendly design",
    },
  ],
  reviews: [
    {
      author: "Jonathan Fernandes",
      date: "June 1, 2025",
      content:
        "Younger, family run business who does good work for reasonable prices. Highly recommend them for their service, efficiency and quality of work.",
    },
    {
      author: "nimnao7",
      date: "May 10, 2025",
      content:
        "I had an excellent experience with Najm. He was extremely knowledgeable and very efficient and fast with his service. I would highly recommend this company.",
    },
    {
      author: "Anne P",
      date: "May 3, 2025",
      content: "Very prompt response. Courteous and responsive to our questions and requests.",
    },
    {
      author: "Said Raihan",
      date: "July 19, 2025",
      content: "Left a 5-star rating on Google.",
    },
  ],
  blogPosts: [
    {
      title: "Spring Garden Preparation Guide",
      date: "March 18, 2025",
      image: "https://public.readdy.ai/ai/img_res/73bea78aded70d65a880f48168ad0fd6.jpg",
      excerpt:
        "Essential tips for preparing your garden for the spring season, including soil preparation and plant selection.",
    },
    {
      title: "Water-Efficient Garden Design",
      date: "March 16, 2025",
      image: "https://public.readdy.ai/ai/img_res/fc2799dfabeecd35fcab6172ccc8c073.jpg",
      excerpt: "Learn about sustainable gardening practices and how to create a beautiful, water-efficient landscape.",
    },
    {
      title: "Creating Perfect Outdoor Living Spaces",
      date: "March 14, 2025",
      image: "https://public.readdy.ai/ai/img_res/0adc0edd030c2b53290a4d3d5b41f31b.jpg",
      excerpt: "Design tips for creating functional and stylish outdoor living areas that extend your home.",
    },
  ],
  contactInfo: {
    address: "Bc Maple Ridge",
    phone: "+1 (778) 233-1599",
    email: "info@ngmlandscape.ca",
    businessHours: "Monday - Friday: Always Open",
  },
}

// Content provider component
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentState>(initialContent)
  const [loading, setLoading] = useState(true)
  const isUpdatingFromServer = useRef(false)

  // Use the new WebSocket sync hook
  const {
    status: syncStatus,
    clientId,
    lastSyncTime,
    syncOperation,
    connect,
    disconnect,
  } = useWebSocketSync({
    onContentUpdate: (data, event) => {
      if (event?.type === 'global-sync') {
        // Global sync event - force refresh from server
        console.log("[Real-time] Global sync triggered, refreshing from server...")
        refreshContent()
        return
      }

      console.log("[Real-time] Content update received:", data)
      isUpdatingFromServer.current = true
      setContent(data)
      // Update localStorage
      localStorage.setItem("ngm-content", JSON.stringify(data))
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromServer.current = false
      }, 100)
    },
    enabled: true,
  })

  const broadcastUpdate = useCallback(
    async (updatedContent: ContentState) => {
      if (!syncOperation) return

      try {
        await syncOperation({
          type: "update",
          entityType: "content",
          entityId: "full-content",
          data: updatedContent,
          optimistic: false, // Don't use optimistic updates for content sync
        })
      } catch (error) {
        console.error("Failed to broadcast update:", error)
      }
    },
    [syncOperation],
  )

  // Load content from server on mount - prioritize fresh server data
  useEffect(() => {
    async function loadContentData() {
      try {
        console.log("Loading content from server...")
        const serverResult = await loadContentFromServer()

        if (serverResult.success && serverResult.content) {
          console.log("✅ Loaded fresh content from server")
          setContent(serverResult.content)
          localStorage.setItem("ngm-content", JSON.stringify(serverResult.content))
        } else {
          console.log("⚠️ No content found on server, checking localStorage...")
          // Try localStorage as fallback
          const savedContent = localStorage.getItem("ngm-content")
          if (savedContent) {
            const parsedContent = JSON.parse(savedContent)
            console.log("Loaded content from localStorage")
            setContent(parsedContent)
            // Try to save to server for future loads
            try {
              await saveContentToServer(parsedContent)
              console.log("Saved localStorage content to server")
            } catch (saveError) {
              console.warn("Failed to save localStorage content to server:", saveError)
            }
          } else {
            console.log("No content found anywhere, using initial content")
            setContent(initialContent)
            localStorage.setItem("ngm-content", JSON.stringify(initialContent))
            // Try to save initial content to server
            try {
              await saveContentToServer(initialContent)
              console.log("Saved initial content to server")
            } catch (saveError) {
              console.warn("Failed to save initial content to server:", saveError)
            }
          }
        }
      } catch (error) {
        console.error("❌ Error loading content from server:", error)

        // Fallback to localStorage if server fails
        try {
          const savedContent = localStorage.getItem("ngm-content")
          if (savedContent) {
            console.log("Fallback: Loaded content from localStorage")
            setContent(JSON.parse(savedContent))
          } else {
            console.log("Fallback: Using initial content")
            setContent(initialContent)
          }
        } catch (localError) {
          console.error("❌ Fallback failed:", localError)
          setContent(initialContent)
        }
      } finally {
        setLoading(false)
      }
    }

    loadContentData()

    // Connect to WebSocket sync for real-time updates
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Save content to server whenever it changes (but not from server updates)
  useEffect(() => {
    if (!loading && !isUpdatingFromServer.current) {
      async function saveContentData() {
        try {
          localStorage.setItem("ngm-content", JSON.stringify(content))

          const result = await saveContentToServer(content)
          if (result.success) {
            console.log("Saved content to server")
            broadcastUpdate(content)
          } else {
            console.error("Failed to save to server:", result.message)
          }
        } catch (error) {
          console.error("Error saving content:", error)
        }
      }

      saveContentData()
    }
  }, [content, loading, broadcastUpdate])

  // Update entire content or sections
  const updateContent = (newContent: Partial<ContentState>) => {
    try {
      setContent((prev) => ({ ...prev, ...newContent }))
      console.log("Content updated:", newContent)
    } catch (error) {
      console.error("Error updating content:", error)
    }
  }

  // Update a specific service
  const updateService = (index: number, service: Service) => {
    try {
      setContent((prev) => ({
        ...prev,
        services: prev.services.map((s, i) => (i === index ? service : s)),
      }))
    } catch (error) {
      console.error("Error updating service:", error)
    }
  }

  // Update a specific testimonial
  const updateTestimonial = (index: number, testimonial: Testimonial) => {
    try {
      setContent((prev) => ({
        ...prev,
        testimonials: prev.testimonials.map((t, i) => (i === index ? testimonial : t)),
      }))
    } catch (error) {
      console.error("Error updating testimonial:", error)
    }
  }

  // Update a specific gallery image
  const updateGalleryImage = (index: number, image: GalleryImage) => {
    try {
      setContent((prev) => ({
        ...prev,
        galleryImages: prev.galleryImages.map((img, i) => (i === index ? image : img)),
      }))
    } catch (error) {
      console.error("Error updating gallery image:", error)
    }
  }

  // Update a specific review
  const updateReview = (index: number, review: Review) => {
    try {
      setContent((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r, i) => (i === index ? review : r)),
      }))
    } catch (error) {
      console.error("Error updating review:", error)
    }
  }

  // Update a specific blog post
  const updateBlogPost = (index: number, post: BlogPost) => {
    try {
      setContent((prev) => ({
        ...prev,
        blogPosts: prev.blogPosts.map((p, i) => (i === index ? post : p)),
      }))
    } catch (error) {
      console.error("Error updating blog post:", error)
    }
  }

  // Add functions
  const addService = (service: Service) => {
    setContent((prev) => ({ ...prev, services: [...prev.services, service] }))
  }

  const addTestimonial = (testimonial: Testimonial) => {
    setContent((prev) => ({ ...prev, testimonials: [...prev.testimonials, testimonial] }))
  }

  const addGalleryImage = (image: GalleryImage) => {
    setContent((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, image] }))
  }

  const addReview = (review: Review) => {
    setContent((prev) => ({ ...prev, reviews: [...prev.reviews, review] }))
  }

  const addBlogPost = (post: BlogPost) => {
    setContent((prev) => ({ ...prev, blogPosts: [...prev.blogPosts, post] }))
  }

  // Remove functions
  const removeService = (index: number) => {
    setContent((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }))
  }

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }))
  }

  const removeGalleryImage = (index: number) => {
    setContent((prev) => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }))
  }

  const removeReview = (index: number) => {
    setContent((prev) => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== index) }))
  }

  const removeBlogPost = (index: number) => {
    setContent((prev) => ({ ...prev, blogPosts: prev.blogPosts.filter((_, i) => i !== index) }))
  }

  // Refresh content from server
  const refreshContent = async () => {
    try {
      console.log("🔄 FORCE REFRESH: Refreshing content from server...")

      // Clear any cached connection to ensure fresh data
      if (typeof global !== 'undefined' && global.mongoose) {
        console.log("Clearing MongoDB connection cache")
        global.mongoose.conn = null
        global.mongoose.promise = null
      }

      const serverResult = await loadContentFromServer()

      if (serverResult.success && serverResult.content) {
        console.log("✅ REFRESH SUCCESS: Loaded content from server", {
          reviews: serverResult.content.reviews?.length || 0,
          services: serverResult.content.services?.length || 0,
          gallery: serverResult.content.galleryImages?.length || 0
        })

        isUpdatingFromServer.current = true
        setContent(serverResult.content)
        localStorage.setItem("ngm-content", JSON.stringify(serverResult.content))
        setLastSyncTime(Date.now())

        setTimeout(() => {
          isUpdatingFromServer.current = false
        }, 100)

        return { success: true, data: serverResult.content }
      } else {
        console.error("❌ REFRESH FAILED: Server returned no content or error", serverResult)
        return { success: false, error: serverResult.message || "No content returned" }
      }
    } catch (error) {
      console.error("❌ REFRESH ERROR: Failed to refresh content from server:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  const value = {
    content,
    updateContent,
    updateService,
    updateTestimonial,
    updateGalleryImage,
    updateReview,
    updateBlogPost,
    addService,
    addTestimonial,
    addGalleryImage,
    addReview,
    addBlogPost,
    removeService,
    removeTestimonial,
    removeGalleryImage,
    removeReview,
    removeBlogPost,
    refreshContent,
    syncStatus,
    lastSyncTime,
    clientId,
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

// Hook to use content context
export const useContent = () => {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}
