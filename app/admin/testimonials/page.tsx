"use client"
import { useState } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type Testimonial } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

function TestimonialsPage() {
  const { content } = useContent()
  const [testimonials] = useState<Testimonial[]>(content.testimonials)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Testimonials</h1>
          <Button>Add Testimonial</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{testimonial.author}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
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

export default withAuth(TestimonialsPage)

