<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'role' => 'nullable|exists:roles,id',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $search = $validated['search'] ?? null;
        $roleFilter = $validated['role'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $query = User::with('roles')
            ->when($search, function ($q) use ($search) {
                $sanitized = htmlspecialchars($search, ENT_QUOTES, 'UTF-8');
                $q->where('name', 'like', "%{$sanitized}%")
                  ->orWhere('email', 'like', "%{$sanitized}%");
            })
            ->when($roleFilter, function ($q) use ($roleFilter) {
                $q->whereHas('roles', function ($query) use ($roleFilter) {
                    $query->where('roles.id', $roleFilter);
                });
            })
            ->latest();

        return Inertia::render('users/Index', [
            'users' => $query->paginate($perPage)->withQueryString(),
            'roles' => fn() => Role::all(),
            'stats' => [
                'total' => User::count(),
                'active' => User::where('status', 'active')->count(),
                'inactive' => User::where('status', 'inactive')->count(),
            ],
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'profile_image' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
            'roles' => 'array',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('profile_image')) {
            $validated['profile_image'] = $request->file('profile_image')->store('profiles', 'public');
        }

        $user = User::create($validated);
        
        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        if (!auth()->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'profile_image' => 'nullable|image|max:2048',
            'status' => 'required|in:active,inactive',
            'roles' => 'array',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $validated['profile_image'] = $request->file('profile_image')->store('profiles', 'public');
        }

        $user->update($validated);
        
        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        if (!auth()->user()->hasPermission('delete_users')) {
            abort(403, 'Unauthorized action.');
        }

        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully');
    }
}
