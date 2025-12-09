<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MemberDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            abort(404, 'Member profile not found');
        }

        // Current Subscription
        $currentSubscription = Subscription::with('plan')
            ->where('member_id', $member->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        // Attendance Stats
        $attendanceThisMonth = Attendance::where('member_id', $member->id)
            ->whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->count();

        $lastCheckIn = Attendance::where('member_id', $member->id)
            ->latest('date')
            ->first();

        // Recent Payments
        $recentPayments = Payment::where('member_id', $member->id)
            ->latest('payment_date')
            ->limit(5)
            ->get();

        // Calculate days remaining
        $daysRemaining = null;
        $subscriptionStatus = 'none';
        if ($currentSubscription) {
            $endDate = Carbon::parse($currentSubscription->end_date);
            $daysRemaining = $endDate->diffInDays(Carbon::now(), false);
            
            if ($daysRemaining < 0) {
                $subscriptionStatus = 'expired';
            } elseif ($daysRemaining <= 7) {
                $subscriptionStatus = 'expiring';
            } else {
                $subscriptionStatus = 'active';
            }
        }

        return Inertia::render('member/Dashboard', [
            'member' => $member,
            'currentSubscription' => $currentSubscription,
            'daysRemaining' => abs($daysRemaining),
            'subscriptionStatus' => $subscriptionStatus,
            'attendanceThisMonth' => $attendanceThisMonth,
            'lastCheckIn' => $lastCheckIn,
            'recentPayments' => $recentPayments,
        ]);
    }
}
