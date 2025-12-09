<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('view_plans')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Plans/Index', [
            'plans' => Plan::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'admission_fee' => 'nullable|numeric|min:0',
            'shift' => 'required|in:morning,evening,full_day',
            'shift_time' => 'nullable|string',
            'personal_training' => 'boolean',
            'group_classes' => 'boolean',
            'locker_facility' => 'boolean',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        Plan::create($validated);

        return redirect()->back()->with('success', 'Plan created successfully');
    }

    public function update(Request $request, Plan $plan)
    {
        if (!auth()->user()->hasPermission('edit_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'admission_fee' => 'nullable|numeric|min:0',
            'shift' => 'required|in:morning,evening,full_day',
            'shift_time' => 'nullable|string',
            'personal_training' => 'boolean',
            'group_classes' => 'boolean',
            'locker_facility' => 'boolean',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $plan->update($validated);

        return redirect()->back()->with('success', 'Plan updated successfully');
    }

    public function destroy(Plan $plan)
    {
        if (!auth()->user()->hasPermission('delete_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $plan->delete();
        return redirect()->back()->with('success', 'Plan deleted successfully');
    }
}
