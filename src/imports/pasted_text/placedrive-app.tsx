Design and build an elite, production-ready 2026 Enterprise SaaS web application called "PlaceDrive" for a modern Virtual Placement Drive Management Platform.

IMPORTANT:
This must be ONE React + TypeScript application containing four role-based modules:

1. OWNER
2. COLLEGE
3. COMPANY
4. STUDENT

Do NOT create four separate frontend applications.

The application must use one shared authentication system, shared design system, shared components, shared API layer, and role-based protected routing.

The frontend will connect to an EXISTING Spring Boot REST API backend.

Do NOT create a fake backend.
Do NOT use Firebase.
Do NOT use Supabase.
Do NOT use mock APIs.
Do NOT invent API endpoints.
Do NOT hardcode dashboard statistics.

The backend is already implemented and tested.

============================================================
TECH STACK
============================================================

Frontend:

React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Lucide React Icons
Recharts
React Hook Form
Framer Motion

Use Axios for REST API communication.

Use React Context or an equivalent lightweight authentication state solution.

Use TypeScript interfaces/types for API responses.

Avoid "any" wherever possible.

Architecture must be modular and scalable.

============================================================
BACKEND
============================================================

Existing backend:

Spring Boot REST API

Base URL:

http://localhost:8080

Authentication:

JWT Bearer Authentication.

All authenticated requests must send:

Authorization: Bearer <JWT_TOKEN>

The login API is:

POST /api/auth/login

Request:

{
  "email": "user@email.com",
  "password": "password"
}

The registration API is:

POST /api/auth/register

Request:

{
  "fullName": "User Name",
  "email": "user@email.com",
  "password": "password",
  "phone": "9876543210",
  "role": "STUDENT"
}

Supported roles:

OWNER
COLLEGE
COMPANY
STUDENT

============================================================
AUTHENTICATION ARCHITECTURE
============================================================

Create ONE authentication system.

Pages:

/login
/register

Do NOT create separate login pages for every role.

Login:

User enters:

Email
Password

Frontend calls:

POST /api/auth/login

After successful authentication:

1. Store JWT
2. Store authenticated user information
3. Determine role
4. Redirect according to role

OWNER:

/owner/dashboard

COLLEGE:

/college/dashboard

COMPANY:

/company/dashboard

STUDENT:

/student/dashboard

Create protected routes.

Users must not access pages belonging to another role.

If backend returns:

401 → redirect to login

403 → show professional Access Denied page

============================================================
REGISTRATION
============================================================

Create one premium Register page.

Do NOT provide public Owner registration.

Registration options:

Student
College
Company

Display role cards:

Student
"Find and manage placement opportunities"

College
"Manage students and placement activities"

Company
"Recruit qualified candidates"

After role selection, show the appropriate registration form.

Common fields:

Full Name
Email
Password
Phone

Role is submitted to:

POST /api/auth/register

Registration should NOT automatically imply approval.

College registration:

PENDING
→ Owner Approval
→ APPROVED / REJECTED

Company registration:

PENDING
→ Owner Approval
→ APPROVED / REJECTED

Student registration:

PENDING
→ College Verification
→ VERIFIED / REJECTED

Use professional success and error states.

============================================================
VISUAL DESIGN SYSTEM
============================================================

Create a premium Grey + White enterprise theme.

Primary Background:

#F8F9FB

Secondary Background:

#FFFFFF

Sidebar:

#FFFFFF

Cards:

#FFFFFF

Borders:

#E5E7EB

Primary Text:

#111827

Secondary Text:

#6B7280

Muted Text:

#9CA3AF

Primary Accent:

#4B5563

Hover Accent:

#374151

Selected Navigation:

#F3F4F6

Primary Buttons:

#374151

Button Hover:

#1F2937

Success:

#10B981

Warning:

#F59E0B

Danger:

#EF4444

Info:

#6B7280

Use subtle grey gradients only:

#F8FAFC
→
#EEF2F7
→
#E5E7EB

