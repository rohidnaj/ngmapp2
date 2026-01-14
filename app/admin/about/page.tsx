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

function AboutEditPage() {
  const { content, updateContent } = useContent()
  const [aboutData, setAboutData] = useState(content.about)
  const [saving, setSaving] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "years" || name === "satisfaction") {
      setAboutData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [name]: Number.parseInt(value) || 0,
        },
      }))
    } else {
      setAboutData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      updateContent({ about: aboutData })
      setSaving(false)
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit About Page</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Our Story</label>
              <Textarea name="story" value={aboutData.story} onChange={handleChange} rows={8} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input name="image" value={aboutData.image} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input name="years" type="number" value={String(aboutData.stats.years)} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Satisfaction (%)</label>
                <Input
                  name="satisfaction"
                  type="number"
                  value={String(aboutData.stats.satisfaction)}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default withAuth(AboutEditPage)
