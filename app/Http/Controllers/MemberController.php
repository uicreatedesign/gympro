<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Services\MemberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function __construct(
        private MemberService $memberService
    ) {}

    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_members')) {
            abort(403, 'Unauthorized action.');
        }

        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => (int) $request->input('per_page', 10),
        ];

        $result = $this->memberService->getMembers($filters);

        return Inertia::render('Members/Index', [
            'members' => $result['members'],
            'stats' => $result['stats'],
            'filters' => $filters,
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

        $this->memberService->createMember($validated);

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

        $this->memberService->updateMember($member, $validated);

        return redirect()->back()->with('success', 'Member updated successfully');
    }

    public function destroy(Member $member)
    {
        if (!auth()->user()->hasPermission('delete_members')) {
            abort(403, 'Unauthorized action.');
        }

        $this->memberService->deleteMember($member);
        return redirect()->back()->with('success', 'Member deleted successfully');
    }
}
