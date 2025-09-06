"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { EventReport, StudentReport } from "@/lib/types"
import { TrendingUp, Award, BarChart3 } from "lucide-react"

interface AdminReportsProps {
  eventReports: EventReport[]
  topStudents: StudentReport[]
}

export function AdminReports({ eventReports, topStudents }: AdminReportsProps) {
  // Sort events by popularity
  const popularEvents = [...eventReports].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Reports & Analytics</h3>
        <p className="text-muted-foreground">Insights into event performance and student engagement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 3 Most Popular Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Popular Events
            </CardTitle>
            <CardDescription>Events ranked by registration count and feedback scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularEvents.map((event, index) => (
                <div key={event.eventId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">{event.eventName}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.totalRegistrations} registrations • {event.attendancePercentage}% attendance
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Score: {event.popularityScore}</div>
                    <div className="text-sm text-muted-foreground">{event.averageFeedbackScore}/5 rating</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Most Active Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Most Active Students
            </CardTitle>
            <CardDescription>Students with highest participation scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={student.studentId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.eventsAttended} attended • {student.eventsRegistered} registered
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Score: {student.participationScore}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Event Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Event Reports
          </CardTitle>
          <CardDescription>Comprehensive performance metrics for all events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead>Avg. Feedback</TableHead>
                  <TableHead>Popularity Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventReports
                  .sort((a, b) => b.popularityScore - a.popularityScore)
                  .map((report) => (
                    <TableRow key={report.eventId}>
                      <TableCell className="font-medium text-card-foreground">{report.eventName}</TableCell>
                      <TableCell>{report.totalRegistrations}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{report.attendancePercentage}%</div>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${report.attendancePercentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{report.averageFeedbackScore}</span>
                          <span className="text-xs text-muted-foreground">/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.popularityScore}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
