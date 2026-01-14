"use client"
import { useState, ChangeEvent } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type Service } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash, Plus } from "lucide-react"

function ServicesPage() {
  const { content, updateService, addService, removeService } = useContent()
  const [services, setServices] = useState<Service[]>(content.services)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentService, setCurrentService] = useState<Service>({
    title: "",
    description: "",
    image: "",
    features: []
  })
  const [newFeature, setNewFeature] = useState("")

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingIndex(null)
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setCurrentService({...services[index]})
    setDialogOpen(true)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentService(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setCurrentService(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setCurrentService(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      // Update existing service
      updateService(editingIndex, currentService)
      setServices(prev => prev.map((s, i) => i === editingIndex ? currentService : s))
    } else {
      // Add new service
      addService(currentService)
      setServices(prev => [...prev, currentService])
    }
    setDialogOpen(false)
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      removeService(index)
      setServices(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddNew = () => {
    setCurrentService({
      title: "",
      description: "",
      image: "",
      features: []
    })
    setDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Services</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  {service.image && <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                  />}
                </div>
                <p className="text-sm">{service.description}</p>
                <div className="mt-2">
                  <h4 className="text-sm font-semibold mb-1">Features:</h4>
                  <ul className="text-sm list-disc pl-5">
                    {service.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
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
              {editingIndex !== null ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                name="title" 
                value={currentService.title} 
                onChange={handleInputChange} 
                placeholder="Service title" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                name="description" 
                value={currentService.description} 
                onChange={handleInputChange} 
                placeholder="Service description" 
                rows={3} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                name="image" 
                value={currentService.image} 
                onChange={handleInputChange} 
                placeholder="https://example.com/image.jpg" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Features</label>
              <ul className="space-y-1 mb-2">
                {currentService.features.map((feature, i) => (
                  <li key={i} className="flex items-center justify-between border rounded-md px-3 py-1">
                    <span>{feature}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFeature(i)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-2">
                <Input 
                  value={newFeature} 
                  onChange={(e) => setNewFeature(e.target.value)} 
                  placeholder="Add feature" 
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                />
                <Button onClick={handleAddFeature}>Add</Button>
              </div>
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

export default withAuth(ServicesPage)
