<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_members' => Member::count(),
            'active_members' => Member::where('status', 'active')->count(),
            'total_subscriptions' => Subscription::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'revenue_this_month' => Subscription::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum(DB::raw('amount_paid + admission_fee_paid')),
        ];

        $expiring_soon = Subscription::with(['member', 'plan'])
            ->where('status', 'active')
            ->whereBetween('end_date', [Carbon::now(), Carbon::now()->addDays(7)])
            ->orderBy('end_date')
            ->limit(5)
            ->get();

        $recent_subscriptions = Subscription::with(['member', 'plan'])
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
