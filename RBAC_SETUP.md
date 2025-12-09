# Role-Based Access Control (RBAC) System

## Setup Instructions

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Seed Roles and Permissions
```bash
php artisan db:seed --class=RolePermissionSeeder
```

### 3. Assign Role to User
```php
// In tinker or seeder
$user = User::find(1);
$adminRole = Role::where('name', 'Admin')->first();
$user->roles()->attach($adminRole->id);
```

## Usage

### Backend (Laravel)

#### Protect Routes
```php
Route::middleware(['auth', 'can:view_users'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});
```

#### Protect Controller Methods
```php
public function __construct()
{
    $this->middleware('can:view_users')->only(['index', 'show']);
    $this->middleware('can:create_users')->only(['create', 'store']);
    $this->middleware('can:edit_users')->only(['edit', 'update']);
    $this->middleware('can:delete_users')->only(['destroy']);
}
```

#### Check Permissions in Code
```php
if ($user->hasPermission('edit_users')) {
    // Allow action
}
```

### Frontend (React)

#### Use Permission Hook
```tsx
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
    const { hasPermission } = usePermissions();
    
    return (
        <>
            {hasPermission('create_users') && (
                <Button>Create User</Button>
            )}
        </>
    );
}
```

#### Access Permissions Directly
```tsx
import { usePage } from '@inertiajs/react';

function MyComponent() {
    const { auth } = usePage().props;
    const canEdit = auth.permissions.includes('edit_users');
    
    return canEdit ? <EditButton /> : null;
}
```

## Adding New Permissions

### 1. Add to Seeder
```php
// database/seeders/RolePermissionSeeder.php
$permissions = [
    ['name' => 'view_products', 'description' => 'View products list'],
    ['name' => 'create_products', 'description' => 'Create new products'],
    // ...
];
```

### 2. Assign to Roles
```php
$manager->permissions()->sync(
    Permission::whereIn('name', ['view_products', 'create_products'])->pluck('id')
);
```

### 3. Run Seeder
```bash
php artisan db:seed --class=RolePermissionSeeder
```

## Permission Naming Convention

- `view_[module]` - View/list items
- `create_[module]` - Create new items
- `edit_[module]` - Edit existing items
- `delete_[module]` - Delete items
- `manage_[feature]` - Special management permissions
- `export_[data]` - Export data permissions

## Default Roles

- **Admin**: Full system access (all permissions)
- **Manager**: Limited management access (view permissions)
- **Viewer**: Read-only access (view permissions only)

## API Endpoints

- `GET /roles` - List all roles with permissions
- `POST /roles` - Create new role
- `PUT /roles/{id}` - Update role
- `DELETE /roles/{id}` - Delete role
