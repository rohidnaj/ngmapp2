"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

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
        "Najm Garden transformed our backyard into a stunning retreat. Their attention to detail and professional service exceeded our expectations.",
      author: "Michael Anderson",
      location: "Vancouver, BC",
    },
    {
      content:
        "The team's expertise in garden design and maintenance is outstanding. They've been maintaining our property for two years, and it's never looked better.",
      author: "Elizabeth Richardson",
      location: "Victoria, BC",
    },
    {
      content:
        "Exceptional service from start to finish. Their creative design solutions and quality workmanship have made our garden the envy of the neighborhood.",
      author: "Robert Thompson",
      location: "Surrey, BC",
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
      author: "Jennifer Lawrence",
      date: "March 15, 2025",
      content:
        "Working with Najm Garden was an absolute pleasure. Their team transformed our outdated backyard into a modern oasis that we enjoy year-round. The attention to detail and professional service was outstanding.",
    },
    {
      author: "David Chen",
      date: "March 12, 2025",
      content:
        "The design team at Najm Garden truly understood our vision. They created a perfect blend of functional space and beautiful landscaping that has completely transformed how we use our outdoor space.",
    },
    {
      author: "Sarah Williams",
      date: "March 10, 2025",
      content:
        "We've been using Najm Garden's maintenance services for over a year now, and our garden has never looked better. Their team is reliable, professional, and always goes above and beyond.",
    },
    {
      author: "James Patterson",
      date: "March 8, 2025",
      content:
        "The hardscaping work they did on our property was exceptional. The new patio and retaining walls have added so much value to our home. Highly recommended!",
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

  // Load content from localStorage on mount
  useEffect(() => {
    const storedContent = localStorage.getItem("ngm-content")
    if (storedContent) {
      try {
        setContent(JSON.parse(storedContent))
      } catch (error) {
        console.error("Failed to parse stored content:", error)
      }
    }
  }, [])

  // Save content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ngm-content", JSON.stringify(content))
  }, [content])

  // Update entire content or sections
  const updateContent = (newContent: Partial<ContentState>) => {
    setContent((prev) => ({ ...prev, ...newContent }))
  }

  // Update a specific service
  const updateService = (index: number, service: Service) => {
    setContent((prev) => {
      const newServices = [...prev.services]
      newServices[index] = service
      return { ...prev, services: newServices }
    })
  }

  // Update a specific testimonial
  const updateTestimonial = (index: number, testimonial: Testimonial) => {
    setContent((prev) => {
      const newTestimonials = [...prev.testimonials]
      newTestimonials[index] = testimonial
      return { ...prev, testimonials: newTestimonials }
    })
  }

  // Update a specific gallery image
  const updateGalleryImage = (index: number, image: GalleryImage) => {
    setContent((prev) => {
      const newGalleryImages = [...prev.galleryImages]
      newGalleryImages[index] = image
      return { ...prev, galleryImages: newGalleryImages }
    })
  }

  // Update a specific review
  const updateReview = (index: number, review: Review) => {
    setContent((prev) => {
      const newReviews = [...prev.reviews]
      newReviews[index] = review
      return { ...prev, reviews: newReviews }
    })
  }

  // Update a specific blog post
  const updateBlogPost = (index: number, post: BlogPost) => {
    setContent((prev) => {
      const newBlogPosts = [...prev.blogPosts]
      newBlogPosts[index] = post
      return { ...prev, blogPosts: newBlogPosts }
    })
  }

  // Add a new service
  const addService = (service: Service) => {
    setContent((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }))
  }

  // Add a new testimonial
  const addTestimonial = (testimonial: Testimonial) => {
    setContent((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, testimonial],
    }))
  }

  // Add a new gallery image
  const addGalleryImage = (image: GalleryImage) => {
    setContent((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, image],
    }))
  }

  // Add a new review
  const addReview = (review: Review) => {
    setContent((prev) => ({
      ...prev,
      reviews: [...prev.reviews, review],
    }))
  }

  // Add a new blog post
  const addBlogPost = (post: BlogPost) => {
    setContent((prev) => ({
      ...prev,
      blogPosts: [...prev.blogPosts, post],
    }))
  }

  // Remove a service
  const removeService = (index: number) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  // Remove a testimonial
  const removeTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }))
  }

  // Remove a gallery image
  const removeGalleryImage = (index: number) => {
    setContent((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }))
  }

  // Remove a review
  const removeReview = (index: number) => {
    setContent((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }))
  }

  // Remove a blog post
  const removeBlogPost = (index: number) => {
    setContent((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.filter((_, i) => i !== index),
    }))
  }

  return (
    <ContentContext.Provider
      value={{
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
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

// Hook to use content context
export const useContent = () => useContext(ContentContext)

