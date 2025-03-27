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
  email: "admin@ngmlandscape.ca",
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
    try {
      const storedUser = localStorage.getItem("ngm-admin-user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log("Found stored user:", parsedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error reading stored user:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", { email, password })
      
      // Simple authentication
      if (email === "admin@ngmlandscape.ca" && password === "admin123") {
        console.log("Login successful")
        setUser(MOCK_USER)
        localStorage.setItem("ngm-admin-user", JSON.stringify(MOCK_USER))
        return true
      }
      
      console.log("Login failed - invalid credentials")
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Logout function
  const logout = () => {
    console.log("Logging out")
    setUser(null)
    localStorage.removeItem("ngm-admin-user")
  }

  const value = {
    user,
    loading,
    login,
    logout,
  }

  console.log("AuthProvider state:", { user, loading })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

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