Typography:

Inter

Use:

18–24px rounded corners
Ultra-soft shadows
Thin borders
Premium spacing
Clean typography
Subtle hover transitions
Pixel-perfect alignment

Avoid:

Strong blue gradients
Neon colors
Excessive glassmorphism
Heavy shadows
Flashy animations
Cartoonish illustrations
Generic Bootstrap appearance

============================================================
DESIGN INSPIRATION
============================================================

The product should feel inspired by:

Linear
Stripe Dashboard
Vercel
Notion
Arc Browser
Raycast
Clerk
Framer
GitHub Enterprise
Atlassian Admin
Apple Business

The result must feel like a billion-dollar enterprise SaaS product used by:

Universities
Government organizations
Large enterprises
Recruitment teams
Corporate HR departments

============================================================
GLOBAL APPLICATION STRUCTURE
============================================================

ONE APPLICATION:

PlaceDrive
│
├── Authentication
│   ├── Login
│   └── Register
│
├── OWNER
│   ├── Dashboard
│   ├── Colleges
│   ├── Companies
│   ├── Students
│   ├── Placement Drives
│   ├── Applications
│   └── Settings
│
├── COLLEGE
│   ├── Dashboard
│   ├── Students
│   ├── Verification
│   ├── Applications
│   └── Profile
│
├── COMPANY
│   ├── Dashboard
│   ├── Placement Drives
│   ├── Applications
│   ├── Candidates
│   ├── Resumes
│   ├── Interviews
│   └── Profile
│
└── STUDENT
    ├── Dashboard
    ├── Placement Drives
    ├── My Applications
    ├── Resume
    ├── Interviews
    └── Profile

============================================================
GLOBAL LAYOUT
============================================================

Authenticated pages use:

Collapsible Sidebar
Top Navigation
Global Search
Notifications
User Profile
Breadcrumbs

Desktop:

Persistent sidebar.

Tablet:

Collapsible sidebar.

Mobile:

Drawer navigation.

Sidebar should dynamically change based on the authenticated user's role.

Do NOT show Owner navigation to Students.

Do NOT show Company management navigation to Colleges.

Do NOT show College administration navigation to Companies.

============================================================
LOGIN PAGE
============================================================

Use a premium split-screen layout.

LEFT:

PlaceDrive branding
Platform tagline
Elegant enterprise illustration
Platform statistics
Short testimonial

RIGHT:

Welcome back
Email
Password
Show/hide password
Forgot password
Login button

Below:

Don't have an account?

Create account →

Also provide a subtle demo account section if useful.

Do not expose real passwords.

============================================================
OWNER MODULE
============================================================

OWNER = Platform Administrator.

Dashboard endpoint:

GET /api/owner/dashboard

Create a premium Super Admin Dashboard.

Display:

Platform Overview

Total Colleges

Total Companies

Total Students

Placement Drives

Applications

Interviews

Placement statistics

Pending approvals

Recent activity

Platform health

Governance alerts

Audit-style activity

Analytics

Quick Actions

Navigation:

Dashboard
Colleges
Companies
Students
Placement Drives
Applications
Analytics
Governance
Notifications
Settings

============================================================
OWNER — COLLEGE MANAGEMENT
============================================================

Dedicated College Approval interface.

College cards/table contain:

College Name
College Code
NAAC Grade
University
State
Website
Placement Officer
Registration Date
Approval Status

Actions:

Approve
Reject
View Details

Use:

Search
Filters
Sorting
Status filters
Pagination

============================================================
OWNER — COMPANY MANAGEMENT
============================================================

Create a visually distinct enterprise Company Approval interface.

Company information:

Company Name
Company Code
Industry
Company Type
City
State
Website
Corporate Email
HR Name
HR Email
HR Phone
Approval Status
Registration Date

Actions:

Approve
Reject
Suspend
View Details

Do NOT make Company Approval visually identical to College Approval.

Keep both within the same design system but clearly differentiate their workflows.

