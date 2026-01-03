<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Attendance;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

        // Revenue trend for last 6 months
        $revenue_trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $revenue_trend[] = [
                'month' => $date->format('M Y'),
                'revenue' => Payment::where('status', 'completed')
                    ->whereMonth('payment_date', $date->month)
                    ->whereYear('payment_date', $date->year)
                    ->sum('amount'),
            ];
        }

        // Attendance trend for last 7 days
        $attendance_trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $attendance_trend[] = [
                'date' => $date->format('M d'),
                'count' => Attendance::whereDate('date', $date->toDateString())->count(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'expiring_soon' => $expiring_soon,
            'recent_subscriptions' => $recent_subscriptions,
            'revenue_trend' => $revenue_trend,
            'attendance_trend' => $attendance_trend,
        ]);
    }
}
