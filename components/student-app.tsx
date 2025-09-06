"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { EventDetailsModal } from "@/components/event-details-modal"
import { mockEvents, mockStudents, mockRegistrations, mockFeedback } from "@/lib/mock-data"
import { formatDate, formatTime, calculatePopularityScore, isEventToday } from "@/lib/utils"
import type { Event, EventType, Registration, Feedback } from "@/lib/types"
import { Search, Calendar, MapPin, Users, Clock, Filter, TrendingUp, CheckCircle, UserCheck, Eye } from "lucide-react"

// Mock current student - in a real app this would come from authentication
const CURRENT_STUDENT = mockStudents[0] // Alice Johnson

export function StudentApp() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<EventType | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date")

  const [events, setEvents] = useState(mockEvents)
  const [registrations, setRegistrations] = useState(mockRegistrations)
  const [feedback, setFeedback] = useState(mockFeedback)
  const [currentStudent, setCurrentStudent] = useState(CURRENT_STUDENT)

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  // Filter upcoming events (not completed)
  const upcomingEvents = events.filter((event) => event.status !== "completed")

  // Get student's registered events
  const myRegistrations = events.filter((event) =>
    registrations.some((reg) => reg.studentId === currentStudent.id && reg.eventId === event.id),
  )

  // Filter and sort events for browsing
  const filteredEvents = upcomingEvents
    .filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || event.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return calculatePopularityScore(b) - calculatePopularityScore(a)
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })

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

  const isRegistered = (eventId: string) => {
    return registrations.some((reg) => reg.studentId === currentStudent.id && reg.eventId === eventId)
  }

  const hasSubmittedFeedback = (eventId: string) => {
    return feedback.some((fb) => fb.studentId === currentStudent.id && fb.eventId === eventId)
  }

  const getAvailableSpots = (event: Event) => {
    const eventRegistrations = registrations.filter((reg) => reg.eventId === event.id)
    return event.maxCapacity - eventRegistrations.length
  }

  const handleBrowseEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleRegister = async (event: Event) => {
    try {
      const availableSpots = getAvailableSpots(event)

      if (availableSpots <= 0) {
        throw new Error("Event is full")
      }

      if (isRegistered(event.id)) {
        throw new Error("Already registered for this event")
      }

      // Create new registration
      const newRegistration: Registration = {
        id: `reg-${Date.now()}`,
        studentId: currentStudent.id,
        eventId: event.id,
        registeredAt: new Date().toISOString(),
        attended: false,
      }

      // Update registrations
      setRegistrations([...registrations, newRegistration])

      // Update current student's registrations
      setCurrentStudent({
        ...currentStudent,
        registrations: [...currentStudent.registrations, event.id],
      })

      // Update event's registrations in events array
      setEvents(
        events.map((e) => (e.id === event.id ? { ...e, registrations: [...e.registrations, newRegistration] } : e)),
      )

      setIsEventModalOpen(false)

      toast({
        title: "Registration Successful!",
        description: `You've successfully registered for ${event.name}`,
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register for event",
        variant: "destructive",
      })
    }
  }

  const handleMarkAttendance = async (event: Event) => {
    try {
      if (!isEventToday(event.date)) {
        throw new Error("Attendance can only be marked on the event day")
      }

      if (!isRegistered(event.id)) {
        throw new Error("You must be registered to mark attendance")
      }

      const registration = registrations.find((reg) => reg.studentId === currentStudent.id && reg.eventId === event.id)

      if (registration?.attended) {
        throw new Error("Attendance already marked for this event")
      }

      // Update registration attendance
      setRegistrations(
        registrations.map((reg) =>
          reg.studentId === currentStudent.id && reg.eventId === event.id ? { ...reg, attended: true } : reg,
        ),
      )

      // Update current student's attended events
      setCurrentStudent({
        ...currentStudent,
        attendedEvents: [...currentStudent.attendedEvents, event.id],
      })

      // Update event's attendees
      setEvents(events.map((e) => (e.id === event.id ? { ...e, attendees: [...e.attendees, currentStudent.id] } : e)))

      toast({
        title: "Attendance Marked!",
        description: `Your attendance for ${event.name} has been recorded`,
      })
    } catch (error) {
      toast({
        title: "Attendance Failed",
        description: error instanceof Error ? error.message : "Failed to mark attendance",
        variant: "destructive",
      })
    }
  }

  const handleFeedbackSubmitted = (newFeedback: Feedback) => {
    setFeedback([...feedback, newFeedback])

    // Update event's feedback in events array
    setEvents(events.map((e) => (e.id === newFeedback.eventId ? { ...e, feedback: [...e.feedback, newFeedback] } : e)))
  }

  const EventCard = ({ event }: { event: Event }) => {
    const availableSpots = getAvailableSpots(event)
    const registered = isRegistered(event.id)
    const isFull = availableSpots <= 0

    return (
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg text-balance leading-tight">{event.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {getTypeBadge(event.type)}
                {registered && <Badge className="bg-accent text-accent-foreground">Registered</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-pretty">{event.description}</CardDescription>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(event.date)} at {formatTime(event.time)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {registrations.filter((reg) => reg.eventId === event.id).length}/{event.maxCapacity} registered
                {availableSpots > 0 && ` • ${availableSpots} spots left`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Popularity: {calculatePopularityScore(event)}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => handleBrowseEvent(event)}>
              <Eye className="h-4 w-4 mr-2" />
              Browse Details
            </Button>

            {registered ? (
              <Button variant="outline" className="w-full bg-transparent" disabled>
                <CheckCircle className="h-4 w-4 mr-2" />
                Already Registered
              </Button>
            ) : isFull ? (
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Event Full
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleRegister(event)}>
                Register Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const MyRegistrationCard = ({ event }: { event: Event }) => {
    const registration = registrations.find((reg) => reg.studentId === currentStudent.id && reg.eventId === event.id)
    const hasAttended = currentStudent.attendedEvents.includes(event.id)
    const canMarkAttendance = isEventToday(event.date) && !hasAttended && event.status === "upcoming"
    const submittedFeedback = hasSubmittedFeedback(event.id)

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{event.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {getTypeBadge(event.type)}
                {hasAttended && <Badge className="bg-green-100 text-green-800">Attended</Badge>}
                {event.status === "completed" && !hasAttended && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Missed
                  </Badge>
                )}
                {canMarkAttendance && <Badge className="bg-yellow-100 text-yellow-800">Can Mark Attendance</Badge>}
                {submittedFeedback && <Badge className="bg-blue-100 text-blue-800">Feedback Submitted</Badge>}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Registered {new Date(registration?.registeredAt || "").toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(event.date)} at {formatTime(event.time)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {canMarkAttendance && (
              <Button variant="default" size="sm" className="flex-1" onClick={() => handleMarkAttendance(event)}>
                <UserCheck className="h-4 w-4 mr-1" />
                Mark Attendance
              </Button>
            )}
            {hasAttended && (
              <FeedbackDialog
                event={event}
                studentId={currentStudent.id}
                onFeedbackSubmitted={handleFeedbackSubmitted}
                hasSubmittedFeedback={submittedFeedback}
              />
            )}
            {!canMarkAttendance && !hasAttended && event.status === "upcoming" && (
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled>
                <Clock className="h-4 w-4 mr-1" />
                Wait for Event Day
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Student Portal</h2>
        <p className="text-muted-foreground">
          Welcome back, {currentStudent.name}! Discover and register for campus events.
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse Events
          </TabsTrigger>
          <TabsTrigger value="registrations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            My Registrations ({myRegistrations.length})
          </TabsTrigger>
        </TabsList>

        {/* Browse Events Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Find Events
              </CardTitle>
              <CardDescription>Search and filter upcoming campus events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, descriptions, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterType} onValueChange={(value: EventType | "all") => setFilterType(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Fest">Fest</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: "date" | "popularity") => setSortBy(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Upcoming Events ({filteredEvents.length})</h3>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to find more events.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* My Registrations Tab */}
        <TabsContent value="registrations" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">My Registrations ({myRegistrations.length})</h3>

            {myRegistrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRegistrations.map((event) => (
                  <MyRegistrationCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No registrations yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't registered for any events yet. Browse events to get started!
                  </p>
                  <Button onClick={() => document.querySelector('[value="browse"]')?.click()}>Browse Events</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Stats */}
          {myRegistrations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-card-foreground">{myRegistrations.length}</div>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-card-foreground">{currentStudent.attendedEvents.length}</div>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-card-foreground">
                    {currentStudent.attendedEvents.length > 0
                      ? Math.round((currentStudent.attendedEvents.length / myRegistrations.length) * 100)
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onRegister={handleRegister}
        isRegistered={selectedEvent ? isRegistered(selectedEvent.id) : false}
        isFull={selectedEvent ? getAvailableSpots(selectedEvent) <= 0 : false}
        availableSpots={selectedEvent ? getAvailableSpots(selectedEvent) : 0}
        registrationCount={selectedEvent ? registrations.filter((reg) => reg.eventId === selectedEvent.id).length : 0}
      />
    </div>
  )
}
