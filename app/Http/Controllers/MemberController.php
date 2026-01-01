<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Member;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('view_members')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Members/Index', [
            'members' => Member::with(['user', 'subscriptions' => function($q) {
                $q->where('status', 'active')
                  ->where('end_date', '>=', now())
                  ->with('plan')
                  ->latest();
            }])->latest()->paginate(10),
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
