"use client"

import type { ChangeEvent } from "react"
import { useState, useEffect } from "react"
import { withAuth } from "@/lib/auth"
import { useContent } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormSuccess } from "@/components/form-success"
import { Save, Check } from "lucide-react"

function ContactEditPage() {
  const { content, updateContent } = useContent()
  const [contactData, setContactData] = useState(content.contactInfo)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  // Update form data when content changes (to ensure it's in sync)
  useEffect(() => {
    setContactData(content.contactInfo)
  }, [content.contactInfo])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear success message when user starts editing
    if (savedSuccess) {
      setSavedSuccess(false)
    }
  }

  const handleSave = () => {
    setSaving(true)
    try {
      // Explicitly create a new object to ensure React detects the change
      const updatedContactInfo = {
        address: contactData.address,
        phone: contactData.phone,
        email: contactData.email,
        businessHours: contactData.businessHours
      }
      
      // Update the content
      updateContent({ contactInfo: updatedContactInfo })
      
      // Show success message
      setSavedSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSavedSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving contact info:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Contact Information</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>

        {savedSuccess && (
          <FormSuccess message="Contact information saved successfully!" />
        )}

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
          <CardFooter className="flex justify-end border-t p-4">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-green-700 hover:bg-green-800"
            >
              {saving ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default withAuth(ContactEditPage)
