"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Briefcase, ImageIcon, Star, FileText, MessageSquare, Settings, HomeIcon, LogOut, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useContent } from "@/lib/content-context"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth()
  const { content } = useContent()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/admin/home", label: "Home", icon: HomeIcon },
    { href: "/admin/about", label: "About", icon: HomeIcon },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/contact", label: "Contact", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    
    // Re-sync content from localStorage to ensure we're working with the latest data
    try {
      // First, force a save of current content to localStorage
      localStorage.setItem("ngm-content", JSON.stringify(content))
      
      // Clear localStorage cache for one second to force a complete refresh
      setTimeout(() => {
        // Force reload the page to completely refresh content state
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Error during refresh:", error)
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className={`${isMobile ? "hidden" : "w-64"} bg-white shadow-sm`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-green-800">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <div
                        className={`flex items-center px-4 py-3 rounded-md cursor-pointer ${
                          pathname === link.href ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {link.label}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4">
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="w-full mb-3">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Site"}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-bold text-green-800">Admin Panel</h1>
            <button onClick={() => setIsMenuOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                      <div
                        className={`flex items-center px-4 py-3 rounded-md cursor-pointer ${
                          pathname === link.href ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {link.label}
                      </div>
                    </Link>
                  </li>
                )
              })}
              <li>
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="w-full mt-4 mb-2">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh Site"}
                </Button>
              </li>
              <li>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  )
}

