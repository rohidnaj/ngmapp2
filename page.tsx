"use client"
import { useState, ChangeEvent } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type GalleryImage } from "@/lib/content-context"
import { useFileUpload } from "@/hooks/use-file-upload"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash, Plus, Image as ImageIcon, Upload, Link } from "lucide-react"

function GalleryPage() {
  const { content, updateGalleryImage, addGalleryImage, removeGalleryImage } = useContent()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentImage, setCurrentImage] = useState<GalleryImage>({
    url: "",
    title: "",
    description: "",
    type: "url"
  })
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('url')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // File upload hook
  const { initiateUpload, cancelUpload, uploads } = useFileUpload({
    onProgress: (progress) => {
      console.log('Upload progress:', progress)
    },
    onComplete: (fileId, metadata) => {
      console.log('Upload complete:', fileId, metadata)
      // Add the uploaded image to gallery
      const newImage: GalleryImage = {
        url: `/api/files/${fileId}`,
        title: currentImage.title || selectedFile?.name || 'Uploaded Image',
        description: currentImage.description || '',
        type: 'upload',
        fileId: fileId
      }
      addGalleryImage(newImage)
      setDialogOpen(false)
      setSelectedFile(null)
    },
    onError: (error) => {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error)
    },
  })

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingIndex(null)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    const image = content.galleryImages[index]
    setCurrentImage({...image})
    setUploadMode(image.type === 'upload' ? 'upload' : 'url')
    setSelectedFile(null)
    setDialogOpen(true)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentImage(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCurrentImage(prev => ({
        ...prev,
        title: prev.title || file.name,
        type: 'upload'
      }))
    }
  }

  const handleModeChange = (mode: 'upload' | 'url') => {
    setUploadMode(mode)
    setSelectedFile(null)
    setCurrentImage(prev => ({
      ...prev,
      type: mode,
      url: mode === 'url' ? prev.url : '',
      fileId: mode === 'upload' ? prev.fileId : undefined
    }))
  }

  const handleSave = async () => {
    if (editingIndex !== null) {
      // Update existing image
      updateGalleryImage(editingIndex, currentImage)
    } else {
      // Add new image
      if (uploadMode === 'upload' && selectedFile) {
        // Handle file upload
        try {
          await initiateUpload(selectedFile, 'admin-user')
          // Don't close dialog yet - wait for upload completion
          return
        } catch (error) {
          console.error('Failed to initiate upload:', error)
          alert('Failed to upload file')
          return
        }
      } else {
        // Handle URL addition
        addGalleryImage(currentImage)
      }
    }
    setDialogOpen(false)
    setEditingIndex(null)
    setSelectedFile(null)
  }

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      removeGalleryImage(index)
    }
  }

  const handleAddNew = () => {
    setCurrentImage({
      url: "",
      title: "",
      description: "",
      type: "url"
    })
    setUploadMode('url')
    setSelectedFile(null)
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
          {content.galleryImages.map((image, index) => (
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
                {image.type === 'upload' && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    <Upload className="h-3 w-3 inline mr-1" />
                    Uploaded
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

          <Tabs value={uploadMode} onValueChange={(value) => handleModeChange(value as 'upload' | 'url')} className="my-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Add by URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
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
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Image File</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
                {uploads.size > 0 && (
                  <div className="mt-2 space-y-2">
                    {Array.from(uploads.values()).map((upload) => (
                      <div key={upload.fileId} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{upload.fileName}</span>
                          <span>{Math.round((upload.uploadedSize / upload.totalSize) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(upload.uploadedSize / upload.totalSize) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
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
            <Button
              onClick={handleSave}
              disabled={uploadMode === 'upload' && !selectedFile && editingIndex === null}
            >
              {uploadMode === 'upload' && selectedFile ? 'Upload & Save' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default withAuth(GalleryPage)
