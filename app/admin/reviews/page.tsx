"use client"
import { useState } from "react"
import { withAuth } from "@/lib/auth"
import { useContent, type Review } from "@/lib/content-context"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

function ReviewsPage() {
  const { content } = useContent()
  const [reviews] = useState<Review[]>(content.reviews)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Reviews</h1>
          <Button>Add Review</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{review.author}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{review.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
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

export default withAuth(ReviewsPage)