============================================================
OWNER — DETAILS DRAWER
============================================================

Clicking View Details opens a right-side drawer.

Never navigate away.

Drawer:

Header
Logo/avatar
Name
Status Badge

Basic Information

Contact Information

Verification Information

Timeline

Activity History

Notes

Footer:

Approve
Reject
Suspend
Close

Use smooth subtle drawer animation.

============================================================
OWNER — PLACEMENT DRIVES
============================================================

Platform-wide monitoring.

Display:

Company
Drive Title
Job Role
Location
Applications
Deadline
Status

Statuses:

DRAFT
OPEN
CLOSED

Actions:

View
Disable
Archive

This is platform monitoring.

Do not create unnecessary CRUD controls for Owner unless backend supports them.

============================================================
OWNER — ANALYTICS
============================================================

Use enterprise platform terminology.

Use Recharts.

Examples:

Registered Users Trend
Platform Growth
Platform Placement Overview
Application Trends
Interview Trends
Company Participation
College Participation
Platform Distribution

Avoid making analytics unnecessarily student-centric.

Charts should be elegant and minimal.

============================================================
OWNER — PLATFORM HEALTH
============================================================

Display:

Overall Health
System Uptime
API Response Time
Database Status
Background Jobs
Last Health Check

Use simple indicators:

Green
Orange
Red

============================================================
OWNER — GOVERNANCE
============================================================

Create Governance Monitoring page.

Alerts:

Critical
High
Medium
Low

Each alert:

Priority
Timestamp
Description
Review action

Use clean enterprise styling.

============================================================
COLLEGE MODULE
============================================================

College Dashboard:

GET /api/college/dashboard

Display:

College Name
College Code

Total Students
Verified Students
Pending Students
Rejected Students

Total Applications
Applied Applications
Shortlisted Students
Selected Students
Rejected Applications

Recent Applications

Students

Placement activity

Navigation:

Dashboard
Students
Verification
Applications
Placement Activity
Profile

============================================================
COLLEGE — STUDENTS
============================================================

Show college students.

Student information:

Name
Register Number
Email
Phone
Department
Course
Graduation Year
Verification Status

Statuses:

PENDING
VERIFIED
REJECTED

Provide:

Search
Filters
View details

If backend supports verification actions, provide:

Verify
Reject

Use confirmation dialogs.

============================================================
COLLEGE — APPLICATIONS
============================================================

Display applications belonging to college students.

Show:

Student
Register Number
Company
Placement Drive
Job Role
Application Status
Applied Date

Statuses:

APPLIED
SHORTLISTED
SELECTED
REJECTED

============================================================
COMPANY MODULE
============================================================

Company Dashboard endpoint:

GET /api/company/dashboard

Display:

Company Name

Total Drives
Total Applications
Applied
Shortlisted
Selected
Rejected
Scheduled Interviews

Placement Drives
Applications
Interviews
Candidates
Resumes
Company Profile

============================================================
COMPANY — PLACEMENT DRIVES
============================================================

Existing APIs:

POST /api/placement-drives

GET /api/placement-drives

GET /api/placement-drives/{id}

GET /api/placement-drives/company/{companyId}

PUT /api/placement-drives/{id}

PUT /api/placement-drives/{id}/open

PUT /api/placement-drives/{id}/close

DELETE /api/placement-drives/{id}

Company can:

Create
View
Edit
Open
Close
Delete

Drive fields:

driveTitle
jobRole
jobDescription
employmentType
salaryPackage
location
applicationDeadline
eligibilityCriteria
minimumCgpa
passingYear
eligibleDepartments

Create a premium multi-section form.

============================================================
COMPANY — APPLICATIONS
============================================================

Existing APIs:

GET /api/applications/drive/{driveId}

GET /api/applications/{id}

PUT /api/applications/{id}/status

Display:

Candidate
Register Number
College
Department
Drive
Job Role
Application Date
Status

Actions:

Shortlist
Reject
Select

Statuses:

