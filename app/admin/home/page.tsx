"use client"

import type { ChangeEvent } from "react"
import { useState } from "react"
import { withAuth } from "@/lib/auth"
import { useContent } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function HomeEditPage() {
  const { content, updateContent } = useContent()
  const [homeData, setHomeData] = useState(content.home)
  const [saving, setSaving] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHomeData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      updateContent({ home: homeData })
      setSaving(false)
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Home Page</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <Input name="heroTitle" value={homeData.heroTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Description</label>
              <Textarea name="heroDescription" value={homeData.heroDescription} onChange={handleChange} rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Text</label>
              <Input name="heroButtonText" value={homeData.heroButtonText} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image URL</label>
              <Input name="heroImage" value={homeData.heroImage} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default withAuth(HomeEditPage)
