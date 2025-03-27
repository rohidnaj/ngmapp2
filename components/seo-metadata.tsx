"use client"

import { useEffect } from "react"
import Head from "next/head"

interface SeoMetadataProps {
  currentPage: string
  siteName: string
  baseUrl: string
}

export default function SeoMetadata({ currentPage, siteName, baseUrl }: SeoMetadataProps) {
  // Define metadata for each page
  const metadata = {
    home: {
      title: `${siteName} - Professional Landscaping Services in BC`,
      description:
        "Professional landscaping and garden maintenance services in British Columbia. We bring your dream garden to life.",
      image: `${baseUrl}/images/home-og.jpg`,
    },
    about: {
      title: `About ${siteName} - Our Story and Mission`,
      description:
        "Learn about our team of certified professionals with decades of experience in landscape architecture and horticulture.",
      image: `${baseUrl}/images/about-og.jpg`,
    },
    services: {
      title: `Our Services - ${siteName}`,
      description:
        "Explore our comprehensive range of landscaping services including lawn maintenance, garden design, and landscape installation.",
      image: `${baseUrl}/images/services-og.jpg`,
    },
    gallery: {
      title: `Project Gallery - ${siteName}`,
      description: "View our portfolio of completed landscaping projects across British Columbia.",
      image: `${baseUrl}/images/gallery-og.jpg`,
    },
    reviews: {
      title: `Client Reviews - ${siteName}`,
      description: "Read what our clients have to say about our landscaping and garden maintenance services.",
      image: `${baseUrl}/images/reviews-og.jpg`,
    },
    blog: {
      title: `Garden Blog - ${siteName}`,
      description: "Expert tips and advice on garden maintenance, landscaping, and outdoor living spaces.",
      image: `${baseUrl}/images/blog-og.jpg`,
    },
    contact: {
      title: `Contact ${siteName} - Get in Touch`,
      description: "Contact us for professional landscaping and garden maintenance services in British Columbia.",
      image: `${baseUrl}/images/contact-og.jpg`,
    },
    quote: {
      title: `Get a Free Quote - ${siteName}`,
      description: "Request a free quote for your landscaping project from our team of professionals.",
      image: `${baseUrl}/images/quote-og.jpg`,
    },
  }

  // Get current page metadata
  const current = metadata[currentPage as keyof typeof metadata] || metadata.home

  // Update document title when page changes
  useEffect(() => {
    document.title = current.title
  }, [currentPage, current.title])

  return (
    <Head>
      <meta name="description" content={current.description} />
      <meta property="og:title" content={current.title} />
      <meta property="og:description" content={current.description} />
      <meta property="og:image" content={current.image} />
      <meta property="og:url" content={`${baseUrl}/${currentPage === "home" ? "" : currentPage}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={current.title} />
      <meta name="twitter:description" content={current.description} />
      <meta name="twitter:image" content={current.image} />
    </Head>
  )
}

