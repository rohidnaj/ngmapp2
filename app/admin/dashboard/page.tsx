"use client"

import { withAuth } from "@/lib/auth"
import { useContent } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, ImageIcon, Star, FileText, ArrowRight } from "lucide-react"

function DashboardPage() {
  const { content } = useContent()

  const stats = [
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
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </AdminLayout>
  )
}

export default withAuth(DashboardPage)

