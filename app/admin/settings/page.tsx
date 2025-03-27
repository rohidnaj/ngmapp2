"use client"

import type { ChangeEvent } from "react"
import { useState } from "react"
import { withAuth } from "@/lib/auth"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Najm Garden & Maintenance",
    siteUrl: "https://ngmlandscape.ca",
    emailNotifications: true,
    discordNotifications: true,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSave = () => {
    // Save settings logic
    localStorage.setItem("ngm-settings", JSON.stringify(settings))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input name="siteName" value={settings.siteName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Site URL</label>
              <Input name="siteUrl" value={settings.siteUrl} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="discordNotifications">Discord Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via Discord</p>
              </div>
              <Switch
                id="discordNotifications"
                checked={settings.discordNotifications}
                onCheckedChange={(checked) => handleSwitchChange("discordNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default withAuth(SettingsPage)

