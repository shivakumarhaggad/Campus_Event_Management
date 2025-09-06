"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateEventForm } from "@/components/create-event-form"
import { EventsTable } from "@/components/events-table"
import { AdminReports } from "@/components/admin-reports"
import { mockEvents, mockStudents, mockFeedback } from "@/lib/mock-data"
import { generateEventReport, getTopActiveStudents } from "@/lib/utils"
import { Calendar, Users, TrendingUp, Award } from "lucide-react"

export function AdminDashboard() {
  const [events, setEvents] = useState(mockEvents)
  const [feedback, setFeedback] = useState(mockFeedback)

  // Calculate dashboard metrics
  const totalEvents = events.length
  const totalRegistrations = events.reduce((sum, event) => sum + event.registrations.length, 0)
  const totalAttendees = events.reduce((sum, event) => sum + event.attendees.length, 0)
  const averageAttendance = totalRegistrations > 0 ? Math.round((totalAttendees / totalRegistrations) * 100) : 0

  const eventsWithFeedback = events.map((event) => ({
    ...event,
    feedback: feedback.filter((fb) => fb.eventId === event.id),
  }))

  const eventReports = eventsWithFeedback.map(generateEventReport)
  const topStudents = getTopActiveStudents(mockStudents, eventsWithFeedback)

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage campus events and track student engagement</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Active campus events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">Student registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">Attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{mockStudents.length}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Event Management</TabsTrigger>
          <TabsTrigger value="create">Create Event</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <EventsTable events={eventsWithFeedback} eventReports={eventReports} />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateEventForm onEventCreated={(newEvent) => setEvents([...events, newEvent])} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AdminReports eventReports={eventReports} topStudents={topStudents} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
