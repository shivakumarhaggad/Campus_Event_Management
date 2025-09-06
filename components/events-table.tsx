"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event, EventReport, EventType } from "@/lib/types"
import { formatDate, formatTime } from "@/lib/utils"
import { Search, Download, Calendar, MapPin, Users } from "lucide-react"

interface EventsTableProps {
  events: Event[]
  eventReports: EventReport[]
}

export function EventsTable({ events, eventReports }: EventsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<EventType | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "registrations" | "attendance">("date")

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || event.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      const reportA = eventReports.find((r) => r.eventId === a.id)
      const reportB = eventReports.find((r) => r.eventId === b.id)

      switch (sortBy) {
        case "registrations":
          return (reportB?.totalRegistrations || 0) - (reportA?.totalRegistrations || 0)
        case "attendance":
          return (reportB?.attendancePercentage || 0) - (reportA?.attendancePercentage || 0)
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  const getStatusBadge = (status: Event["status"]) => {
    const variants = {
      upcoming: "default",
      ongoing: "secondary",
      completed: "outline",
    } as const

    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getTypeBadge = (type: EventType) => {
    const colors = {
      Workshop: "bg-blue-100 text-blue-800",
      Fest: "bg-purple-100 text-purple-800",
      Seminar: "bg-green-100 text-green-800",
    }

    return <Badge className={colors[type]}>{type}</Badge>
  }

  const handleDownloadReport = (event: Event) => {
    const report = eventReports.find((r) => r.eventId === event.id)
    if (!report) return

    const reportData = {
      eventName: event.name,
      eventType: event.type,
      date: formatDate(event.date),
      time: formatTime(event.time),
      location: event.location,
      totalRegistrations: report.totalRegistrations,
      attendancePercentage: report.attendancePercentage,
      averageFeedbackScore: report.averageFeedbackScore,
      popularityScore: report.popularityScore,
      feedback: event.feedback.map((f) => ({
        rating: f.rating,
        comments: f.comments,
        submittedAt: f.submittedAt,
      })),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event.name.replace(/\s+/g, "-").toLowerCase()}-report.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
        <CardDescription>View and manage all campus events with registration and attendance data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
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

          <Select value={sortBy} onValueChange={(value: "date" | "registrations" | "attendance") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="registrations">Registrations</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => {
                const report = eventReports.find((r) => r.eventId === event.id)
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-card-foreground">{event.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(event.type)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.date)}
                        </div>
                        <div className="text-sm text-muted-foreground">{formatTime(event.time)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {report?.totalRegistrations || 0}/{event.maxCapacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{report?.attendancePercentage || 0}%</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{report?.averageFeedbackScore || 0}/5</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(event)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Report
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No events found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
