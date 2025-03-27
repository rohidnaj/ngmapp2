"use client"
import { useState } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type GalleryImage } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

function GalleryPage() {
  const { content } = useContent()
  const [galleryImages] = useState<GalleryImage[]>(content.galleryImages)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Gallery</h1>
          <Button>Add Image</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{image.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{image.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default withAuth(GalleryPage)

