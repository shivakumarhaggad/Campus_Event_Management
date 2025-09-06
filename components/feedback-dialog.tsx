"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Event, Feedback } from "@/lib/types"
import { Star, MessageSquare } from "lucide-react"

interface FeedbackDialogProps {
  event: Event
  studentId: string
  onFeedbackSubmitted: (feedback: Feedback) => void
  hasSubmittedFeedback: boolean
}

export function FeedbackDialog({ event, studentId, onFeedbackSubmitted, hasSubmittedFeedback }: FeedbackDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting feedback.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newFeedback: Feedback = {
        id: `feedback-${Date.now()}`,
        studentId,
        eventId: event.id,
        rating,
        comments: comments.trim(),
        submittedAt: new Date().toISOString(),
      }

      onFeedbackSubmitted(newFeedback)

      toast({
        title: "Feedback Submitted!",
        description: `Thank you for your feedback on ${event.name}`,
      })

      // Reset form and close dialog
      setRating(0)
      setComments("")
      setOpen(false)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-1 rounded-sm hover:bg-muted transition-colors"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hoveredRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating}/5` : "Select rating"}</span>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={hasSubmittedFeedback}>
          <MessageSquare className="h-4 w-4 mr-1" />
          {hasSubmittedFeedback ? "Feedback Submitted" : "Submit Feedback"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>Share your experience with {event.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>How would you rate this event?</Label>
            <StarRating />
          </div>

          <div className="space-y-3">
            <Label htmlFor="comments">Comments (optional)</Label>
            <Textarea
              id="comments"
              placeholder="Share your thoughts about the event..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">{comments.length}/500</div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
