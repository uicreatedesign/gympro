<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Member;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $search = $validated['search'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $query = Subscription::with(['member', 'plan', 'payments'])
            ->when($search, function ($q) use ($search) {
                $sanitized = htmlspecialchars($search, ENT_QUOTES, 'UTF-8');
                $q->whereHas('member', function ($query) use ($sanitized) {
                    $query->where('name', 'like', "%{$sanitized}%")
                          ->orWhere('email', 'like', "%{$sanitized}%");
                })->orWhereHas('plan', function ($query) use ($sanitized) {
                    $query->where('name', 'like', "%{$sanitized}%");
                });
            })
            ->latest();

        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => $query->paginate($perPage)->withQueryString(),
            'members' => fn() => Member::where('status', 'active')->get(),
            'plans' => fn() => Plan::where('status', 'active')->get(),
            'filters' => ['search' => $search, 'per_page' => $perPage],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $this->validateSubscription($request);
        $subscription = Subscription::create($validated);

        // Auto-create payment if payment details provided
        if ($request->filled('payment_amount')) {
            $subscription->payments()->create([
                'amount' => $request->payment_amount,
                'payment_method' => $request->payment_method ?? 'cash',
                'payment_source' => 'manual',
                'payment_type' => $request->payment_type ?? 'plan',
                'payment_date' => $request->payment_date ?? now(),
                'status' => 'completed',
            ]);
        }

        return redirect()->back()->with('success', 'Subscription created successfully');
    }

    public function update(Request $request, Subscription $subscription)
    {
        if (!auth()->user()->hasPermission('edit_subscriptions')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $this->validateSubscription($request);
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

    private function validateSubscription(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'status' => 'required|in:pending,active,expired,cancelled',
            'notes' => 'nullable|string',
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);
        $startDate = Carbon::parse($validated['start_date']);
        $validated['end_date'] = $startDate->copy()->addMonths($plan->duration_months);

        return $validated;
    }
}
