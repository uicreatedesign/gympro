# Gympro - Mobile App Backend Preparation Guide

## Current Architecture Analysis

### ✅ What's Good
- **Laravel 12** - Modern, stable backend
- **RESTful Structure** - Controllers follow resource patterns
- **Role-Based Access Control** - Granular permissions system
- **Modular Design** - Separated concerns (Controllers, Models, Services)
- **Authentication** - Laravel Fortify with 2FA support

### ⚠️ What Needs Improvement

## 🎯 Recommended Changes for React Native Support

### 1. **Create API Routes (CRITICAL)**

**Current Issue:** All routes use Inertia.js (web-only)
**Solution:** Create separate API routes

Create `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    MemberController,
    AttendanceController,
    PlanController,
    SubscriptionController,
    PaymentController,
    TrainerController,
    DashboardController
};

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // Members
    Route::apiResource('members', MemberController::class);
    
    // Attendance
    Route::apiResource('attendances', AttendanceController::class);
    Route::post('attendances/qr-checkin', [AttendanceController::class, 'qrCheckIn']);
    Route::get('attendances/my-history', [AttendanceController::class, 'myHistory']);
    
    // Plans
    Route::apiResource('plans', PlanController::class);
    
    // Subscriptions
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::get('subscriptions/my-subscriptions', [SubscriptionController::class, 'mySubscriptions']);
    
    // Payments
    Route::apiResource('payments', PaymentController::class);
    Route::post('payments/initiate', [PaymentController::class, 'initiate']);
    
    // Trainers
    Route::apiResource('trainers', TrainerController::class);
});
```

### 2. **Install Laravel Sanctum (API Authentication)**

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

**Update `config/sanctum.php`:**
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
'expiration' => 60 * 24 * 30, // 30 days
```

### 3. **Create API Controllers**

Create `app/Http/Controllers/Api/` directory with API-specific controllers:

**Example: `app/Http/Controllers/Api/AuthController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $memberRole = \App\Models\Role::where('name', 'Member')->first();
        if ($memberRole) {
            $user->roles()->attach($memberRole->id);
        }

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles.permissions'),
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('roles.permissions'));
    }
}
```

### 4. **Create API Resources (Data Transformation)**

Create `app/Http/Resources/` for consistent API responses:

**Example: `app/Http/Resources/MemberResource.php`**

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ],
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,
            'address' => $this->address,
            'join_date' => $this->join_date,
            'status' => $this->status,
            'qr_code' => $this->qr_code,
            'active_subscription' => new SubscriptionResource($this->whenLoaded('activeSubscription')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

### 5. **Refactor Controllers for API Support**

**Create Base API Controller:**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class ApiController extends Controller
{
    protected function successResponse($data, $message = null, $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function errorResponse($message, $code = 400, $errors = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    protected function paginatedResponse($resource, $message = null)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $resource->items(),
            'meta' => [
                'current_page' => $resource->currentPage(),
                'last_page' => $resource->lastPage(),
                'per_page' => $resource->perPage(),
                'total' => $resource->total(),
            ],
        ]);
    }
}
```

### 6. **Update Models for API**

Add to all models:

```php
// Add to User model
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    
    // Add API-friendly attributes
    protected $hidden = ['password', 'remember_token', 'two_factor_secret'];
    
    protected $appends = ['profile_image_url'];
    
    public function getProfileImageUrlAttribute()
    {
        return $this->profile_image 
            ? asset('storage/' . $this->profile_image)
            : null;
    }
}
```

### 7. **Create Service Layer (Business Logic)**

Move business logic from controllers to services:

**Example: `app/Services/AttendanceService.php`**

```php
<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Member;
use Carbon\Carbon;

class AttendanceService
{
    public function checkIn(int $memberId): array
    {
        $today = Carbon::today();
        $existing = Attendance::where('member_id', $memberId)
            ->whereDate('date', $today)
            ->first();

        if ($existing && !$existing->check_out_time) {
            return [
                'success' => false,
                'message' => 'Already checked in',
                'type' => 'error'
            ];
        }

        if ($existing && $existing->check_out_time) {
            return [
                'success' => false,
                'message' => 'Already checked out today',
                'type' => 'error'
            ];
        }

        $attendance = Attendance::create([
            'member_id' => $memberId,
            'date' => $today,
            'check_in_time' => Carbon::now()->format('H:i:s'),
        ]);

        return [
            'success' => true,
            'message' => 'Checked in successfully',
            'type' => 'checkin',
            'data' => $attendance
        ];
    }

    public function checkOut(int $memberId): array
    {
        $today = Carbon::today();
        $existing = Attendance::where('member_id', $memberId)
            ->whereDate('date', $today)
            ->whereNull('check_out_time')
            ->first();

        if (!$existing) {
            return [
                'success' => false,
                'message' => 'No active check-in found',
                'type' => 'error'
            ];
        }

        $existing->update(['check_out_time' => Carbon::now()->format('H:i:s')]);

        return [
            'success' => true,
            'message' => 'Checked out successfully',
            'type' => 'checkout',
            'data' => $existing
        ];
    }

    public function getMemberHistory(int $memberId, int $limit = 30)
    {
        return Attendance::where('member_id', $memberId)
            ->orderBy('date', 'desc')
            ->limit($limit)
            ->get();
    }
}
```

### 8. **Add API Middleware**

