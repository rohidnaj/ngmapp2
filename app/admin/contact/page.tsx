"use client"

import type { ChangeEvent } from "react"
import { useState } from "react"
import { withAuth } from "@/lib/auth"
import { useContent } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function ContactEditPage() {
  const { content, updateContent } = useContent()
  const [contactData, setContactData] = useState(content.contactInfo)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    updateContent({ contactInfo: contactData })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Contact Information</h1>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input name="address" value={contactData.address} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone" value={contactData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" value={contactData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Hours</label>
              <Input name="businessHours" value={contactData.businessHours} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default withAuth(ContactEditPage)

