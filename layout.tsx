import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { ContentProvider } from "@/lib/content-context"
import type { Metadata } from "next"
import { Fraunces, Manrope } from "next/font/google"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Najm Garden & Maintenance",
  description: "Professional landscaping and garden maintenance services in British Columbia",
  metadataBase: new URL("https://ngmlandscape.ca"),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://ngmlandscape.ca",
    title: "Najm Garden & Maintenance",
    description: "Professional landscaping and garden maintenance services in British Columbia",
    siteName: "Najm Garden & Maintenance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Najm Garden & Maintenance",
    description: "Professional landscaping and garden maintenance services in British Columbia",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-body">
        <AuthProvider>
          <ContentProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'
