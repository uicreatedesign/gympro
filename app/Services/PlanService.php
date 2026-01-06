<?php

namespace App\Services;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PlanService
{
    /**
     * Get paginated plans with filtering
     */
    public function getPlans(array $filters = []): array
    {
        $query = Plan::query();

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = $filters['per_page'] ?? 10;
        $plans = $query->latest()->paginate($perPage);

        $stats = [
            'total' => Plan::count(),
            'active' => Plan::where('status', 'active')->count(),
            'inactive' => Plan::where('status', 'inactive')->count(),
        ];

        return [
            'plans' => $plans,
            'stats' => $stats,
        ];
    }

    /**
     * Create a new plan
     */
    public function createPlan(array $data): Plan
    {
        return Plan::create($data);
    }

    /**
     * Update plan
     */
    public function updatePlan(Plan $plan, array $data): Plan
    {
        $plan->update($data);
        return $plan->fresh();
    }

    /**
     * Delete plan
     */
    public function deletePlan(Plan $plan): bool
    {
        // Check if plan is being used by active subscriptions
        $activeSubscriptions = $plan->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->count();

        if ($activeSubscriptions > 0) {
            throw new \Exception('Cannot delete plan that has active subscriptions');
        }

        return $plan->delete();
    }

    /**
     * Get plan by ID
     */
    public function getPlanById(int $id): Plan
    {
        return Plan::findOrFail($id);
    }

    /**
     * Get active plans for dropdowns
     */
    public function getActivePlans(): Collection
    {
        return Plan::where('status', 'active')
            ->orderBy('name')
            ->get();
    }

    /**
     * Get popular plans based on subscriptions
     */
    public function getPopularPlans(int $limit = 5, string $startDate = null, string $endDate = null): Collection
    {
        $query = Plan::withCount(['subscriptions' => function ($query) use ($startDate, $endDate) {
            if ($startDate && $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate]);
            }
        }])
        ->orderBy('subscriptions_count', 'desc')
        ->limit($limit);

        return $query->get();
    }

    /**
     * Get plan statistics
     */
    public function getPlanStatistics(): array
    {
        return [
            'total_plans' => Plan::count(),
            'active_plans' => Plan::where('status', 'active')->count(),
            'plans_by_shift' => Plan::selectRaw('shift, COUNT(*) as count')
                ->groupBy('shift')
                ->get(),
            'average_price' => Plan::where('status', 'active')->avg('price'),
            'features_usage' => [
                'personal_training' => Plan::where('personal_training', true)->count(),
                'group_classes' => Plan::where('group_classes', true)->count(),
                'locker_facility' => Plan::where('locker_facility', true)->count(),
            ],
        ];
    }

    /**
     * Get validation rules for plan
     */
    public function getValidationRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'admission_fee' => 'nullable|numeric|min:0',
            'shift' => 'required|in:morning,evening,full_day',
            'shift_time' => 'nullable|string',
            'personal_training' => 'boolean',
            'group_classes' => 'boolean',
            'locker_facility' => 'boolean',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ];
    }

    /**
     * Check if plan can be safely deleted
     */
    public function canDeletePlan(Plan $plan): bool
    {
        return $plan->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->count() === 0;
    }

    /**
     * Get plans with subscription counts
     */
    public function getPlansWithSubscriptionCounts(): Collection
    {
        return Plan::withCount([
            'subscriptions',
            'subscriptions as active_subscriptions_count' => function ($query) {
                $query->where('status', 'active')
                      ->where('end_date', '>=', now());
            }
        ])->get();
    }
}
