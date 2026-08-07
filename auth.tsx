"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, pass: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("ngm_auth_user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      }
    } catch (e) {
      console.error("Auth initialization error:", e)
    }
  }, [])

  const login = async (email: string, pass: string) => {
    if (email && pass) {
      const dummyUser: User = { id: "1", name: "Admin", email, role: "admin" }
      setUser(dummyUser)
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("ngm_auth_user", JSON.stringify(dummyUser))
        }
      } catch (e) {}
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ngm_auth_user")
      }
    } catch (e) {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-muted-foreground font-medium">Loading...</div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
