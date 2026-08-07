"use client"

import React from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="transition-opacity duration-300 ease-in-out">{children}</div>
}
