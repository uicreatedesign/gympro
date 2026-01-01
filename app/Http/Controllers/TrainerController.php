<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TrainerController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? null;
        $status = $validated['status'] ?? null;

        $query = Trainer::with('user');

        if ($search) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('specialization', 'like', "%{$search}%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        $trainers = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('trainers/Index', [
            'trainers' => $trainers,
            'stats' => [
                'total' => Trainer::count(),
                'active' => Trainer::where('status', 'active')->count(),
                'inactive' => Trainer::where('status', 'inactive')->count(),
            ],
            'filters' => [
                'per_page' => $perPage,
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:20',
            'specialization' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'salary' => 'required|numeric|min:0',
            'joining_date' => 'required|date',
            'bio' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => $validated['status'],
        ]);

        $trainerRole = \App\Models\Role::where('name', 'Trainer')->first();
        if ($trainerRole) {
            $user->roles()->attach($trainerRole->id);
        }

        Trainer::create([
            'user_id' => $user->id,
            'specialization' => $validated['specialization'],
            'experience_years' => $validated['experience_years'],
            'salary' => $validated['salary'],
            'joining_date' => $validated['joining_date'],
            'bio' => $validated['bio'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Trainer created successfully');
    }

    public function update(Request $request, Trainer $trainer)
    {
        if (!auth()->user()->hasPermission('edit_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $trainer->user_id,
            'password' => 'nullable|string|min:8',
            'specialization' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'salary' => 'required|numeric|min:0',
            'joining_date' => 'required|date',
            'bio' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $trainer->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ]);

        if (!empty($validated['password'])) {
            $trainer->user->update(['password' => Hash::make($validated['password'])]);
        }

        $trainer->update([
            'specialization' => $validated['specialization'],
            'experience_years' => $validated['experience_years'],
            'salary' => $validated['salary'],
            'joining_date' => $validated['joining_date'],
            'bio' => $validated['bio'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Trainer updated successfully');
    }

    public function destroy(Trainer $trainer)
    {
        if (!auth()->user()->hasPermission('delete_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $trainer->user->delete();
        return redirect()->back()->with('success', 'Trainer deleted successfully');
    }
}
