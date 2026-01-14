"use client"

import { useState, useEffect } from "react"
import { withAuth } from "@/lib/auth"
import { useContent } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, ImageIcon, Star, FileText, ArrowRight, RefreshCw, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

function DashboardPage() {
  const { content } = useContent()
  const [refreshing, setRefreshing] = useState(false)
  
  // Real-time stat counts
  const [stats, setStats] = useState([
    {
      title: "Services",
      value: content.services.length,
      icon: <Briefcase className="h-8 w-8 text-green-600" />,
      path: "/admin/services",
    },
    {
      title: "Gallery Images",
      value: content.galleryImages.length,
      icon: <ImageIcon className="h-8 w-8 text-green-600" />,
      path: "/admin/gallery",
    },
    {
      title: "Reviews",
      value: content.reviews.length,
      icon: <Star className="h-8 w-8 text-green-600" />,
      path: "/admin/reviews",
    },
    {
      title: "Blog Posts",
      value: content.blogPosts.length,
      icon: <FileText className="h-8 w-8 text-green-600" />,
      path: "/admin/blog",
    },
    {
      title: "Testimonials",
      value: content.testimonials.length,
      icon: <MessageSquare className="h-8 w-8 text-green-600" />,
      path: "/admin/testimonials",
    },
  ])

  // Update stats whenever content changes
  useEffect(() => {
    const updatedStats = [
      {
        title: "Services",
        value: content.services.length,
        icon: <Briefcase className="h-8 w-8 text-green-600" />,
        path: "/admin/services",
      },
      {
        title: "Gallery Images",
        value: content.galleryImages.length,
        icon: <ImageIcon className="h-8 w-8 text-green-600" />,
        path: "/admin/gallery",
      },
      {
        title: "Reviews",
        value: content.reviews.length,
        icon: <Star className="h-8 w-8 text-green-600" />,
        path: "/admin/reviews",
      },
      {
        title: "Blog Posts",
        value: content.blogPosts.length,
        icon: <FileText className="h-8 w-8 text-green-600" />,
        path: "/admin/blog",
      },
      {
        title: "Testimonials",
        value: content.testimonials.length,
        icon: <MessageSquare className="h-8 w-8 text-green-600" />,
        path: "/admin/testimonials",
      },
    ]
    setStats(updatedStats)
  }, [content])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Link href={stat.path} key={index}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center">
                    View details <ArrowRight className="ml-1 h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Admin logged in</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Content updated</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default withAuth(DashboardPage)
