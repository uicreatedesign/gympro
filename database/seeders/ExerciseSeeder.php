<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        Exercise::truncate();
        
        $jsonUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
        
        try {
            $response = Http::timeout(30)->get($jsonUrl);
            $exercises = $response->json();

            // Filter exercises suitable for small gym
            $selectedExercises = $this->selectBestExercises($exercises, 50);
            
            $count = 0;
            foreach ($selectedExercises as $exercise) {
                $data = [
                    'created_by' => 1,
                    'name' => $exercise['name'] ?? 'Unknown',
                    'category' => $exercise['category'] ?? 'General',
                    'muscle_group' => $exercise['target'] ?? 'Full Body',
                    'difficulty' => $this->mapDifficulty($exercise['equipment'] ?? ''),
                    'description' => $exercise['name'] ?? '',
                    'instructions' => implode('. ', $exercise['instructions'] ?? []),
                    'equipment_required' => is_array($exercise['equipment']) ? implode(', ', $exercise['equipment']) : ($exercise['equipment'] ?? 'None'),
                    'duration_seconds' => 60,
                    'calories_burned' => rand(5, 15),
                    'status' => 'active',
                ];

                // Download images
                if (!empty($exercise['id'])) {
                    $imagePath = $this->downloadImage($exercise['id'], 0);
                    if ($imagePath) {
                        $data['image_primary'] = $imagePath;
                    }

                    $imagePath = $this->downloadImage($exercise['id'], 1);
                    if ($imagePath) {
                        $data['image_secondary'] = $imagePath;
                    }
                }

                Exercise::create($data);
                $count++;
            }

            $this->command->info("Successfully seeded {$count} exercises optimized for small gym.");
        } catch (\Exception $e) {
            $this->command->error('Error: ' . $e->getMessage());
        }
    }

    private function selectBestExercises(array $allExercises, int $limit): array
    {
        $categories = [
            'strength' => 20,
            'cardio' => 8,
            'stretching' => 8,
            'powerlifting' => 5,
            'strongman' => 4,
            'plyometrics' => 5,
        ];

        $selected = [];
        $categoryCount = [];

        // Prioritize exercises with minimal equipment
        $prioritized = array_filter($allExercises, function($ex) {
            $equipment = strtolower($ex['equipment'] ?? '');
            return in_array($equipment, ['body only', 'dumbbell', 'barbell', 'kettlebell', 'medicine ball', 'resistance band']);
        });

        foreach ($prioritized as $exercise) {
            if (count($selected) >= $limit) break;
            
            $category = strtolower($exercise['category'] ?? 'strength');
            $categoryCount[$category] = ($categoryCount[$category] ?? 0) + 1;
            
            if (($categoryCount[$category] ?? 0) <= ($categories[$category] ?? 10)) {
                $selected[] = $exercise;
            }
        }

        return array_slice($selected, 0, $limit);
    }

    private function downloadImage(string $exerciseId, int $imageIndex): ?string
    {
        try {
            $imageUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{$exerciseId}/{$imageIndex}.jpg";
            $response = Http::timeout(15)->get($imageUrl);
            
            if ($response->successful()) {
                $filename = 'exercises/' . uniqid() . '_' . $imageIndex . '.jpg';
                Storage::disk('public')->put($filename, $response->body());
                return $filename;
            }
        } catch (\Exception $e) {
            // Image doesn't exist
        }

        return null;
    }

    private function mapDifficulty(string $equipment): string
    {
        $equipment = strtolower($equipment);
        
        if (in_array($equipment, ['barbell', 'cable', 'machine', 'smith machine'])) {
            return 'intermediate';
        }
        
        if (in_array($equipment, ['dumbbell', 'kettlebell', 'medicine ball', 'resistance band'])) {
            return 'intermediate';
        }

        return 'beginner';
    }
}
