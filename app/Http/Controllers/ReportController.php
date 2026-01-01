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

        // Revenue Report
        $revenueStats = [
            'total' => Payment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->sum('amount'),
            'by_method' => Payment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('payment_method')
                ->get(),
            'by_type' => Payment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->selectRaw('payment_type, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('payment_type')
                ->get(),
            'daily' => Payment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->selectRaw('DATE(payment_date) as date, SUM(amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ];

        // Attendance Report
        $attendanceStats = [
            'total' => Attendance::whereBetween('date', [$startDate, $endDate])->count(),
            'unique_members' => Attendance::whereBetween('date', [$startDate, $endDate])
                ->distinct('member_id')
                ->count('member_id'),
            'avg_daily' => round(Attendance::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('DATE(date) as date, COUNT(*) as count')
                ->groupBy('date')
                ->get()
                ->avg('count'), 2),
            'daily' => Attendance::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('DATE(date) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ];

        // Members Report
        $memberStats = [
            'total' => Member::count(),
            'active' => Member::where('status', 'active')->count(),
            'inactive' => Member::where('status', 'inactive')->count(),
            'expired' => Member::where('status', 'expired')->count(),
            'new' => Member::whereBetween('join_date', [$startDate, $endDate])->count(),
            'by_gender' => Member::selectRaw('gender, COUNT(*) as count')
                ->groupBy('gender')
                ->get(),
        ];

        // Subscriptions Report
        $subscriptionStats = [
            'total' => Subscription::count(),
            'active' => Subscription::where('status', 'active')->count(),
            'expired' => Subscription::where('status', 'expired')->count(),
            'cancelled' => Subscription::where('status', 'cancelled')->count(),
            'pending' => Subscription::where('status', 'pending')->count(),
            'expiring_soon' => Subscription::where('status', 'active')
                ->whereBetween('end_date', [Carbon::now(), Carbon::now()->addDays(7)])
                ->count(),
            'by_plan' => Subscription::with('plan')
                ->selectRaw('plan_id, COUNT(*) as count')
                ->groupBy('plan_id')
                ->get()
                ->map(fn($s) => ['name' => $s->plan->name, 'count' => $s->count]),
        ];

        // Plans Report
        $planStats = [
            'total' => Plan::count(),
            'active' => Plan::where('status', 'active')->count(),
            'popular' => Subscription::with('plan')
                ->whereBetween('start_date', [$startDate, $endDate])
                ->selectRaw('plan_id, COUNT(*) as count')
                ->groupBy('plan_id')
                ->orderByDesc('count')
                ->limit(5)
                ->get()
                ->map(fn($s) => ['name' => $s->plan->name, 'count' => $s->count]),
        ];

        return Inertia::render('reports/Index', [
            'revenueStats' => $revenueStats,
            'attendanceStats' => $attendanceStats,
            'memberStats' => $memberStats,
            'subscriptionStats' => $subscriptionStats,
            'planStats' => $planStats,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->input('type', 'revenue');
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        return \Excel::download(new \App\Exports\ReportsExport($type, $startDate, $endDate), "report-{$type}-{$startDate}-to-{$endDate}.xlsx");
    }
}
