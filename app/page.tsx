"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AdminDashboard } from "@/components/admin-dashboard"
import { StudentApp } from "@/components/student-app"
import { Users, Calendar, GraduationCap } from "lucide-react"

type ViewMode = "admin" | "student"

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("admin")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Campus Events</h1>
                <p className="text-sm text-muted-foreground">Event Management System</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "admin" ? "default" : "outline"}
                onClick={() => setViewMode("admin")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Admin Portal
              </Button>
              <Button
                variant={viewMode === "student" ? "default" : "outline"}
                onClick={() => setViewMode("student")}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Student App
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{viewMode === "admin" ? <AdminDashboard /> : <StudentApp />}</main>
    </div>
  )
}
