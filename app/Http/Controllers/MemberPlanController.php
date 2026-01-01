<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Member;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberPlanController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('view_member_dashboard')) {
            abort(403, 'Unauthorized. Member access only.');
        }

        $member = Member::where('user_id', auth()->id())->first();
        
        if (!$member) {
            abort(404, 'Member profile not found. Please contact admin.');
        }
        
        $plans = Plan::where('status', 'active')->get();
        
        $activeSubscription = Subscription::where('member_id', $member->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->with('plan')
            ->first();
        
        return Inertia::render('member/Plans', [
            'plans' => $plans,
            'activeSubscription' => $activeSubscription,
            'member' => $member,
            'phonepeEnabled' => \App\Models\Setting::get('phonepe_enabled', '0') === '1',
        ]);
    }
}
