<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        if (!auth()->user()->hasPermission('view_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $today = Carbon::today();
        
        return Inertia::render('Attendances/Index', [
            'attendances' => Attendance::with('member')
                ->whereDate('date', $today)
                ->latest('check_in_time')
                ->get(),
            'members' => Member::where('status', 'active')->get(),
            'stats' => [
                'today_count' => Attendance::whereDate('date', $today)->count(),
                'checked_in' => Attendance::whereDate('date', $today)->whereNull('check_out_time')->count(),
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
