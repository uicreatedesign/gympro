<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Member;
use App\Models\Plan;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_members')) {
            abort(403, 'Unauthorized action.');
        }

        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Member::with(['user', 'subscriptions' => function($q) {
            $q->where('status', 'active')
              ->where('end_date', '>=', now())
              ->with('plan')
              ->latest();
        }]);

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $members = $query->latest()->paginate($perPage);

        $stats = [
            'total' => Member::count(),
            'active' => Member::where('status', 'active')->count(),
            'inactive' => Member::where('status', 'inactive')->count(),
        ];

        return Inertia::render('Members/Index', [
            'members' => $members,
            'stats' => $stats,
            'filters' => [
                'per_page' => (int) $perPage,
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_members')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            'join_date' => 'required|date',
            'status' => 'required|in:active,inactive,expired',
            'notes' => 'nullable|string',
            'password' => 'required|string|min:8',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => \Hash::make($validated['password']),
            'status' => 'active',
        ]);

        $memberRole = \App\Models\Role::where('name', 'Member')->first();
        if ($memberRole) {
            $user->roles()->attach($memberRole->id);
        }

        $member = Member::create([
            'user_id' => $user->id,
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'],
            'address' => $validated['address'],
            'join_date' => $validated['join_date'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        // Create notification
        NotificationService::create([
            'type' => 'member_registered',
            'title' => 'New Member Registered',
            'message' => "New member {$validated['name']} has been registered",
            'data' => ['member_id' => $member->id],
            'priority' => 'normal',
            'color' => '#10b981',
        ]);

        return redirect()->back()->with('success', 'Member created successfully');
    }

    public function update(Request $request, Member $member)
    {
        if (!auth()->user()->hasPermission('edit_members')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $member->user_id,
            'phone' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            'join_date' => 'required|date',
            'status' => 'required|in:active,inactive,expired',
            'notes' => 'nullable|string',
        ]);

        $member->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        $member->update([
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'],
            'address' => $validated['address'],
            'join_date' => $validated['join_date'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        return redirect()->back()->with('success', 'Member updated successfully');
    }

    public function destroy(Member $member)
    {
        if (!auth()->user()->hasPermission('delete_members')) {
            abort(403, 'Unauthorized action.');
        }

        $member->delete();
        return redirect()->back()->with('success', 'Member deleted successfully');
    }
}
