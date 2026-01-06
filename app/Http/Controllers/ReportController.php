<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_reports')) {
            abort(403, 'Unauthorized action.');
        }

        $filters = [
            'start_date' => $request->input('start_date', Carbon::now()->startOfMonth()->toDateString()),
            'end_date' => $request->input('end_date', Carbon::now()->toDateString()),
        ];

        $reports = $this->reportService->generateReports($filters);

        return Inertia::render('reports/Index', array_merge($reports, [
            'startDate' => $filters['start_date'],
            'endDate' => $filters['end_date'],
        ]));
    }

    public function export(Request $request)
    {
        $type = $request->input('type', 'revenue');
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        return $this->reportService->exportReports($type, $startDate, $endDate);
    }
}
