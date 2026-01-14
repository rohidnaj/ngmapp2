"use client"
import { useState, ChangeEvent } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type Testimonial } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash, Plus, User, MapPin } from "lucide-react"

function TestimonialsPage() {
  const { content, updateTestimonial, addTestimonial, removeTestimonial } = useContent()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(content.testimonials)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial>({
    content: "",
    author: "",
    location: ""
  })

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingIndex(null)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setCurrentTestimonial({...testimonials[index]})
    setDialogOpen(true)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentTestimonial(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      // Update existing testimonial
      updateTestimonial(editingIndex, currentTestimonial)
      setTestimonials(prev => prev.map((testimonial, i) => i === editingIndex ? currentTestimonial : testimonial))
    } else {
      // Add new testimonial
      addTestimonial(currentTestimonial)
      setTestimonials(prev => [...prev, currentTestimonial])
    }
    setDialogOpen(false)
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      removeTestimonial(index)
      setTestimonials(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddNew = () => {
    setCurrentTestimonial({
      content: "",
      author: "",
      location: ""
    })
    setDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Testimonials</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Testimonial
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 italic mb-4">"{testimonial.content}"</p>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{testimonial.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-gray-50">
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
              {editingIndex !== null ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea 
                name="content" 
                value={currentTestimonial.content} 
                onChange={handleInputChange} 
                placeholder="Testimonial content" 
                rows={4} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input 
                name="author" 
                value={currentTestimonial.author} 
                onChange={handleInputChange} 
                placeholder="Author name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                name="location" 
                value={currentTestimonial.location} 
                onChange={handleInputChange} 
                placeholder="City, Province" 
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

export default withAuth(TestimonialsPage)
