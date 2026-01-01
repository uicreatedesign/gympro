<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'date' => 'nullable|date',
            'month' => 'nullable|date_format:Y-m',
        ]);

        $date = $validated['date'] ?? null;
        $month = $validated['month'] ?? null;
        
        if ($month) {
            $year = Carbon::parse($month)->year;
            $monthNum = Carbon::parse($month)->month;
            $daysInMonth = Carbon::parse($month)->daysInMonth;
            
            $attendances = Attendance::with('member.user')
                ->whereYear('date', $year)
                ->whereMonth('date', $monthNum)
                ->get()
                ->groupBy('member_id');
            
            $members = Member::with('user')->where('status', 'active')->get();
            
            $monthlyData = $members->map(function ($member) use ($attendances, $year, $monthNum, $daysInMonth) {
                $memberAttendances = $attendances->get($member->id, collect());
                $dates = [];
                
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    $dateString = Carbon::create($year, $monthNum, $day)->toDateString();
                    $isPresent = $memberAttendances->contains(function ($attendance) use ($dateString) {
                        return Carbon::parse($attendance->date)->toDateString() === $dateString;
                    });
                    $dates[$day] = $isPresent ? 'present' : 'absent';
                }
                
                return [
                    'member' => $member,
                    'dates' => $dates,
                    'total_present' => collect($dates)->filter(fn($v) => $v === 'present')->count(),
                ];
            });
            
            return Inertia::render('Attendances/Index', [
                'attendances' => [],
                'monthlyData' => $monthlyData,
                'daysInMonth' => $daysInMonth,
                'members' => fn() => Member::with('user')->where('status', 'active')->get(),
                'stats' => [
                    'today_count' => Attendance::whereDate('date', Carbon::today())->count(),
                    'checked_in' => Attendance::whereDate('date', Carbon::today())->whereNull('check_out_time')->count(),
                ],
                'selectedDate' => null,
                'selectedMonth' => $month,
            ]);
        }
        
        $date = $date ?? Carbon::today()->toDateString();
        $attendances = Attendance::with('member.user')
            ->whereDate('date', $date)
            ->latest('check_in_time')
            ->get();
        
        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
            'monthlyData' => null,
            'daysInMonth' => null,
            'members' => fn() => Member::with('user')->where('status', 'active')->get(),
            'stats' => [
                'today_count' => Attendance::whereDate('date', Carbon::today())->count(),
                'checked_in' => Attendance::whereDate('date', Carbon::today())->whereNull('check_out_time')->count(),
            ],
            'selectedDate' => $date,
            'selectedMonth' => null,
        ]);
    }

    public function qrCheckIn(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
        ]);

        // Check if user is member and can only check-in themselves
        if (auth()->user()->hasPermission('view_member_dashboard')) {
            $member = Member::where('user_id', auth()->id())->first();
            if (!$member || $member->id != $validated['member_id']) {
                return response()->json(['message' => 'Unauthorized. You can only check-in yourself.', 'type' => 'error'], 403);
            }
        }

        $today = Carbon::today();
        $existing = Attendance::where('member_id', $validated['member_id'])
            ->whereDate('date', $today)
            ->first();

        if ($existing && !$existing->check_out_time) {
            $existing->update(['check_out_time' => Carbon::now()->format('H:i:s')]);
            return response()->json(['message' => 'Checked out successfully', 'type' => 'checkout']);
        }

        if ($existing && $existing->check_out_time) {
            return response()->json(['message' => 'Already checked out today', 'type' => 'error'], 400);
        }

        Attendance::create([
            'member_id' => $validated['member_id'],
            'date' => $today,
            'check_in_time' => Carbon::now()->format('H:i:s'),
        ]);

        return response()->json(['message' => 'Checked in successfully', 'type' => 'checkin']);
    }

    public function reports(Request $request)
    {
        $validated = $request->validate([
            'type' => 'nullable|in:daily,weekly,monthly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $type = $validated['type'] ?? 'daily';
        $startDate = $validated['start_date'] ?? Carbon::today()->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::today()->toDateString();

        $attendances = Attendance::with('member')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $peakHours = Attendance::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('HOUR(check_in_time) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->get();

        return Inertia::render('Attendances/Reports', [
            'attendances' => $attendances,
            'peakHours' => $peakHours,
            'stats' => [
                'total' => $attendances->count(),
                'unique_members' => $attendances->unique('member_id')->count(),
                'avg_per_day' => $attendances->count() / max(1, Carbon::parse($startDate)->diffInDays($endDate) + 1),
            ],
            'filters' => [
                'type' => $type,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'date' => 'required|date',
            'check_in_time' => 'required',
            'notes' => 'nullable|string',
        ]);

        // Check if attendance already exists for this member on this date
        $existing = Attendance::where('member_id', $validated['member_id'])
            ->whereDate('date', $validated['date'])
            ->first();

        if ($existing) {
            return redirect()->back()->withErrors(['member_id' => 'Attendance already recorded for this member on this date']);
        }

        $validated['check_in_time'] = Carbon::parse($validated['check_in_time'])->format('H:i:s');

        Attendance::create($validated);

        return redirect()->back()->with('success', 'Check-in recorded successfully');
    }

    public function update(Request $request, Attendance $attendance)
    {
        if (!auth()->user()->hasPermission('edit_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'member_id' => 'sometimes|exists:members,id',
            'date' => 'sometimes|date',
            'check_in_time' => 'sometimes|required',
            'check_out_time' => 'nullable',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['check_in_time'])) {
            $validated['check_in_time'] = Carbon::parse($validated['check_in_time'])->format('H:i:s');
        }

        if (isset($validated['check_out_time']) && $validated['check_out_time']) {
            $validated['check_out_time'] = Carbon::parse($validated['check_out_time'])->format('H:i:s');
        }

        $attendance->update($validated);

        return redirect()->back()->with('success', 'Attendance updated successfully');
    }

    public function destroy(Attendance $attendance)
    {
        if (!auth()->user()->hasPermission('delete_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $attendance->delete();
        return redirect()->back()->with('success', 'Attendance deleted successfully');
    }
}
