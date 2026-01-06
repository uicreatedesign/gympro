<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Member;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function __construct(
        private AttendanceService $attendanceService
    ) {}

    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'date' => 'nullable|date',
            'month' => 'nullable|date_format:Y-m',
        ]);

        $filters = [
            'date' => $validated['date'] ?? null,
            'month' => $validated['month'] ?? null,
        ];

        $result = $this->attendanceService->getAttendance($filters);

        return Inertia::render('Attendances/Index', $result);
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

        $result = $this->attendanceService->handleQrCheckIn($validated['member_id'], auth()->id());
        return response()->json($result);
    }

    public function reports(Request $request)
    {
        $validated = $request->validate([
            'type' => 'nullable|in:daily,weekly,monthly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $filters = [
            'type' => $validated['type'] ?? 'daily',
            'start_date' => $validated['start_date'] ?? \Carbon\Carbon::today()->toDateString(),
            'end_date' => $validated['end_date'] ?? \Carbon\Carbon::today()->toDateString(),
        ];

        $result = $this->attendanceService->getAttendanceReports($filters);

        return Inertia::render('Attendances/Reports', array_merge($result, [
            'filters' => $filters,
        ]));
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->attendanceService->getValidationRules());

        try {
            $this->attendanceService->recordAttendance($validated);
            return redirect()->back()->with('success', 'Check-in recorded successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['member_id' => $e->getMessage()]);
        }
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

        $this->attendanceService->updateAttendance($attendance, $validated);

        return redirect()->back()->with('success', 'Attendance updated successfully');
    }

    public function destroy(Attendance $attendance)
    {
        if (!auth()->user()->hasPermission('delete_attendances')) {
            abort(403, 'Unauthorized action.');
        }

        $this->attendanceService->deleteAttendance($attendance);
        return redirect()->back()->with('success', 'Attendance deleted successfully');
    }
}
