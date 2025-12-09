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
            'members' => Member::latest()->get(),
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
        ]);

        Member::create($validated);

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