APPLIED
SHORTLISTED
SELECTED
REJECTED

Use a clean candidate-management interface.

============================================================
COMPANY — RESUMES
============================================================

Existing APIs:

GET /api/resumes/application/{applicationId}

GET /api/resumes/application/{applicationId}/download

Company can:

View applicant resume information
Download applicant PDF resume

Show:

Student Name
Register Number
Resume File
File Size
Uploaded Date
Download button

============================================================
COMPANY — INTERVIEWS
============================================================

Existing APIs:

POST /api/interviews/application/{applicationId}

GET /api/interviews/{id}

GET /api/interviews/application/{applicationId}

PUT /api/interviews/{id}/status

Company can schedule interviews.

Fields:

Date
Time
Mode
Meeting Link
Location
Interviewer Name

Modes:

ONLINE
OFFLINE

Statuses:

SCHEDULED
COMPLETED
PASSED
FAILED

Company can update:

Status
Feedback

Create:

Interview list
Interview details
Schedule modal
Interview timeline

============================================================
STUDENT MODULE
============================================================

Student Dashboard endpoint:

GET /api/student/dashboard

Display:

Student Name
Register Number
Department
Course
Graduation Year
Verification Status
Resume Status

Statistics:

Total Applications
Applied
Shortlisted
Selected
Rejected
Interviews

Upcoming Interviews

Recent Applications

Navigation:

Dashboard
Placement Drives
My Applications
Resume
Interviews
Profile

============================================================
STUDENT — PLACEMENT DRIVES
============================================================

Students can browse available drives.

Use:

GET /api/placement-drives

Show:

Company
Drive Title
Job Role
Salary Package
Location
Employment Type
Deadline
Minimum CGPA
Eligible Departments
Status

Only OPEN drives should have an Apply action.

Create polished Drive Details page/drawer.

============================================================
STUDENT — APPLICATIONS
============================================================

Existing APIs:

POST /api/applications/drive/{driveId}

GET /api/applications/my

GET /api/applications/{id}

Student can:

Apply
View applications
View status

Application statuses:

APPLIED
SHORTLISTED
SELECTED
REJECTED

Create an elegant application progress timeline.

============================================================
STUDENT — RESUME
============================================================

Existing APIs:

POST /api/resumes/upload

GET /api/resumes/my

GET /api/resumes/my/download

Student can:

Upload PDF
View resume information
Download resume
Replace resume

Show:

File Name
File Size
Upload Date

Maximum file size:

5 MB

Only PDF.

Use drag-and-drop upload.

Show:

Upload progress
Success
Validation error
File type error
File size error

============================================================
STUDENT — INTERVIEWS
============================================================

Student can view interviews.

Display:

Company
Drive
Job Role
Date
Time
Mode
Interviewer
Meeting Link
Location
Status
Feedback

Create timeline/calendar-style presentation.

Highlight upcoming interviews.

============================================================
PROFILE PAGES
============================================================

Create role-specific profile pages.

STUDENT:

Personal information
College
Department
Course
Graduation Year
Register Number
Verification Status

COLLEGE:

College Name
College Code
University
Accreditation
Address
Placement Officer
Approval Status

COMPANY:

Company Name
Company Code
Industry
Company Type
Address
HR Information
Approval Status

OWNER:

Name
Email
Phone
Platform role

============================================================
API ARCHITECTURE
============================================================

Create:

src/
│
├── api/
│   ├── axios.ts
│   ├── authApi.ts
│   ├── ownerApi.ts
│   ├── collegeApi.ts
│   ├── companyApi.ts
│   ├── studentApi.ts
│   ├── driveApi.ts
│   ├── applicationApi.ts
│   ├── resumeApi.ts
│   └── interviewApi.ts
│
├── components/
│
├── layouts/
│   ├── OwnerLayout.tsx
│   ├── CollegeLayout.tsx
│   ├── CompanyLayout.tsx
│   └── StudentLayout.tsx
│
├── pages/
│   ├── auth/
│   ├── owner/
│   ├── college/
│   ├── company/
│   └── student/
│
├── context/
│   └── AuthContext.tsx
│
├── hooks/
│
├── routes/
│   └── AppRoutes.tsx
│
├── types/
│
├── utils/
│
└── App.tsx

