# Campus_Event_Management
A minimal campus event management platform for colleges to organize events, track registrations, attendance, and feedback. Built for Webknot Technologies Campus Drive Assignment.

Overview
This system lets college admins create and manage campus events (fests, workshops, etc.), while students can browse, register, check in, and provide feedback on events. Reports show event popularity and student participation.

Features
Admin Portal:
- Create, view, or manage campus events
- Track registrations, attendance, feedback
- Download event reports

Student Portal:
- Browse upcoming events by type and date
- Register and check-in for events
- Submit feedback (ratings and comments)
  
Admin Portal


Student Portal

Technology Stack
- Frontend: React/Next.js
- Backend:  Node.js, Django, Flask, etc.
- Database: SQLite / Postgres / MySQL

Setup Instructions
Clone this repo:git clone https://github.com/shivakumarhaggad/Campus_Event_Management.git
cd Campus_Event_Management

Install dependencies:npm install
Set up the database (SQLite/Postgres/MySQL, see /backend/README.md)

Run the app:npm run dev

Usage
- Access the Admin Portal to create and manage events, view reports.
- Students can register, check-in, and review events via the Student Portal.

Reports
- Event Popularity (sorted by registrations)
- Student Participation (number of attended events)

Top 3 Active Students
-Filterable by event type (Fest/Workshop/etc.)

Assumptions & Notes
- Event IDs are unique per college.
- Data is stored in a single database for simplicity.
- Designed for usage by multiple colleges (~500 students, ~20 events per semester).
