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
        ]);

        $date = $validated['date'] ?? Carbon::today()->toDateString();
        
        return Inertia::render('Attendances/Index', [
            'attendances' => Attendance::with('member')
                ->whereDate('date', $date)
                ->latest('check_in_time')
                ->get(),
            'members' => fn() => Member::where('status', 'active')->get(),
            'stats' => [
                'today_count' => Attendance::whereDate('date', $date)->count(),
                'checked_in' => Attendance::whereDate('date', $date)->whereNull('check_out_time')->count(),
            ],
            'selectedDate' => $date,
        ]);
    }

    public function qrCheckIn(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
        ]);

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
