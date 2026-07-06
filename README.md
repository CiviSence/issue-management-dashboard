# CivicSence Frontend – Issue Management Dashboard

A modern React-based frontend dashboard for the CivicSence Backend, built to help students, staff, and administrators report, track, and manage civic issues in college hostels and institutes.

This application consumes the FastAPI backend and provides a clean, responsive user interface for issue reporting, voting, commenting, and comprehensive administrative and staff management.

---

## Features

### 🎓 Student Panel
- **Issue Reporting**: Report new civic issues with detailed descriptions and images.
- **Issue Feed**: View all reported issues within the campus/hostel.
- **Engagement**: Upvote and downvote issues to highlight community priorities.
- **Discussions**: Comment on issues for updates and peer discussion.
- **Tracking**: Track personal reported issues and monitor real-time status updates (new → acknowledged → in_progress → resolved → closed).
- **Trust Center**: Verify identity to participate in the platform.

### 🛡️ Admin Panel
The Admin Panel is a comprehensive suite for overseeing the entire issue management lifecycle and managing the platform.
- **Analytics Dashboard**: Comprehensive overview with charts (Bar, Pie, Line) showing issue trends, resolution rates, issue aging, and category priority heatmaps.
- **Issue Management**: View, filter, and sort all reported and resolved issues.
- **Detailed Issue Control**: Update issue status, severity, and assign issues directly to staff members. Add resolution notes and moderate comments.
- **User & System Management (Admin Panel)**: Manage platform users, roles, and administrative settings.
- **Leaderboard**: View active students contributing to the platform.
- **Notifications**: Real-time alerts for new issues and critical updates.

### 👷 Staff Panel
The Staff Panel is tailored for ground-level staff members who are assigned to resolve specific issues.
- **Staff Dashboard**: A focused overview of assigned tasks, pending work, and recent activity.
- **Assigned Tasks**: View a dedicated list of issues assigned specifically to the logged-in staff member.
- **Task Details**: Access detailed information about an assigned issue, including location, description, and user comments.
- **Status Updates**: Seamlessly update the progress of tasks (e.g., moving status from `in_progress` to `resolved`) and add work notes.
- **Notifications**: Receive alerts when new tasks are assigned or when updates occur on current tasks.

---

## Tech Stack

- **Framework**: React 19, Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Framer Motion
- **Data Fetching**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React, Remixicon
- **PWA Support**: Vite PWA Plugin

---

## Prerequisites

- Node.js 18 or higher
- CivicSence Backend running locally or deployed

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-frontend-repo-url>
   cd issue-management-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following based on the `.env.example`:
   ```env
   VITE_API_BASE_URL=https://civisence-api.duckdns.org/api
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Project Structure Highlights

- `src/Components/Dashboards/Admin/`: Contains all administrative views (Dashboard, Issue Management, AdminPanel).
- `src/Components/Dashboards/Staff/`: Contains staff-specific views (Assigned Tasks, Status Updates).
- `src/Components/Dashboards/Student/`: Contains student views (Feed, Reporting).
- `src/Context/`: React Context providers for global state management (Issues, User, Profile, Theme).
- `src/Utils/`: API utility functions and helpers.
