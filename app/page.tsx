"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TestimonialCarousel from "@/components/testimonial-carousel"
import PageTransition from "@/components/page-transition"
import ContactForm from "@/components/contact-form"
import QuoteForm from "@/components/quote-form"
import SeoMetadata from "@/components/seo-metadata"
import MobileMenu from "@/components/mobile-menu"
import { useContent } from "@/lib/content-context"
import { RefreshCw, Bug, X } from "lucide-react"

export default function Home() {
  const { content, refreshContent, syncStatus, lastSyncTime } = useContent()
  const [currentPage, setCurrentPage] = useState("home")
  const [isMounted, setIsMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  // Set isMounted to true after component mounts to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
    console.log("🏠 Home page mounted, sync status:", syncStatus)
  }, [syncStatus])

  // Log content updates for debugging
  useEffect(() => {
    console.log("📄 Content updated:", {
      reviewsCount: content.reviews?.length || 0,
      servicesCount: content.services?.length || 0,
      galleryCount: content.galleryImages?.length || 0,
      lastSyncTime,
      syncStatus
    })
  }, [content, lastSyncTime, syncStatus])

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return "Never"
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (diff < 60000) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return `${hours}h ago`
  }

  const navItems = ["Home", "About", "Services", "Gallery", "Reviews", "Blog", "Contact"]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      console.log("🔄 Force refreshing content from server...")
      await refreshContent()
      console.log("✅ Content refreshed successfully from server")

      // Broadcast global sync event to all connected clients across all domains
      try {
        const response = await fetch('/api/realtime/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'global-sync',
            data: {
              action: 'force-refresh',
              timestamp: Date.now(),
              domain: window.location.hostname,
              userAgent: navigator.userAgent.substring(0, 50)
            },
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log(`📡 Global sync broadcast sent to ${result.clientCount} clients`)
        } else {
          console.warn("⚠️ Global sync broadcast failed with status:", response.status)
        }
      } catch (broadcastError) {
        console.warn("⚠️ Global sync broadcast failed:", broadcastError)
      }

    } catch (error) {
      console.error("❌ Failed to refresh content:", error)
      // Show user-friendly error with more details
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to refresh content: ${errorMessage}. Please check your connection and try again.`)
    } finally {
      setTimeout(() => setIsRefreshing(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Metadata */}
      <SeoMetadata currentPage={currentPage} siteName="Najm Garden & Maintenance" baseUrl="https://ngmlandscape.ca" />

      <nav className="fixed top-0 w-full bg-white/95 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div
              onClick={() => setCurrentPage("home")}
              className="text-xl md:text-2xl font-bold text-green-800 cursor-pointer"
            >
              Najm Garden
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  onClick={() => setCurrentPage(item.toLowerCase())}
                  className={`
                    cursor-pointer whitespace-nowrap
                    ${currentPage === item.toLowerCase() ? "text-green-700 font-semibold" : "text-gray-600 hover:text-green-700"}
                  `}
                >
                  {item}
                </a>
              ))}

              {/* Sync Status and Controls */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-md border">
                <div className={`w-2 h-2 rounded-full ${
                  syncStatus === 'connected' ? 'bg-green-500' :
                  syncStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                  syncStatus === 'error' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} title={`Real-time sync: ${syncStatus}${lastSyncTime ? ` (${formatLastSync(lastSyncTime)})` : ''}`} />
                <span className="text-xs text-gray-600 hidden lg:inline">
                  {syncStatus === 'connected' ? 'Live' :
                   syncStatus === 'connecting' ? 'Connecting...' :
                   syncStatus === 'error' ? 'Offline' : 'Disconnected'}
                </span>
                {lastSyncTime && (
                  <span className="text-xs text-gray-500 hidden xl:inline">
                    {formatLastSync(lastSyncTime)}
                  </span>
                )}
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                  title="Force refresh content from server and sync across all devices and domains"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-500" : "text-gray-600"}`} />
                </Button>
                <Button
                  onClick={() => setShowDebug(!showDebug)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                  title="Toggle debug information"
                >
                  <Bug className="h-4 w-4 text-gray-600" />
                </Button>
              </div>

              <Button
                onClick={() => setCurrentPage("quote")}
                className="bg-green-700 text-white px-6 py-2 rounded-md cursor-pointer whitespace-nowrap"
              >
                Get Free Quote
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isMounted && <MobileMenu navItems={navItems} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          </div>
        </div>
      </nav>

      <PageTransition currentPage={currentPage}>
        {/* Home Page */}
        {currentPage === "home" && (
          <div className="pt-20">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[600px]">
              <div className="absolute inset-0">
                  <Image
                    src={content.home.heroImage || "/placeholder.svg"}
                    alt="Garden landscape"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{content.home.heroTitle}</h1>
                  <p className="text-lg md:text-xl mb-6 md:mb-8">{content.home.heroDescription}</p>
                  <Button
                    onClick={() => setCurrentPage("services")}
                    className="bg-white text-green-800 px-6 py-2 md:px-8 md:py-3 text-base md:text-lg font-semibold rounded-md cursor-pointer whitespace-nowrap"
                  >
                    {content.home.heroButtonText}
                  </Button>
                </div>
              </div>
            </div>

            {/* Services Preview */}
            <div className="py-12 md:py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {content.services.map((service, index) => (
                    <Card
                      key={index}
                      onClick={() => setCurrentPage("services")}
                      className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-0">
                        <div className="w-full h-40 md:h-48 relative mb-4">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover object-top rounded-lg"
                          />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm md:text-base">{service.description}</p>
                        <span className="text-green-700 font-semibold cursor-pointer whitespace-nowrap rounded-md">
                          Learn More →
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">What Our Clients Say</h2>
                <TestimonialCarousel testimonials={content.testimonials} />
              </div>
            </div>
          </div>
        )}

        {/* About Page */}
        {currentPage === "about" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">About Najm Garden</h1>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
                <div className="relative w-full h-[300px] md:h-[400px]">
                  <Image
                    src={content.about.image || "/placeholder.svg"}
                    alt="Our team"
                    fill
                    className="rounded-lg shadow-lg object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Our Story</h2>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">{content.about.story}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
                <div className="text-center p-4 md:p-6">
                  <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2 md:mb-4">
                    {content.about.stats.years}+
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">Years of Experience</div>
                </div>

                <div className="text-center p-4 md:p-6 col-span-2 md:col-span-1">
                  <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2 md:mb-4">
                    {content.about.stats.satisfaction}%
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Page */}
        {currentPage === "services" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Our Services</h1>
              <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                {content.services.map((service, index) => (
                  <Card key={index} className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <CardContent className="p-0">
                      <div className="w-full h-48 md:h-64 relative mb-4 md:mb-6">
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover object-top rounded-lg"
                        />
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{service.title}</h3>
                      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">{service.description}</p>
                      <ul className="text-gray-600 space-y-1 md:space-y-2 text-sm md:text-base">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="text-green-700 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Page */}
        {currentPage === "gallery" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Our Gallery</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {content.galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-56 md:h-72 relative">
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover object-top rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center p-4">
                        <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{image.title}</h3>
                        <p className="text-xs md:text-sm">{image.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Page */}
        {currentPage === "reviews" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Client Reviews</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {content.reviews.map((review, index) => (
                  <Card key={index} className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <CardContent className="p-0">
                      <div className="flex text-yellow-400 mb-3 md:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 md:h-5 md:w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 md:mb-6 italic text-sm md:text-base">
                        &quot;{review.content}&quot;
                      </p>
                      <div className="flex items-center">
                        <div>
                          <div className="font-semibold text-sm md:text-base">{review.author}</div>
                          <div className="text-gray-500 text-xs md:text-sm">{review.date}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog Page */}
        {currentPage === "blog" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Garden Blog</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {content.blogPosts.map((post, index) => (
                  <Card key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="w-full h-40 md:h-48 relative">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <div className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">{post.date}</div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{post.excerpt}</p>
                      <Button variant="link" className="text-green-700 font-semibold p-0 text-sm md:text-base">
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Page */}
        {currentPage === "contact" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Contact Us</h1>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <Card className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                  <CardContent className="p-0">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Send Us a Message</h2>
                    <ContactForm />
                  </CardContent>
                </Card>
                <div>
                  <Card className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-6 md:mb-8">
                    <CardContent className="p-0">
                      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Contact Information</h2>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center">
                          <MapPin className="text-green-700 w-6 md:w-8 h-5 md:h-6 flex-shrink-0" />
                          <span className="ml-2 text-sm md:text-base">{content.contactInfo.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-green-700 w-6 md:w-8 h-5 md:h-6 flex-shrink-0" />
                          <span className="ml-2 text-sm md:text-base">{content.contactInfo.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="text-green-700 w-6 md:w-8 h-5 md:h-6 flex-shrink-0" />
                          <span className="ml-2 text-sm md:text-base">{content.contactInfo.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <CardContent className="p-0">
                      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Business Hours</h2>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm md:text-base">
                          <span>Monday - Friday</span>
                          <span>Always Open</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote Page */}
        {currentPage === "quote" && (
          <div className="pt-24 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Get a Free Quote</h1>
              <Card className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <CardContent className="p-0">
                  <QuoteForm services={content.services} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </PageTransition>

      {/* Contact Section */}
      <div className="bg-green-800 text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Ready to Transform Your Garden?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8">Contact us today for a free consultation</p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <Phone className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">{content.contactInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">{content.contactInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm z-50 border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">🔍 Sync Debug</h3>
            <Button
              onClick={() => setShowDebug(false)}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs space-y-1">
            <div>Domain: {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</div>
            <div>Status: {syncStatus}</div>
            <div>Last Sync: {formatLastSync(lastSyncTime)}</div>
            <div>Client ID: {clientId ? clientId.slice(0, 8) + '...' : 'None'}</div>
            <div>Reviews: {content.reviews?.length || 0}</div>
            <div>Services: {content.services?.length || 0}</div>
            <div>Gallery: {content.galleryImages?.length || 0}</div>
            <div className="pt-2 border-t space-y-2">
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/debug/content')
                    const data = await response.json()
                    console.log('Database content:', data)
                    alert(`Database check: ${data.content.reviews.count} reviews, ${data.content.galleryImages.count} gallery items\nDomain: ${data.domain}\nTotal items: ${data.syncInfo.totalItems}`)
                  } catch (error) {
                    console.error('Debug fetch failed:', error)
                    alert('Failed to check database')
                  }
                }}
                size="sm"
                className="w-full text-xs"
              >
                Check Database
              </Button>

              <Button
                onClick={async () => {
                  const domains = ['https://ngmlandscapeca.vercel.app', 'https://www.ngmlandscape.ca']
                  const results = []

                  for (const domain of domains) {
                    try {
                      const response = await fetch(`${domain}/api/debug/content`, {
                        mode: 'cors',
                        headers: { 'Accept': 'application/json' }
                      })
                      if (response.ok) {
                        const data = await response.json()
                        results.push(`${domain}: ${data.syncInfo.totalItems} items`)
                      } else {
                        results.push(`${domain}: Failed (${response.status})`)
                      }
                    } catch (error) {
                      results.push(`${domain}: Error`)
                    }
                  }

                  alert(`Cross-domain sync check:\n${results.join('\n')}`)
                }}
                size="sm"
                variant="outline"
                className="w-full text-xs border-white/20 text-white hover:bg-white/10"
              >
                Check Both Domains
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
