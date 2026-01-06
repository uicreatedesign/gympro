<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\PlanService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function __construct(
        private PlanService $planService
    ) {}

    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => (int) $request->input('per_page', 10),
        ];

        $result = $this->planService->getPlans($filters);

        return Inertia::render('Plans/Index', [
            'plans' => $result['plans'],
            'stats' => $result['stats'],
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->planService->getValidationRules());
        $this->planService->createPlan($validated);

        return redirect()->back()->with('success', 'Plan created successfully');
    }

    public function update(Request $request, Plan $plan)
    {
        if (!auth()->user()->hasPermission('edit_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->planService->getValidationRules());
        $this->planService->updatePlan($plan, $validated);

        return redirect()->back()->with('success', 'Plan updated successfully');
    }

    public function destroy(Plan $plan)
    {
        if (!auth()->user()->hasPermission('delete_plans')) {
            abort(403, 'Unauthorized action.');
        }

        if (!$this->planService->canDeletePlan($plan)) {
            return redirect()->back()->withErrors(['plan' => 'Cannot delete plan that has active subscriptions']);
        }

        $this->planService->deletePlan($plan);
        return redirect()->back()->with('success', 'Plan deleted successfully');
    }
}
