export type EventType = "Workshop" | "Fest" | "Seminar"

export type EventStatus = "upcoming" | "ongoing" | "completed"

export interface Event {
  id: string
  name: string
  type: EventType
  date: string
  time: string
  location: string
  description: string
  maxCapacity: number
  registrations: Registration[]
  attendees: string[] // student IDs who marked attendance
  feedback: Feedback[]
  createdAt: string
  status: EventStatus
}

export interface Student {
  id: string
  name: string
  email: string
  registrations: string[] // event IDs
  attendedEvents: string[] // event IDs
  createdAt: string
}

export interface Registration {
  id: string
  studentId: string
  eventId: string
  registeredAt: string
  attended: boolean
}

export interface Feedback {
  id: string
  studentId: string
  eventId: string
  rating: number // 1-5
  comments: string
  submittedAt: string
}

export interface EventReport {
  eventId: string
  eventName: string
  totalRegistrations: number
  attendancePercentage: number
  averageFeedbackScore: number
  popularityScore: number
}

export interface StudentReport {
  studentId: string
  studentName: string
  eventsAttended: number
  eventsRegistered: number
  participationScore: number
}
