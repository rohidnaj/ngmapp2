"use client"

import { AuthProvider } from "@/lib/auth"
import { ContentProvider } from "@/lib/content-context"
import { ThemeProvider } from "@/components/theme-provider"
import React from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ContentProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ContentProvider>
    </AuthProvider>
  )
}
