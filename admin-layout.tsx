"use client"

import React from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg text-primary">NGM Admin Panel</h1>
        <nav className="flex space-x-4 text-sm font-medium">
          <Link href="/" className="hover:text-primary">View Site</Link>
          <Link href="/admin/gallery" className="hover:text-primary">Gallery Admin</Link>
        </nav>
      </header>
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  )
}
