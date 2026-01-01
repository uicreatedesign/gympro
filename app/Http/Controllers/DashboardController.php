<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Subscription;
use App\Models\Payment;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Redirect members to their dashboard
        if (auth()->user()->isMember() && !auth()->user()->isAdmin()) {
            return redirect()->route('member.dashboard');
        }
        
        $stats = [
            'total_members' => Member::count(),
            'active_members' => Member::where('status', 'active')->count(),
            'total_subscriptions' => Subscription::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'revenue_this_month' => Payment::where('status', 'completed')
                ->whereMonth('payment_date', Carbon::now()->month)
                ->whereYear('payment_date', Carbon::now()->year)
                ->sum('amount'),
        ];

        $expiring_soon = Subscription::with(['member', 'plan', 'payments'])
            ->where('status', 'active')
            ->whereBetween('end_date', [Carbon::now(), Carbon::now()->addDays(7)])
            ->orderBy('end_date')
            ->limit(5)
            ->get();

        $recent_subscriptions = Subscription::with(['member', 'plan', 'payments'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'expiring_soon' => $expiring_soon,
            'recent_subscriptions' => $recent_subscriptions,
        ]);
    }
}
