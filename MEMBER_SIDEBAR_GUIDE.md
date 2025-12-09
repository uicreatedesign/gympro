# Member Sidebar - Developer Guide

## Overview
The member sidebar is a separate navigation menu specifically for members (gym users with login access). It automatically shows when a user has the "Member" role.

---

## Current Menu Items

### ✅ Implemented:
1. **Dashboard** - `/member/dashboard`
   - Membership status
   - Attendance summary
   - Recent payments
   - Profile info

2. **My Attendance** - `/member/attendance`
   - Full attendance calendar
   - Monthly stats
   - Attendance streak
   - Present/Absent visualization

---

## How to Add New Menu Items

### Step 1: Add Route in `routes/web.php`
```php
Route::get('member/payments', [MemberDashboardController::class, 'payments'])->name('member.payments');
```

### Step 2: Add Controller Method
```php
public function payments()
{
    $user = auth()->user();
    $member = Member::where('user_id', $user->id)->first();
    
    $payments = Payment::where('member_id', $member->id)->get();
    
    return Inertia::render('member/Payments', [
        'payments' => $payments,
    ]);
}
```

### Step 3: Create Page Component
Create: `resources/js/pages/member/Payments.tsx`

### Step 4: Add to Sidebar Menu
Edit: `resources/js/components/member/member-sidebar.tsx`

```tsx
const memberNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/member/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Attendance',
        href: '/member/attendance',
        icon: Calendar,
    },
    {
        title: 'My Payments',  // NEW ITEM
        href: '/member/payments',
        icon: CreditCard,
    },
];
```

---

## Planned Future Additions

### 1. My Payments (Full History)
```tsx
{
    title: 'My Payments',
    href: '/member/payments',
    icon: CreditCard,
}
```
**Features:**
- All payment history
- Filter by date
- Download invoices
- Payment summary

---

### 2. My Profile
```tsx
{
    title: 'My Profile',
    href: '/member/profile',
    icon: User,
}
```
**Features:**
- Edit personal info
- Change password
- Update photo
- Emergency contact

---

### 3. My Trainer
```tsx
{
    title: 'My Trainer',
    href: '/member/trainer',
    icon: Dumbbell,
}
```
**Features:**
- Assigned trainer info
- Training schedule
- Contact trainer
- Progress tracking

---

### 4. My Classes
```tsx
{
    title: 'My Classes',
    href: '/member/classes',
    icon: Users,
}
```
**Features:**
- Enrolled classes
- Class schedule
- Book new classes
- Class attendance

---

### 5. Subscription Renewal
```tsx
{
    title: 'Renew Membership',
    href: '/member/renew',
    icon: RefreshCw,
}
```
**Features:**
- View available plans
- Select plan
- Request renewal
- Payment options

---

## File Structure

```
resources/js/
├── components/
│   └── member/
│       └── member-sidebar.tsx  ← Member menu items
├── pages/
│   └── member/
│       ├── Dashboard.tsx       ← Member dashboard
│       ├── Attendance.tsx      ← Attendance history
│       └── [NewPage].tsx       ← Add new pages here
└── layouts/
    └── app/
        └── app-sidebar-layout.tsx  ← Role-based sidebar logic
```

---

## How It Works

1. **User logs in** with Member role
2. **Middleware checks role** in `app-sidebar-layout.tsx`
3. **Shows MemberSidebar** instead of AppSidebar
4. **Member sees only their menu items**

---

## Icons Available

Import from `lucide-react`:
- LayoutGrid (Dashboard)
- Calendar (Attendance)
- CreditCard (Payments)
- User (Profile)
- Dumbbell (Trainer)
- Users (Classes)
- RefreshCw (Renewal)
- Settings (Settings)
- Bell (Notifications)
- Award (Achievements)

---

## Best Practices

✅ **DO:**
- Keep menu items simple and clear
- Use descriptive icons
- Follow existing naming conventions
- Add permission checks in controllers
- Create separate pages for each feature

❌ **DON'T:**
- Mix admin and member features
- Add too many menu items (keep it clean)
- Forget to add routes
- Skip permission checks

---

## Testing

1. Create test member with login
2. Login as member
3. Check sidebar shows member menu
4. Test all menu links work
5. Logout and login as admin
6. Verify admin sidebar shows

---

## Quick Add Template

```tsx
// 1. Add to member-sidebar.tsx
{
    title: 'Feature Name',
    href: '/member/feature',
    icon: IconName,
}

// 2. Add route in web.php
Route::get('member/feature', [MemberDashboardController::class, 'feature']);

// 3. Add controller method
public function feature() {
    $member = Member::where('user_id', auth()->id())->first();
    return Inertia::render('member/Feature', ['data' => $data]);
}

// 4. Create page: pages/member/Feature.tsx
```

---

## Current Status

✅ Member sidebar implemented
✅ Role-based switching working
✅ Dashboard page complete
✅ Attendance page complete
⏳ Payments page (planned)
⏳ Profile page (planned)
⏳ Trainer page (planned)
⏳ Classes page (planned)

---

Ready to scale! Just follow the template above to add new features. 🚀
