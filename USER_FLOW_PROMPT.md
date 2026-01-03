# Gympro Gym Management System - User Flow Prompt for AI Tools

## Project Overview

**Gympro** is a comprehensive web-based gym management system built with:
- **Backend**: Laravel 12 with Fortify authentication
- **Frontend**: React 19 with Inertia.js
- **Architecture**: Role-Based Access Control (RBAC), multi-user system with member portal

---

## System Architecture

### User Roles & Access Levels
1. **Admin** - Full system access, can manage all modules and users
2. **Manager** - Can manage most resources except roles/permissions
3. **Trainer** - Can view members, attendance, and trainer-specific data
4. **Viewer** - Read-only access to reports and analytics
5. **Member** - Limited portal access (view own subscriptions, attendance, payment history)

### User Types
- **System Users** (Admin/Manager/Trainer/Viewer) - Full dashboard access
- **Members** - Limited portal with personal data access only

---

## Core Modules & User Workflows

### 1. **Authentication & Authorization Flow**
**Entry Points:**
- Landing page (/)
- Login page (/login)
- Registration page (/register) - if enabled
- Password reset flow

**Actions:**
- User registration (email-based)
- Email verification
- Login with email/password
- Two-Factor Authentication (2FA) optional setup
- Password reset via email
- Password change in settings
- Account deletion

**Post-Login Behavior:**
- Admin/Manager/Trainer/Viewer → Admin Dashboard
- Member → Member Portal Dashboard

**Related Settings:**
- Profile management (name, email, phone, profile image)
- Two-Factor Authentication toggle
- Password management
- Appearance settings (theme selection)
- Notification preferences

---

### 2. **Member Management Module**
**User Personas:** Admin, Manager, Trainer

**Workflows:**

#### A. Browse Members
- View paginated list of all gym members
- Search by name/email/phone
- Filter by status (active, inactive, expired)
- Sort by join date, name, status
- View serial number reference

#### B. Add New Member
- Fill member details form (name, email, phone, gender, DOB, address, notes)
- Optional: Create linked user account for portal access
- Option to set initial status (active/inactive)
- Confirm and save

#### C. Edit Member
- Update member details
- Change status (active → inactive → expired)
- Modify member notes
- Update profile data

#### D. Delete Member
- Soft delete or hard delete option
- View related subscriptions before deletion
- Archive option

#### E. Member Analytics
- View member statistics on dashboard
- Total members count
- Active members count
- Member growth trends (on reports)

---

### 3. **Plan Management Module**
**User Personas:** Admin, Manager

**Workflows:**

#### A. Browse Plans
- View list of all membership plans
- Filter by status (active/inactive)
- See plan details: duration, price, features, shift type

#### B. Create Plan
- Define plan name
- Set duration (in months)
- Set pricing (monthly price, admission fee)
- Choose shift (morning, evening, full day)
- Set shift timings (optional)
- Add features: personal training, group classes, locker facility
- Set status (active/inactive)

#### C. Edit Plan
- Modify plan details
- Update pricing
- Add/remove features
- Toggle active status

#### D. Delete Plan
- Delete inactive plans
- Prevent deletion if active subscriptions exist

#### E. Plan Selection
- **Member Portal**: Browse available plans
- View plan details with pricing breakdown
- Compare multiple plans
- Proceed to checkout for subscription

---

### 4. **Subscription Management Module**
**User Personas:** Admin, Manager, Member (view own)

**Workflows:**

#### A. Admin/Manager - Create Subscription
- Select member
- Choose plan
- Set start date
- Auto-calculate end date (based on plan duration)
- Set payment status (pending, paid)
- Apply admission fee
- Create subscription record

#### B. Admin/Manager - Browse Subscriptions
- Paginated list of all subscriptions
- Filter by status (active, expired, cancelled)
- Search by member name/email
- View subscription details:
  - Member name
  - Plan name
  - Duration
  - Start/end dates
  - Payment status
  - Remaining days
- Alert for expiring subscriptions (< 30 days)

#### C. Admin/Manager - Edit Subscription
- Modify start/end dates
- Change payment status
- Cancel subscription
- Renew subscription

#### D. Admin/Manager - Delete Subscription
- Remove subscription record
- Option to refund associated payments

#### E. Member - View Own Subscriptions
- See active subscription details
- View remaining days
- See expiration date
- View payment history for subscription
- Button to renew upcoming expiration

#### F. Renewal Workflow (Member)
- Check expiring subscriptions (dashboard alert)
- Browse available plans
- Initiate renewal (often at discounted rates)

---

### 5. **Attendance Tracking Module**
**User Personas:** Admin, Manager, Trainer, Member

**Workflows:**

