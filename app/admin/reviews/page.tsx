"use client"
import { useState, ChangeEvent } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type Review } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash, Plus, User, Calendar } from "lucide-react"

function ReviewsPage() {
  const { content, updateReview, addReview, removeReview } = useContent()
  const [reviews, setReviews] = useState<Review[]>(content.reviews)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentReview, setCurrentReview] = useState<Review>({
    author: "",
    date: "",
    content: ""
  })

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingIndex(null)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setCurrentReview({...reviews[index]})
    setDialogOpen(true)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentReview(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      // Update existing review
      updateReview(editingIndex, currentReview)
      setReviews(prev => prev.map((review, i) => i === editingIndex ? currentReview : review))
    } else {
      // Add new review
      addReview(currentReview)
      setReviews(prev => [...prev, currentReview])
    }
    setDialogOpen(false)
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      removeReview(index)
      setReviews(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddNew = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    setCurrentReview({
      author: "",
      date: today,
      content: ""
    })
    setDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Reviews</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Review
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <CardTitle className="text-lg">{review.author}</CardTitle>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {review.date}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 italic">"{review.content}"</p>
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
              {editingIndex !== null ? "Edit Review" : "Add New Review"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input 
                name="author" 
                value={currentReview.author} 
                onChange={handleInputChange} 
                placeholder="Author name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                name="date" 
                value={currentReview.date} 
                onChange={handleInputChange} 
                placeholder="March 15, 2025" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea 
                name="content" 
                value={currentReview.content} 
                onChange={handleInputChange} 
                placeholder="Review content" 
                rows={4} 
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

export default withAuth(ReviewsPage)

