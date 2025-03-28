"use client"
import { useState, ChangeEvent } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type BlogPost } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash, Plus, Calendar } from "lucide-react"

function BlogPage() {
  const { content, updateBlogPost, addBlogPost, removeBlogPost } = useContent()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(content.blogPosts)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentPost, setCurrentPost] = useState<BlogPost>({
    title: "",
    date: "",
    image: "",
    excerpt: ""
  })

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingIndex(null)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setCurrentPost({...blogPosts[index]})
    setDialogOpen(true)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentPost(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      // Update existing post
      updateBlogPost(editingIndex, currentPost)
      setBlogPosts(prev => prev.map((post, i) => i === editingIndex ? currentPost : post))
    } else {
      // Add new post
      addBlogPost(currentPost)
      setBlogPosts(prev => [...prev, currentPost])
    }
    setDialogOpen(false)
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      removeBlogPost(index)
      setBlogPosts(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddNew = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    setCurrentPost({
      title: "",
      date: today,
      image: "",
      excerpt: ""
    })
    setDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Blog Post
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Card key={index}>
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Plus className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
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
              {editingIndex !== null ? "Edit Blog Post" : "Add New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                name="title" 
                value={currentPost.title} 
                onChange={handleInputChange} 
                placeholder="Post title" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                name="date" 
                value={currentPost.date} 
                onChange={handleInputChange} 
                placeholder="March 15, 2025" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                name="image" 
                value={currentPost.image} 
                onChange={handleInputChange} 
                placeholder="https://example.com/image.jpg" 
              />
              {currentPost.image && (
                <div className="mt-2 aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={currentPost.image} 
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
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea 
                name="excerpt" 
                value={currentPost.excerpt} 
                onChange={handleInputChange} 
                placeholder="Short excerpt from the post" 
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

export default withAuth(BlogPage)

