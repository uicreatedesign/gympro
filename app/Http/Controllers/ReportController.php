<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Attendance;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_reports')) {
            abort(403, 'Unauthorized action.');
        }

        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        // Revenue Analytics
        $revenueData = Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw('DATE(payment_date) as date, SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Member Growth
        $memberGrowth = Member::whereBetween('join_date', [$startDate, $endDate])
            ->selectRaw('DATE(join_date) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Payment Methods Breakdown
        $paymentMethods = Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('payment_method')
            ->get();

        // Popular Plans
        $popularPlans = Subscription::with('plan')
            ->whereBetween('start_date', [$startDate, $endDate])
            ->selectRaw('plan_id, COUNT(*) as count')
            ->groupBy('plan_id')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($sub) {
                return [
                    'name' => $sub->plan->name,
                    'count' => $sub->count,
                ];
            });

        // Attendance Trends
        $attendanceTrends = Attendance::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as date, COUNT(DISTINCT member_id) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Summary Stats
        $stats = [
            'total_revenue' => Payment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->sum('amount'),
            'new_members' => Member::whereBetween('join_date', [$startDate, $endDate])->count(),
            'active_subscriptions' => Subscription::where('status', 'active')
                ->whereBetween('start_date', [$startDate, $endDate])
                ->count(),
            'total_attendance' => Attendance::whereBetween('date', [$startDate, $endDate])->count(),
            'avg_daily_attendance' => Attendance::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('DATE(date) as date, COUNT(*) as count')
                ->groupBy('date')
                ->get()
                ->avg('count'),
        ];

        return Inertia::render('reports/Index', [
            'revenueData' => $revenueData,
            'memberGrowth' => $memberGrowth,
            'paymentMethods' => $paymentMethods,
            'popularPlans' => $popularPlans,
            'attendanceTrends' => $attendanceTrends,
            'stats' => $stats,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
