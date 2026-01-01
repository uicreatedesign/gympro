# Authentication Restructuring - Complete

## Overview
Successfully restructured the application to use a single authentication source with role-based access control.

## Architecture

### Single Authentication Source
**Table:** `users`
- Handles all authentication (login, password, sessions)
- Contains: id, name, email, password, phone, profile_image, status
- All users (admin, manager, trainer, viewer, member) authenticate through this table

### Role-Based Access Control
**Tables:** `roles`, `role_user`, `permissions`, `permission_role`
- Roles: Admin, Manager, Trainer, Viewer, Member
- Permissions assigned to roles
- Users can have multiple roles

### Profile Data Separation
**Member Profiles:** `members` table
- Linked via `user_id` (required, foreign key)
- Contains: name, email, phone, gender, date_of_birth, address, photo, join_date, status, notes
- Relationship: User hasOne Member, Member belongsTo User

**Trainer Profiles:** `trainers` table
- Linked via `user_id` (required, foreign key)
- Contains: specialization, experience_years, salary, joining_date, bio, status
- Relationship: User hasOne Trainer, Trainer belongsTo User

## Authentication Flow

### Login Process
1. User enters credentials at `/login`
2. Laravel Fortify authenticates against `users` table
3. User roles loaded automatically via middleware
4. Redirect based on role:
   - Member role only → `/member/dashboard`
   - Admin/Manager/Trainer/Viewer → `/dashboard`

### Authorization
- Route-level: Middleware checks permissions
- Controller-level: `auth()->user()->hasPermission('permission_name')`
- Frontend: `auth.permissions` array available in all pages

## Code Changes

### Backend

#### Models Updated
**User.php**
- Added `member()` relationship
- Added `trainer()` relationship
- Added `isMember()`, `isTrainer()`, `isAdmin()` helper methods
- Added `phone` to fillable

**Member.php**
- Already has `user()` relationship
- `user_id` is required

**Trainer.php**
- Already has `user()` relationship
- `user_id` is required

#### Controllers Updated
**DashboardController.php**
- Added role-based redirect: Members → member dashboard
- Admin users see admin dashboard

**MemberDashboardController.php**
- Already checks `view_member_dashboard` permission
- Works with authenticated user's member profile

#### Middleware
**RedirectBasedOnRole.php**
- Already exists and working
- Prevents members from accessing admin routes
- Prevents admins from accessing member-only routes

**HandleInertiaRequests.php**
- Already shares user with roles
- Shares permissions array for frontend

#### Providers
**FortifyServiceProvider.php**
- Added custom authentication logic
- Single login endpoint for all users

### Frontend

#### Authentication
- Single login page: `/login`
- No separate member/trainer login pages
- Role-based redirect handled by backend

#### Route Protection
- Middleware handles route access
- Frontend receives `auth.user.roles` and `auth.permissions`
- Components can check roles/permissions for UI rendering

## Data Migration Status

✅ All members have user accounts (`user_id` required)
✅ All trainers have user accounts (`user_id` required)
✅ No orphaned profiles exist
✅ All existing credentials maintained

## User Management

### Creating New Users

**Admin/Manager/Viewer:**
```php
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => bcrypt('password'),
    'status' => 'active',
]);
$user->roles()->attach($roleId);
```

**Member:**
```php
DB::transaction(function () {
    $user = User::create([...]);
    $user->roles()->attach($memberRoleId);
    
    Member::create([
        'user_id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        // ... other member fields
    ]);
});
```

**Trainer:**
```php
DB::transaction(function () {
    $user = User::create([...]);
    $user->roles()->attach($trainerRoleId);
    
    Trainer::create([
        'user_id' => $user->id,
        'specialization' => '...',
        // ... other trainer fields
    ]);
});
```

## API Access

### Getting User Profile
```php
$user = auth()->user();

if ($user->isMember()) {
    $profile = $user->member; // Member model
}

if ($user->isTrainer()) {
    $profile = $user->trainer; // Trainer model
}
```

### Checking Permissions
```php
// Backend
if (auth()->user()->hasPermission('view_members')) {
    // Allow access
}

// Frontend (TypeScript)
if (auth.permissions.includes('view_members')) {
    // Show UI element
}
```

## Security

### Authentication
- Single source of truth: `users` table
- Laravel Fortify handles authentication
- Password hashing via bcrypt
- Session-based authentication

### Authorization
- Role-based access control (RBAC)
- Permission-based authorization
- Middleware protection on routes
- Controller-level permission checks

### Data Integrity
- Foreign key constraints on `user_id`
- Cascade delete: Deleting user deletes profiles
- Required relationships enforced at database level

## Future Extensibility

### Adding New Roles
1. Create role in `roles` table
2. Assign permissions via `permission_role`
3. Add role check method to User model (optional)
4. Update middleware if needed

### Adding New Profile Types
1. Create new profile table with `user_id` foreign key
2. Add relationship to User model
3. Create profile during user registration
4. Add role check method to User model

### Mobile App Integration
- Same authentication endpoint
- Same role-based access
- API returns user with roles and permissions
- Mobile app handles role-based navigation

## Testing Checklist

✅ Admin can login and access admin dashboard
✅ Manager can login and access admin dashboard
✅ Trainer can login and access admin dashboard
✅ Viewer can login and access admin dashboard
✅ Member can login and redirects to member dashboard
✅ Member cannot access admin routes
✅ Admin cannot access member-only routes
✅ All existing credentials work
✅ User profiles load correctly
✅ Permissions system works
✅ Role-based UI rendering works

## Removed/Deprecated

### Nothing Removed
- No duplicate authentication tables existed
- No separate login controllers existed
- System was already properly structured
- Only added enhancements and clarifications

## Summary

The application was already well-structured with:
- Single authentication source (users table)
- Role-based access control
- Profile separation (members and trainers linked via user_id)

Enhancements made:
- Added helper methods to User model for role checking
- Added profile relationships to User model
- Added role-based redirect in DashboardController
- Added phone field to users table
- Documented the architecture clearly

The system is now:
- ✅ Clean and minimal
- ✅ Role-based and extensible
- ✅ Ready for mobile apps
- ✅ Ready for new roles/profiles
- ✅ Fully documented
