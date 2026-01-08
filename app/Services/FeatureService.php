<?php

namespace App\Services;

use App\Models\Feature;
use Illuminate\Database\Eloquent\Collection;

class FeatureService
{
    /**
     * Get all active features
     */
    public function getActiveFeatures(): Collection
    {
        return Feature::where('status', 'active')->get();
    }

    /**
     * Get all features
     */
    public function getAllFeatures(): Collection
    {
        return Feature::all();
    }

    /**
     * Create a new feature
     */
    public function createFeature(array $data): Feature
    {
        $data['slug'] = $this->generateSlug($data['name']);
        return Feature::create($data);
    }

    /**
     * Update feature
     */
    public function updateFeature(Feature $feature, array $data): Feature
    {
        if (isset($data['name']) && $data['name'] !== $feature->name) {
            $data['slug'] = $this->generateSlug($data['name']);
        }
        $feature->update($data);
        return $feature;
    }

    /**
     * Delete feature
     */
    public function deleteFeature(Feature $feature): bool
    {
        return $feature->delete();
    }

    /**
     * Generate slug from name
     */
    private function generateSlug(string $name): string
    {
        return strtolower(str_replace(' ', '_', trim($name)));
    }

    /**
     * Get features for a plan
     */
    public function getPlanFeatures(int $planId): Collection
    {
        return Feature::whereHas('plans', function ($query) use ($planId) {
            $query->where('plan_id', $planId);
        })->get();
    }

    /**
     * Attach features to plan
     */
    public function attachFeaturesToPlan(int $planId, array $featureIds): void
    {
        $plan = \App\Models\Plan::findOrFail($planId);
        $plan->features()->sync($featureIds);
    }
}