#### A. Mark Attendance (Admin/Manager/Trainer)
**Manual Check-In:**
- View attendance page with date filter
- Select date
- Search member by name/email
- Toggle attendance status (present, absent, late)
- Save attendance record

#### B. QR Code Check-In (Member & Staff)
- Access QR check-in page (/qr-checkin)
- Member scans QR code or staff scans member QR
- Auto-mark present with timestamp
- Display check-in confirmation
- Support: No CSRF token required (public endpoint)

#### C. View Attendance Reports
- Date-range selection
- Filter by member
- View attendance statistics:
  - Total check-ins
  - Attendance rate (%)
  - Most/least active days
  - Per-member attendance trends
- Export to PDF/Excel

#### D. Member - View Own Attendance
- View personal attendance history
- See check-in dates and times
- View attendance statistics
- Monthly attendance summary

---

### 6. **Payment Management Module**
**User Personas:** Admin, Manager, Member

**Workflows:**

#### A. Record Payment (Admin/Manager)
- Create payment record manually
- Select payment method
- Set amount and payment date
- Link to subscription/member
- Set status (pending, completed, failed, refunded)
- Add notes

#### B. Browse Payments
- Paginated list of all payments
- Filter by status (completed, pending, failed, refunded)
- Search by member name/subscription
- Sort by date, amount
- View payment details

#### C. PhonePe Payment Gateway Integration
**Member Flow:**
1. Member selects plan to purchase
2. Click "Checkout" button
3. PhonePe payment form
4. User enters payment details
5. PhonePe processes payment
6. Callback to `/phonepe/callback/{orderId}`
7. Payment status updated in system
8. Subscription created upon success

#### D. Generate Invoice
- Select payment record
- Generate PDF invoice
- Display invoice details:
  - Member info
  - Payment details
  - Plan/Subscription info
  - Amount, tax, total
- Download or email invoice

#### E. Refund Workflow
- Mark payment as refunded
- Record refund date/amount
- Update subscription status

#### F. Member - View Payment History
- See all payments for memberships
- Download invoices
- View transaction status

---

### 7. **Trainer Management Module**
**User Personas:** Admin, Manager

**Workflows:**

#### A. Browse Trainers
- View list of all trainers
- Filter by status (active/inactive)
- Search by name
- View trainer details (specialization, contact info)

#### B. Add Trainer
- Fill trainer form
- Name, specialization, qualifications
- Contact information (email, phone)
- Set status (active/inactive)
- Optional: Add profile image

#### C. Edit Trainer
- Update trainer details
- Change specialization/qualifications
- Update contact information
- Change status

#### D. Delete Trainer
- Remove trainer record
- Option to archive instead

#### E. Trainer-Member Assignment (Future)
- Assign trainers to members for personal training
- Track training sessions

---

### 8. **User Management Module**
**User Personas:** Admin, Manager

**Workflows:**

#### A. Browse System Users
- View list of system users (Admin, Manager, Trainer, Viewer)
- Filter by status (active/inactive)
- Filter by role
- Search by name/email

#### B. Create User
- Email address
- Set password
- Full name, phone
- Assign role(s)
- Set status (active/inactive)
- Optional: Upload profile image

#### C. Edit User
- Update user information
- Change assigned roles (multiple roles supported)
- Update contact info
- Toggle status

#### D. Reset User Password
- Force password reset link
- User receives email with reset link
- User sets new password

#### E. Delete User
- Soft or hard delete
- Option to archive user account

---

### 9. **Roles & Permissions Module**
**User Personas:** Admin only (super-admin)

**Workflows:**

#### A. Browse Roles
- View all system roles (Admin, Manager, Trainer, Viewer, Member)
- View permissions assigned to each role
- See scrollable permissions grid

#### B. Create Custom Role
- Enter role name
- Select permissions from grid:
  - Members: view, create, edit, delete
  - Plans: view, create, edit, delete
  - Subscriptions: view, create, edit, delete
  - Attendance: view, create, edit, delete
  - Trainers: view, create, edit, delete
  - Payments: view, create, edit, delete
  - Users: view, create, edit, delete
  - Roles: view, create, edit, delete
  - Settings: view, edit
  - Reports: view
- Save role with permissions

#### C. Edit Role
- Modify role name
- Update permission grid (check/uncheck)
- Save changes
- Affects all users with this role immediately