Create `app/Http/Middleware/ApiPermissionMiddleware.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiPermissionMiddleware
{
    public function handle(Request $request, Closure $next, string $permission)
    {
        if (!$request->user()->hasPermission($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }

        return $next($request);
    }
}
```

### 9. **Update CORS Configuration**

Update `config/cors.php`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // In production, specify your mobile app domains
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 10. **Add API Versioning**

Structure for future-proofing:

```
routes/
  api/
    v1/
      auth.php
      members.php
      attendance.php
    v2/
      ...
```

## 📱 React Native App Structure

### Recommended Folder Structure:

```
gympro-mobile/
├── src/
│   ├── api/
│   │   ├── client.ts          # Axios instance
│   │   ├── auth.ts            # Auth endpoints
│   │   ├── members.ts         # Member endpoints
│   │   ├── attendance.ts      # Attendance endpoints
│   │   └── plans.ts           # Plans endpoints
│   ├── components/
│   │   ├── common/
│   │   ├── attendance/
│   │   ├── members/
│   │   └── plans/
│   ├── screens/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Attendance/
│   │   ├── Plans/
│   │   └── Profile/
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MemberNavigator.tsx
│   ├── store/              # Redux/Zustand
│   │   ├── slices/
│   │   └── store.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAttendance.ts
│   │   └── usePermissions.ts
│   ├── utils/
│   │   ├── storage.ts      # AsyncStorage wrapper
│   │   ├── permissions.ts
│   │   └── formatters.ts
│   └── types/
│       ├── api.ts
│       ├── models.ts
│       └── navigation.ts
```

### Example API Client (`src/api/client.ts`):

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-domain.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 🔧 Additional Backend Improvements

### 1. **Add Request Validation Classes**

```php
php artisan make:request Api/LoginRequest
php artisan make:request Api/RegisterRequest
php artisan make:request Api/CheckInRequest
```

### 2. **Add Rate Limiting**

In `app/Providers/RouteServiceProvider.php`:

```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

### 3. **Add API Documentation**

Install Scribe:
```bash
composer require --dev knuckleswtf/scribe
php artisan vendor:publish --tag=scribe-config
php artisan scribe:generate
```

### 4. **Add Logging & Monitoring**

```php
// Add to controllers
use Illuminate\Support\Facades\Log;

Log::channel('api')->info('User checked in', [
    'user_id' => $user->id,
    'member_id' => $memberId,
]);
```

### 5. **Add Response Caching**

```php
use Illuminate\Support\Facades\Cache;

public function index()
{
    return Cache::remember('plans.all', 3600, function () {
        return Plan::where('status', 'active')->get();
    });
}
```

## 🚀 Migration Strategy

### Phase 1: Backend Preparation (Week 1-2)
1. Install Sanctum
2. Create API routes
3. Create API controllers
4. Add API resources
5. Test with Postman

### Phase 2: Service Layer (Week 2-3)
1. Extract business logic to services
2. Add comprehensive validation
3. Add error handling
4. Write unit tests

### Phase 3: Mobile App Development (Week 3-8)
1. Setup React Native project
2. Implement authentication
3. Build core features
4. Add offline support
5. Implement push notifications

### Phase 4: Testing & Deployment (Week 8-10)
1. Integration testing
2. Performance optimization
3. Security audit
4. Deploy to app stores

## 📋 Checklist

### Backend
- [ ] Install Laravel Sanctum
- [ ] Create API routes
- [ ] Create API controllers
- [ ] Add API resources
- [ ] Create service layer
- [ ] Add request validation
- [ ] Update CORS settings
- [ ] Add rate limiting
- [ ] Add API documentation
- [ ] Write API tests

### Mobile App
- [ ] Setup React Native project
- [ ] Configure API client
- [ ] Implement authentication
- [ ] Build navigation
- [ ] Create screens
- [ ] Add state management
- [ ] Implement offline mode
- [ ] Add push notifications
- [ ] Test on iOS/Android
- [ ] Submit to app stores

## 🔐 Security Considerations

1. **Token Management**: Use secure storage for tokens
2. **SSL/TLS**: Always use HTTPS
3. **Input Validation**: Validate all inputs on backend
4. **Rate Limiting**: Prevent abuse
5. **2FA Support**: Implement for sensitive operations
6. **Biometric Auth**: Add fingerprint/face ID
7. **Certificate Pinning**: Prevent MITM attacks

## 📚 Recommended Packages

### Backend
- `laravel/sanctum` - API authentication
- `spatie/laravel-query-builder` - Advanced filtering
- `knuckleswtf/scribe` - API documentation
- `spatie/laravel-backup` - Database backups

### Mobile
- `@react-navigation/native` - Navigation
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `react-native-qrcode-scanner` - QR scanning
- `react-native-push-notification` - Push notifications
- `@react-native-async-storage/async-storage` - Local storage

## 🎯 Key Benefits of This Approach

1. **Separation of Concerns**: Web and mobile use same backend
2. **Code Reusability**: Share business logic
3. **Scalability**: Easy to add new features
4. **Maintainability**: Clean architecture
5. **Testability**: Service layer is easily testable
6. **Future-Proof**: API versioning support

## 📞 Support

For questions or issues, refer to:
- Laravel Sanctum: https://laravel.com/docs/sanctum
- React Native: https://reactnative.dev/
- API Best Practices: https://restfulapi.net/

---

**Next Steps**: Start with Phase 1 and create a simple API endpoint to test the setup before proceeding with full implementation.
