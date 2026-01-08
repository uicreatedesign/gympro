<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeatureController extends Controller
{
    public function __construct(
        private FeatureService $featureService
    ) {}

    /**
     * Display features list
     */
    public function index()
    {
        if (!auth()->user()->hasPermission('view_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $features = $this->featureService->getAllFeatures();
        return Inertia::render('Features/Index', [
            'features' => $features,
        ]);
    }

    /**
     * Store a new feature
     */
    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:features',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $this->featureService->createFeature($validated);
        return redirect()->back()->with('success', 'Feature created successfully');
    }

    /**
     * Update feature
     */
    public function update(Request $request, Feature $feature)
    {
        if (!auth()->user()->hasPermission('edit_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:features,name,' . $feature->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $this->featureService->updateFeature($feature, $validated);
        return redirect()->back()->with('success', 'Feature updated successfully');
    }

    /**
     * Delete feature
     */
    public function destroy(Feature $feature)
    {
        if (!auth()->user()->hasPermission('delete_plans')) {
            abort(403, 'Unauthorized action.');
        }

        $this->featureService->deleteFeature($feature);
        return redirect()->back()->with('success', 'Feature deleted successfully');
    }
}
