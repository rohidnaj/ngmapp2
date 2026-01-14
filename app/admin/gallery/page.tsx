"use client"
import { useState, ChangeEvent } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type GalleryImage } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash, Plus, Image as ImageIcon } from "lucide-react"

function GalleryPage() {
  const { content, updateGalleryImage, addGalleryImage, removeGalleryImage } = useContent()
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(content.galleryImages)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentImage, setCurrentImage] = useState<GalleryImage>({
    url: "",
    title: "",
    description: ""
  })

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingIndex(null)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setCurrentImage({...galleryImages[index]})
    setDialogOpen(true)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentImage(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      // Update existing image
      updateGalleryImage(editingIndex, currentImage)
      setGalleryImages(prev => prev.map((img, i) => i === editingIndex ? currentImage : img))
    } else {
      // Add new image
      addGalleryImage(currentImage)
      setGalleryImages(prev => [...prev, currentImage])
    }
    setDialogOpen(false)
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      removeGalleryImage(index)
      setGalleryImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddNew = () => {
    setCurrentImage({
      url: "",
      title: "",
      description: ""
    })
    setDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Gallery</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Image
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Card key={index}>
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                {image.url ? (
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{image.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{image.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Gallery Image" : "Add New Gallery Image"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                name="url" 
                value={currentImage.url} 
                onChange={handleInputChange} 
                placeholder="https://example.com/image.jpg" 
              />
              {currentImage.url && (
                <div className="mt-2 aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={currentImage.url} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL"
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                name="title" 
                value={currentImage.title} 
                onChange={handleInputChange} 
                placeholder="Image title" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                name="description" 
                value={currentImage.description} 
                onChange={handleInputChange} 
                placeholder="Image description" 
                rows={3} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default withAuth(GalleryPage)
