<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('view_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => Subscription::with(['member', 'plan'])->latest()->get(),
            'members' => Member::where('status', 'active')->get(),
            'plans' => Plan::where('status', 'active')->get(),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'amount_paid' => 'required|numeric|min:0',
            'admission_fee_paid' => 'nullable|numeric|min:0',
            'payment_status' => 'required|in:pending,paid,overdue',
            'status' => 'required|in:active,expired,cancelled',
            'notes' => 'nullable|string',
        ]);

        $plan = Plan::find($validated['plan_id']);
        $startDate = Carbon::parse($validated['start_date']);
        $validated['end_date'] = $startDate->copy()->addMonths($plan->duration_months);

        Subscription::create($validated);

        return redirect()->back()->with('success', 'Subscription created successfully');
    }

    public function update(Request $request, Subscription $subscription)
    {
        if (!auth()->user()->hasPermission('edit_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'amount_paid' => 'required|numeric|min:0',
            'admission_fee_paid' => 'nullable|numeric|min:0',
            'payment_status' => 'required|in:pending,paid,overdue',
            'status' => 'required|in:active,expired,cancelled',
            'notes' => 'nullable|string',
        ]);

        $plan = Plan::find($validated['plan_id']);
        $startDate = Carbon::parse($validated['start_date']);
        $validated['end_date'] = $startDate->copy()->addMonths($plan->duration_months);

        $subscription->update($validated);

        return redirect()->back()->with('success', 'Subscription updated successfully');
    }

    public function destroy(Subscription $subscription)
    {
        if (!auth()->user()->hasPermission('delete_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        $subscription->delete();
        return redirect()->back()->with('success', 'Subscription deleted successfully');
    }
}
