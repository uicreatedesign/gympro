<?php

namespace App\Services;

use App\Models\Exercise;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExerciseService
{
    public function getExercises(array $filters = []): array
    {
        $query = Exercise::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['difficulty'])) {
            $query->where('difficulty', $filters['difficulty']);
        }

        if (!empty($filters['muscle_group'])) {
            $query->where('muscle_group', $filters['muscle_group']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = $filters['per_page'] ?? 10;
        $exercises = $query->latest()->paginate($perPage);

        $stats = [
            'total' => Exercise::count(),
            'active' => Exercise::where('status', 'active')->count(),
            'inactive' => Exercise::where('status', 'inactive')->count(),
        ];

        return [
            'exercises' => $exercises,
            'stats' => $stats,
        ];
    }

    public function createExercise(array $data): Exercise
    {
        if (isset($data['image_primary'])) {
            $data['image_primary'] = $data['image_primary']->store('exercises', 'public');
        }

        if (isset($data['image_secondary'])) {
            $data['image_secondary'] = $data['image_secondary']->store('exercises', 'public');
        }

        return Exercise::create($data);
    }

    public function updateExercise(Exercise $exercise, array $data): Exercise
    {
        if (isset($data['image_primary']) && $data['image_primary']) {
            $data['image_primary'] = $data['image_primary']->store('exercises', 'public');
        } else {
            unset($data['image_primary']);
        }

        if (isset($data['image_secondary']) && $data['image_secondary']) {
            $data['image_secondary'] = $data['image_secondary']->store('exercises', 'public');
        } else {
            unset($data['image_secondary']);
        }

        $exercise->update($data);
        return $exercise->fresh();
    }

    public function deleteExercise(Exercise $exercise): bool
    {
        return $exercise->delete();
    }

    public function getActiveExercises(): Collection
    {
        return Exercise::where('status', 'active')->get();
    }

    public function getExercisesByMuscleGroup(string $muscleGroup): Collection
    {
        return Exercise::where('muscle_group', $muscleGroup)
            ->where('status', 'active')
            ->get();
    }
}
