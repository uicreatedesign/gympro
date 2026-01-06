<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use App\Services\TrainerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainerController extends Controller
{
    public function __construct(
        private TrainerService $trainerService
    ) {}

    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ]);

        $filters = [
            'search' => $validated['search'] ?? null,
            'status' => $validated['status'] ?? null,
            'per_page' => $validated['per_page'] ?? 10,
        ];

        $trainers = $this->trainerService->getTrainers($filters);

        return Inertia::render('Trainers/Index', [
            'trainers' => $trainers,
            'stats' => [
                'total' => \App\Models\Trainer::count(),
                'active' => \App\Models\Trainer::where('status', 'active')->count(),
                'inactive' => \App\Models\Trainer::where('status', 'inactive')->count(),
            ],
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->trainerService->getValidationRules());
        $this->trainerService->createTrainer($validated);

        return redirect()->back()->with('success', 'Trainer created successfully');
    }

    public function update(Request $request, Trainer $trainer)
    {
        if (!auth()->user()->hasPermission('edit_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate($this->trainerService->getUpdateValidationRules($trainer));
        $this->trainerService->updateTrainer($trainer, $validated);

        return redirect()->back()->with('success', 'Trainer updated successfully');
    }

    public function destroy(Trainer $trainer)
    {
        if (!auth()->user()->hasPermission('delete_trainers')) {
            abort(403, 'Unauthorized action.');
        }

        $this->trainerService->deleteTrainer($trainer);
        return redirect()->back()->with('success', 'Trainer deleted successfully');
    }
}
