import React from "react"

interface SeoMetadataProps {
  currentPage?: string
  siteName?: string
  baseUrl?: string
}

export default function SeoMetadata({ currentPage = "home", siteName = "Najm Garden", baseUrl = "https://ngmlandscape.ca" }: SeoMetadataProps) {
  const title = `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} | ${siteName}`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content="Professional landscaping and garden maintenance services in British Columbia" />
    </>
  )
}
