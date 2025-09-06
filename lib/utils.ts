import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Event, Student, EventReport, StudentReport } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAttendancePercentage(event: Event): number {
  if (event.registrations.length === 0) return 0
  return Math.round((event.attendees.length / event.registrations.length) * 100)
}

export function calculateAverageFeedbackScore(event: Event): number {
  if (event.feedback.length === 0) return 0
  const totalScore = event.feedback.reduce((sum, feedback) => sum + feedback.rating, 0)
  return Math.round((totalScore / event.feedback.length) * 10) / 10
}

export function calculatePopularityScore(event: Event): number {
  // Popularity based on registrations and feedback
  const registrationScore = event.registrations.length
  const feedbackScore = calculateAverageFeedbackScore(event) * event.feedback.length
  return registrationScore + feedbackScore
}

export function generateEventReport(event: Event): EventReport {
  return {
    eventId: event.id,
    eventName: event.name,
    totalRegistrations: event.registrations.length,
    attendancePercentage: calculateAttendancePercentage(event),
    averageFeedbackScore: calculateAverageFeedbackScore(event),
    popularityScore: calculatePopularityScore(event),
  }
}

export function generateStudentReport(student: Student, events: Event[]): StudentReport {
  const attendedEvents = events.filter((event) => event.attendees.includes(student.id)).length

  const registeredEvents = student.registrations.length
  const participationScore = attendedEvents * 2 + registeredEvents

  return {
    studentId: student.id,
    studentName: student.name,
    eventsAttended: attendedEvents,
    eventsRegistered: registeredEvents,
    participationScore,
  }
}

export function getTopActiveStudents(students: Student[], events: Event[], limit = 3): StudentReport[] {
  return students
    .map((student) => generateStudentReport(student, events))
    .sort((a, b) => b.participationScore - a.participationScore)
    .slice(0, limit)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(timeString: string): string {
  return new Date(`2024-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function isEventToday(eventDate: string): boolean {
  const today = new Date().toISOString().split("T")[0]
  return eventDate === today
}
