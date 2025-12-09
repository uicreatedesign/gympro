<?php

namespace App\Http\Controllers;

use App\Models\Member;
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
            'members' => Member::with('user')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_members')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'phone' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            'join_date' => 'required|date',
            'status' => 'required|in:active,inactive,expired',
            'notes' => 'nullable|string',
            'create_login' => 'nullable|boolean',
            'password' => 'required_if:create_login,true|nullable|string|min:8',
        ]);

        $member = Member::create($validated);

        // Create user account if requested
        if ($request->create_login && $request->password) {
            $user = \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => \Hash::make($request->password),
                'status' => 'active',
            ]);

            $memberRole = \App\Models\Role::where('name', 'Member')->first();
            if ($memberRole) {
                $user->roles()->attach($memberRole->id);
            }

            $member->update(['user_id' => $user->id]);
        }

        return redirect()->back()->with('success', 'Member created successfully');
    }

    public function update(Request $request, Member $member)
    {
        if (!auth()->user()->hasPermission('edit_members')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email,' . $member->id,
            'phone' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date',
            'address' => 'nullable|string',
            'join_date' => 'required|date',
            'status' => 'required|in:active,inactive,expired',
            'notes' => 'nullable|string',
        ]);

        $member->update($validated);

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
