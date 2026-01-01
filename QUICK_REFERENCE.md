# Quick Reference - Single Auth System

## Login
**Endpoint:** `/login`
**All users** (admin, manager, trainer, viewer, member) use the same login page.

## After Login Redirect
- **Member role only** → `/member/dashboard`
- **Admin/Manager/Trainer/Viewer** → `/dashboard`

## Check User Role (Backend)
```php
$user = auth()->user();

$user->isMember();  // true if user has Member role
$user->isTrainer(); // true if user has Trainer role
$user->isAdmin();   // true if user has Admin or Manager role

// Get profile
$memberProfile = $user->member;  // Member model or null
$trainerProfile = $user->trainer; // Trainer model or null
```

## Check Permission (Backend)
```php
if (auth()->user()->hasPermission('view_members')) {
    // User has permission
}
```

## Check Permission (Frontend)
```tsx
const { auth } = usePage<SharedData>().props;

if (auth.permissions.includes('view_members')) {
    // Show UI element
}

// Check role
const isMember = auth.user.roles.some(r => r.name === 'Member');
```

## Create New User with Profile

### Member
```php
use App\Models\User;
use App\Models\Member;
use App\Models\Role;

DB::transaction(function () {
    $user = User::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'password' => bcrypt('password'),
        'status' => 'active',
    ]);
    
    $memberRole = Role::where('name', 'Member')->first();
    $user->roles()->attach($memberRole->id);
    
    Member::create([
        'user_id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'phone' => $user->phone,
        'gender' => 'male',
        'date_of_birth' => '1990-01-01',
        'join_date' => now(),
        'status' => 'active',
    ]);
});
```

### Trainer
```php
DB::transaction(function () {
    $user = User::create([
        'name' => 'Jane Trainer',
        'email' => 'jane@example.com',
        'password' => bcrypt('password'),
        'status' => 'active',
    ]);
    
    $trainerRole = Role::where('name', 'Trainer')->first();
    $user->roles()->attach($trainerRole->id);
    
    Trainer::create([
        'user_id' => $user->id,
        'specialization' => 'Yoga',
        'experience_years' => 5,
        'salary' => 50000,
        'joining_date' => now(),
        'status' => 'active',
    ]);
});
```

## Database Structure
```
users (authentication)
├── id
├── name
├── email
├── password
├── phone
├── profile_image
└── status

members (profile data)
├── id
├── user_id → users.id
├── name, email, phone
├── gender, date_of_birth
├── address, photo
└── join_date, status

trainers (profile data)
├── id
├── user_id → users.id
├── specialization
├── experience_years
├── salary
└── joining_date, bio, status

roles
├── Admin
├── Manager
├── Trainer
├── Viewer
└── Member
```

## Routes Protection
```php
// In routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    // Admin routes - auto-protected by RedirectBasedOnRole middleware
    Route::get('dashboard', [DashboardController::class, 'index']);
    
    // Member routes - auto-protected by RedirectBasedOnRole middleware
    Route::get('member/dashboard', [MemberDashboardController::class, 'index']);
});
```

## Key Files
- **User Model:** `app/Models/User.php`
- **Member Model:** `app/Models/Member.php`
- **Trainer Model:** `app/Models/Trainer.php`
- **Dashboard Controller:** `app/Http/Controllers/DashboardController.php`
- **Member Dashboard:** `app/Http/Controllers/MemberDashboardController.php`
- **Role Middleware:** `app/Http/Middleware/RedirectBasedOnRole.php`
- **Inertia Middleware:** `app/Http/Middleware/HandleInertiaRequests.php`
