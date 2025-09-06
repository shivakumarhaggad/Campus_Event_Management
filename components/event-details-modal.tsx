"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatTime, calculatePopularityScore } from "@/lib/utils"
import type { Event, EventType } from "@/lib/types"
import { Calendar, MapPin, Users, TrendingUp, CheckCircle } from "lucide-react"

interface EventDetailsModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onRegister: (event: Event) => void
  isRegistered: boolean
  isFull: boolean
  availableSpots: number
  registrationCount: number
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onRegister,
  isRegistered,
  isFull,
  availableSpots,
  registrationCount,
}: EventDetailsModalProps) {
  if (!event) return null

  const getTypeBadge = (type: EventType) => {
    const colors = {
      Workshop: "bg-blue-100 text-blue-800 border-blue-200",
      Fest: "bg-purple-100 text-purple-800 border-purple-200",
      Seminar: "bg-green-100 text-green-800 border-green-200",
    }

    return (
      <Badge className={colors[type]} variant="outline">
        {type}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-balance leading-tight pr-4">{event.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-3">
                {getTypeBadge(event.type)}
                {isRegistered && <Badge className="bg-accent text-accent-foreground">Registered</Badge>}
                {isFull && !isRegistered && <Badge variant="destructive">Event Full</Badge>}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <DialogDescription className="text-base text-pretty leading-relaxed">{event.description}</DialogDescription>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Date & Time</div>
                    <div className="text-muted-foreground">
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">{event.location}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-muted-foreground">
                      {registrationCount}/{event.maxCapacity} registered
                      {availableSpots > 0 && ` • ${availableSpots} spots left`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Popularity Score</div>
                    <div className="text-muted-foreground">{calculatePopularityScore(event)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Registration Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isRegistered ? (
              <Button variant="outline" className="flex-1 bg-transparent" disabled>
                <CheckCircle className="h-4 w-4 mr-2" />
                Already Registered
              </Button>
            ) : isFull ? (
              <Button variant="outline" className="flex-1 bg-transparent" disabled>
                Event Full - No Spots Available
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => onRegister(event)}>
                Register for This Event
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
