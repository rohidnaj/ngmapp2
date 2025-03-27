"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

// Simple auth types
export type User = {
  id: string
  email: string
  name: string
  role: "admin"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock user for demo purposes
const MOCK_USER: User = {
  id: "1",
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@ngmlandscape.ca",
  name: "Admin User",
  role: "admin",
}

// Create auth context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
})

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("ngm-admin-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      // Simple mock authentication - in production, use proper API calls
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        setUser(MOCK_USER)
        if (typeof window !== 'undefined') {
          localStorage.setItem("ngm-admin-user", JSON.stringify(MOCK_USER))
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("ngm-admin-user")
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext)

// HOC to protect admin routes
export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { user, loading } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    // Don't render anything until we've checked for the user
    if (loading || !mounted) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    // If not authenticated, redirect to login
    if (!user) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login"
      }
      return null
    }

    // If authenticated, render the protected component
    return <Component {...props} />
  }
}