#### D. Delete Role
- Delete custom roles (can't delete system roles)
- Reassign users to different role first

---

### 10. **Equipment Management Module**
**User Personas:** Admin, Manager

**Workflows:**

#### A. Browse Equipment
- View list of all gym equipment
- Filter by status
- Search by name
- View equipment details

#### B. Add Equipment
- Equipment name
- Category/type
- Quantity
- Purchase date
- Status (active/needs maintenance/damaged)
- Notes

#### C. Edit Equipment
- Update equipment details
- Change status
- Update quantity
- Add maintenance notes

#### D. Delete Equipment
- Remove equipment record

---

### 11. **Expenses Module**
**User Personas:** Admin, Manager

**Workflows:**

#### A. Browse Expenses
- View list of expenses
- Filter by category/status
- Search by description
- View amount, date, category

#### B. Add Expense
- Expense date
- Category (equipment, utilities, maintenance, staff, other)
- Description
- Amount
- Attached receipt (optional)
- Status (pending, approved, paid)

#### C. Edit Expense
- Update expense details
- Change amount/category
- Update status

#### D. Delete Expense
- Remove expense record

#### E. Expense Reports
- View expenses by date range
- Category-wise breakdown
- Monthly expense trends
- Total expenses comparison

---

### 12. **Settings Module**
**User Personas:** Admin, Manager (with view_settings permission)

**Workflows:**

#### A. General Settings
- App configuration:
  - App name (displayed in sidebar)
  - App logo upload
  - Currency and currency symbol
  - Tax rate (%)
  - Business information (name, address, phone, email, website)
  - Timezone
  - Default shift timings

#### B. Payment Gateway Settings
- PhonePe configuration:
  - API key
  - Merchant ID
  - Test/live mode
  - Webhook configuration

#### C. Email Settings
- SMTP configuration
- Email templates
- Notification triggers

#### D. User Settings (Personal)
- Profile picture
- Full name, phone
- Email address
- Password change
- 2FA setup/toggle
- Theme preference (light/dark/auto)
- Notification preferences

---

### 13. **Reports & Analytics Module**
**User Personas:** Admin, Manager, Trainer, Viewer

**Workflows:**

#### A. Dashboard Analytics
- Overview cards showing:
  - Total members, Active members
  - Total subscriptions, Active subscriptions
  - Revenue this month
- Alert section: Subscriptions expiring soon (< 30 days)
- Recent subscriptions list
- Attendance summary chart
- Payment analytics

#### B. Attendance Reports
- Date range selector
- Per-member attendance rates
- Most/least active members
- Attendance trends (weekly, monthly)
- Export to PDF/Excel

#### C. Payment Reports
- Payment status breakdown
- Revenue by time period
- Payment method distribution
- Outstanding/overdue payments
- Tax calculations
- Export functionality

#### D. Subscription Analytics
- Active/expired subscriptions count
- Plan popularity (subscriptions per plan)
- Revenue by plan
- Member retention rates
- Subscription renewal rates

#### E. Member Reports
- Member growth trends
- Member status distribution
- Demographics (gender, age groups)
- Most active members
- Member demographics analysis

#### F. Export Functionality
- CSV export for data
- PDF report generation
- Email reports
- Scheduled reports (future)

---

### 14. **Member Portal Workflows**
**User Personas:** Member (limited access)

#### A. Member Login
- Email/password authentication
- Dashboard shows personal data only

#### B. View Dashboard
- Current active subscription (if any)
- Days remaining in subscription
- Next renewal date
- Last attendance date
- Upcoming dues alert

#### C. Browse & Purchase Plans
- View available plans
- See plan details (duration, price, features, shift)
- Plan comparison
- Select and proceed to checkout

#### D. Checkout & Payment
- Review selected plan
- Enter billing details
- Choose payment method (PhonePe)
- Process payment
- Confirmation page

#### E. View Attendance
- Personal attendance history
- Check-in times
- Attendance rate
- Monthly summary

#### F. Account Settings
- Update profile
- Change password
- 2FA setup
- Notification preferences

#### G. View Invoices
- Download payment invoices
- Email invoice option

---

## User Journey Maps

### 1. **Admin/Staff Member Daily Workflow**
```
Login → Dashboard 
  ├─ Review expiring subscriptions alert
  ├─ Check daily stats
  └─ Proceed to tasks:
      ├─ Mark attendance (manual or QR)
      ├─ Record payments
      ├─ Manage members/subscriptions
      ├─ View reports
      └─ Update settings (if admin)
```

### 2. **New Member Onboarding (Admin Creates Account)**
```
Admin Dashboard 
  → Members section 
  → Add New Member 
  → Fill Details 
  → Create linked user account (optional) 
  → Member receives welcome email 
  → Member can login to portal 
  → Member browses plans 
  → Member selects plan 
  → Proceed to checkout 
  → PhonePe payment 
  → Subscription created 
  → Confirmation email sent
```

### 3. **Member Self-Service Journey**
```
Landing Page 
  → Register/Login 
  → Email verification 
  → Member Dashboard 
  → Browse Plans 
  → Select Plan 
  → Checkout 
  → PhonePe Payment 
  → Payment Confirmation 
  → Subscription Active 
  → View Attendance Records 
  → Check Renewal Dates 
  → Settings/Profile
```

### 4. **Subscription Renewal Flow**
```
Member Portal 
  → Dashboard (sees expiration alert) 
  → Click Renew 
  → Select plan 
  → Review pricing 
  → Checkout 
  → Payment 
  → New subscription created 
  → Confirmation sent
```

---

## Key Business Logic & Constraints

### Subscription Management
- Automatic end date calculation: `start_date + (plan.duration_months * 30 days)`
- Subscriptions with `status = expired` still visible in history
- Can have multiple subscriptions (sequential or overlapping)
- Admission fee applied once per subscription

### Payment Processing
- PhonePe integration via callback webhook
- Payment status: pending → completed (or failed/refunded)
- Invoice generation includes member, plan, and payment details
- Tax calculated on base amount

### Attendance Tracking
- QR code check-in bypasses CSRF protection (public endpoint)
- Single check-in per day per member
- Late marking (manual entry only)
- Automatic timestamps on QR check-in

### Permissions & Access Control
- Granular permission system by action (view, create, edit, delete)
- Multiple roles per user supported
- Permission checks: `auth()->user()->hasPermission('view_members')`
- Settings pages require `view_settings` and `edit_settings` permissions

### Two-Factor Authentication
- Optional per user
- Recovery codes available
- Email-based OTP (via Laravel Fortify)
- Password confirmation required to enable

---

## Technical Notes for Flow Diagramming

### Routes Structure
- Public routes: `/`, `/login`, `/register`, `/forgot-password`
- Protected routes: All under `auth` and `verified` middleware
- Admin routes: Additional role-based middleware
- Settings routes: In separate `settings.php` file with auth middleware
- PhonePe callback: Without CSRF protection (webhook)

### Frontend Components
- Built with React 19 + Inertia.js
- UI components from shadcn/ui (Button, Card, Dialog, Form, Table, etc.)
- Layout: AppLayout (authenticated pages), AuthLayout (auth pages)
- Settings: Separate SettingsLayout with sidebar navigation

### Database Models
- **User**: System users with roles and permissions
- **Member**: Gym members (can be linked to User)
- **Plan**: Membership plans with features
- **Subscription**: Link between Member and Plan
- **Payment**: Payment records with status tracking
- **Attendance**: Daily attendance records
- **Role/Permission**: RBAC tables
- **Equipment**, **Expense**, **Trainer**: Supporting modules

---

## Prompt Template for AI Tools (e.g., Lucidchart, Miro, Draw.io)

### For Complete System Flow:
```
Generate a comprehensive user flow diagram for a Gym Management System 
with the following components:

1. Authentication layer (login, register, password reset, 2FA)
2. Role-based access control (Admin, Manager, Trainer, Viewer, Member)
3. Member management (browse, add, edit, delete)
4. Plan management (create, view, select)
5. Subscription workflow (create, manage, renew)
6. Payment processing (manual entry, PhonePe gateway integration, invoicing)
7. Attendance tracking (manual and QR code check-in)
8. Admin dashboard with analytics
9. Member portal with limited access
10. Settings and configuration
11. Reports and exports

Include decision points for permissions, conditional routing based on user role,
and payment status flows. Show async operations (PhonePe callback handling).
```

### For Specific Module Flow:
```
Generate a user flow diagram for [MODULE NAME] in the Gym Management System.
User personas: [List personas].
Key workflows: [List workflows].
Decision points: [List decision points].
Integration points: [List integrations].
```

---

## Implementation Checklist for Flow Diagrams

- [ ] Login/Authentication entrance point
- [ ] Role-based branching after login
- [ ] Member CRUD operations
- [ ] Plan browsing and selection
- [ ] Subscription creation and renewal
- [ ] Payment flow with PhonePe integration
- [ ] Callback handling (async)
- [ ] Attendance manual and QR workflows
- [ ] Settings and profile management
- [ ] Permissions checks at each node
- [ ] Error handling paths
- [ ] Success/confirmation screens
- [ ] Export/reporting endpoints
- [ ] Email notifications (async)
- [ ] Dashboard analytics views

---

## Color Coding Suggestions for Flow Diagrams

- **Blue**: System/Admin actions
- **Green**: Member/User actions
- **Yellow**: Payment/Financial operations
- **Red**: Destructive actions (delete)
- **Purple**: Settings/Configuration
- **Orange**: Alerts/Notifications
- **Gray**: System processes/async operations

