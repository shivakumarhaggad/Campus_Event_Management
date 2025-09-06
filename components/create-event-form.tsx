"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Event, EventType } from "@/lib/types"
import { Plus } from "lucide-react"

interface CreateEventFormProps {
  onEventCreated: (event: Event) => void
}

export function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "" as EventType,
    date: "",
    time: "",
    location: "",
    description: "",
    maxCapacity: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.type ||
        !formData.date ||
        !formData.time ||
        !formData.location ||
        !formData.maxCapacity
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Create new event
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        description: formData.description,
        maxCapacity: Number.parseInt(formData.maxCapacity),
        registrations: [],
        attendees: [],
        feedback: [],
        createdAt: new Date().toISOString(),
        status: "upcoming",
      }

      onEventCreated(newEvent)

      // Reset form
      setFormData({
        name: "",
        type: "" as EventType,
        date: "",
        time: "",
        location: "",
        description: "",
        maxCapacity: "",
      })

      toast({
        title: "Event Created",
        description: `${newEvent.name} has been successfully created.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Event
        </CardTitle>
        <CardDescription>Add a new campus event for students to discover and register for.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: EventType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Fest">Fest</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter event location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Max Capacity *</Label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                placeholder="Enter maximum capacity"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
