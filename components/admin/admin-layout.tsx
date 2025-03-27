"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Home, Info, Briefcase, Image, Star, FileText, Mail, LogOut, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Home Page", path: "/admin/home", icon: <Home className="h-5 w-5" /> },
    { name: "About", path: "/admin/about", icon: <Info className="h-5 w-5" /> },
    { name: "Services", path: "/admin/services", icon: <Briefcase className="h-5 w-5" /> },
    { name: "Gallery", path: "/admin/gallery", icon: <Image className="h-5 w-5" /> },
    { name: "Reviews", path: "/admin/reviews", icon: <Star className="h-5 w-5" /> },
    { name: "Blog", path: "/admin/blog", icon: <FileText className="h-5 w-5" /> },
    { name: "Contact", path: "/admin/contact", icon: <Mail className="h-5 w-5" /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold text-green-800">NGM Admin</h1>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === item.path
                    ? "bg-green-100 text-green-800"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button onClick={handleLogout} variant="outline" className="w-full flex items-center justify-center">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-green-800">NGM Admin</h1>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 border-b px-4">
              <h1 className="text-xl font-bold text-green-800">NGM Admin</h1>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    pathname === item.path
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button onClick={handleLogout} variant="outline" className="w-full flex items-center justify-center">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <div className="py-6 px-4 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