============================================================
API ENDPOINTS
============================================================

AUTH:

POST /api/auth/login
POST /api/auth/register

OWNER:

GET /api/owner/dashboard

COLLEGE:

GET /api/college/dashboard

COMPANY:

GET /api/company/dashboard

STUDENT:

GET /api/student/dashboard

PLACEMENT DRIVES:

POST /api/placement-drives
GET /api/placement-drives
GET /api/placement-drives/{id}
GET /api/placement-drives/company/{companyId}
PUT /api/placement-drives/{id}
PUT /api/placement-drives/{id}/open
PUT /api/placement-drives/{id}/close
DELETE /api/placement-drives/{id}

APPLICATIONS:

POST /api/applications/drive/{driveId}
GET /api/applications/my
GET /api/applications/{id}
GET /api/applications/drive/{driveId}
PUT /api/applications/{id}/status

RESUMES:

POST /api/resumes/upload
GET /api/resumes/my
GET /api/resumes/my/download
GET /api/resumes/application/{applicationId}
GET /api/resumes/application/{applicationId}/download

INTERVIEWS:

POST /api/interviews/application/{applicationId}
GET /api/interviews/{id}
GET /api/interviews/application/{applicationId}
PUT /api/interviews/{id}/status

IMPORTANT:

Use ONLY these existing APIs.

Do not invent APIs such as:

/api/students/approve
/api/companies/list
/api/analytics
/api/notifications

unless the backend later provides them.

If a desired UI feature does not have a backend endpoint, make the UI visually ready but do not fake functionality.

============================================================
API ERROR HANDLING
============================================================

Every API request must support:

Loading
Success
Error
Empty

Handle:

401 Unauthorized
403 Forbidden
404 Not Found
400 Bad Request
500 Server Error

For 403:

"Access denied. You don't have permission to perform this action."

For common backend validation errors, display friendly messages.

Do not expose technical stack traces.

============================================================
REUSABLE COMPONENTS
============================================================

Create:

Sidebar
TopNavbar
Breadcrumb
GlobalSearch
NotificationButton
UserMenu
StatCard
DataTable
SearchBar
FilterDropdown
StatusBadge
Modal
Drawer
ConfirmationDialog
Toast
LoadingSkeleton
EmptyState
ErrorState
Pagination
FormField
FileUploader
InterviewTimeline
ApplicationTimeline
DriveCard
CandidateCard

Everything should be reusable.

============================================================
GLOBAL SEARCH
============================================================

Create Ctrl + K search interface.

Search categories:

Colleges
Companies
Placement Drives

Features:

Instant Search
Keyboard Navigation
Recent Searches

Do not create fake search backend behavior.

Prepare the component for future API integration.

============================================================
NOTIFICATIONS
============================================================

Create a professional notification center UI.

Use realistic system states but do not hardcode fake backend notifications as actual data.

Prepare the UI architecture for future notification APIs.

============================================================
SETTINGS
============================================================

Create professional settings pages.

Sections:

General
Profile
Authentication & Security
Notifications
Platform Configuration
System Information

Use clean settings cards.

Do not show "Under Construction."

If a setting has no backend support yet, keep the UI non-destructive and clearly avoid pretending that the setting is saved.

============================================================
MICRO INTERACTIONS
============================================================

Use Framer Motion only for subtle transitions.

Include:

Hover tooltips
Loading skeletons
Toast notifications
Confirmation dialogs
Button loading states
Soft hover animations
Focus rings
Drawer transitions
Modal transitions
Page transitions

Avoid flashy animations.

============================================================
ACCESSIBILITY
============================================================

Ensure:

Keyboard navigation
Visible focus states
Accessible buttons
ARIA labels
Good contrast
Proper form labels
Accessible dialogs
Accessible tables

============================================================
RESPONSIVE DESIGN
============================================================

Fully responsive:

Large Desktop
Desktop
Laptop
Tablet
Mobile

Desktop:

Sidebar + content.

Tablet:

Collapsible sidebar.

Mobile:

Drawer navigation.

Tables should become horizontally scrollable or transform into cards where appropriate.

============================================================
DATA RULES
============================================================

Never create fake statistics.

Never hardcode:

Total Students
Applications
Companies
Drives
Interviews

These must come from backend APIs.

Use realistic loading skeletons until API data arrives.

Use empty states when the backend returns empty data.

============================================================
SECURITY RULES
============================================================

Frontend must respect backend authorization.

OWNER:

Platform administration.

COLLEGE:

Own college/student-related operations.

COMPANY:

Own company/drives/applications/interviews.

STUDENT:

Own applications/resume/interviews/profile.

Never expose unauthorized actions merely because the UI has a button.

The backend remains the final security authority.

============================================================
UX RULES
============================================================

For destructive actions:

Delete
Reject
Suspend
Close Drive

always show confirmation.

For successful operations:

show toast.

For API loading:

show skeleton or spinner.

For empty lists:

show useful empty-state message.

For errors:

show actionable error state.

============================================================
DESIGN QUALITY
============================================================

Every screen must feel:

Premium
Minimal
Enterprise
Professional
Trustworthy
Government-ready
Production-ready

Do not use:

Lorem ipsum
Placeholder cards
Fake charts
Fake numbers
Random gradients
Random colors
Generic dashboard templates
Excessive rounded containers
Excessive animations
Crowded layouts

Use consistent spacing and visual hierarchy.

============================================================
FINAL APPLICATION FLOW
============================================================

LOGIN

Login
↓
JWT Authentication
↓
Determine Role
↓
Role-based Dashboard

REGISTER

Register
↓
Choose:
Student / College / Company
↓
Registration
↓
Approval / Verification workflow
↓
Login

OWNER

Dashboard
↓
Manage Colleges
↓
Manage Companies
↓
Monitor Students
↓
Monitor Placement Drives
↓
Governance

COLLEGE

Dashboard
↓
Students
↓
Verify Students
↓
Applications
↓
Placement Activity

COMPANY

Dashboard
↓
Create Placement Drive
↓
Open Drive
↓
Receive Applications
↓
Shortlist Candidates
↓
View Resume
↓
Schedule Interview
↓
Complete Interview
↓
Pass / Fail
↓
Select / Reject

STUDENT

Dashboard
↓
Browse Placement Drives
↓
Apply
↓
Upload Resume
↓
Track Application
↓
View Interview
↓
Attend Interview
↓
View Result

============================================================
FINAL GOAL
============================================================

The final product must look and behave like a sophisticated enterprise placement management platform rather than a student CRUD project.

Use the Grey + White visual identity consistently across every role.

Use one React + TypeScript application.

Use one shared authentication system.

Use role-based protected routing.

Use reusable components.

Use the existing Spring Boot backend.

Use real REST API integration.

Do not create mock backend functionality.

The UI must be polished enough for:

Final-year project demonstration
College presentation
Recruiter demonstration
Portfolio
Production-style SaaS showcase

The overall visual quality should resemble a combination of:

Linear
Stripe
Vercel
Clerk
Notion
Raycast
GitHub Enterprise

with a sophisticated Grey + White enterprise aesthetic.

FREEZE THE DESIGN SYSTEM AFTER IMPLEMENTATION.

Do not redesign the architecture later.

Prioritize:

1. Authentication
2. Registration
3. JWT handling
4. Role-based routing
5. Owner Dashboard
6. College Dashboard
7. Company Dashboard
8. Student Dashboard
9. Placement Drives
10. Applications
11. Resume Management
12. Interviews
13. Security
14. API Integration
15. Responsive UX
16. Final Production Polish