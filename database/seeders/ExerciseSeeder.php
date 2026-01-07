<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exercises = [
            // Cardio Exercises
            [
                'name' => 'Treadmill Running',
                'description' => 'Running or walking on a treadmill',
                'category' => 'cardio',
                'target_muscle' => 'legs',
                'difficulty' => 'beginner',
                'instructions' => 'Start with a comfortable pace. Gradually increase speed and incline as you build endurance.',
                'video_url' => 'https://www.youtube.com/watch?v=example1',
                'is_active' => true,
            ],
            [
                'name' => 'Stationary Bike',
                'description' => 'Cycling on a stationary bike',
                'category' => 'cardio',
                'target_muscle' => 'legs',
                'difficulty' => 'beginner',
                'instructions' => 'Adjust seat height and resistance. Maintain steady pace for cardio benefits.',
                'video_url' => 'https://www.youtube.com/watch?v=example2',
                'is_active' => true,
            ],
            [
                'name' => 'Elliptical Training',
                'description' => 'Low-impact cardio on elliptical machine',
                'category' => 'cardio',
                'target_muscle' => 'full_body',
                'difficulty' => 'beginner',
                'instructions' => 'Maintain good posture. Push and pull with both arms and legs simultaneously.',
                'video_url' => 'https://www.youtube.com/watch?v=example3',
                'is_active' => true,
            ],

            // Strength Exercises
            [
                'name' => 'Bench Press',
                'description' => 'Barbell bench press for chest development',
                'category' => 'strength',
                'target_muscle' => 'chest',
                'difficulty' => 'intermediate',
                'instructions' => 'Lie on bench, grip bar shoulder-width. Lower to chest, then press up explosively.',
                'video_url' => 'https://www.youtube.com/watch?v=example4',
                'is_active' => true,
            ],
            [
                'name' => 'Squats',
                'description' => 'Bodyweight or barbell squats',
                'category' => 'strength',
                'target_muscle' => 'legs',
                'difficulty' => 'beginner',
                'instructions' => 'Stand with feet shoulder-width. Lower as if sitting back into a chair, then stand up.',
                'video_url' => 'https://www.youtube.com/watch?v=example5',
                'is_active' => true,
            ],
            [
                'name' => 'Deadlifts',
                'description' => 'Conventional deadlift technique',
                'category' => 'strength',
                'target_muscle' => 'back',
                'difficulty' => 'advanced',
                'instructions' => 'Stand over bar, hinge at hips. Grip bar, keep back straight, lift by extending hips.',
                'video_url' => 'https://www.youtube.com/watch?v=example6',
                'is_active' => true,
            ],
            [
                'name' => 'Pull-ups',
                'description' => 'Overhand grip pull-ups',
                'category' => 'strength',
                'target_muscle' => 'back',
                'difficulty' => 'intermediate',
                'instructions' => 'Hang from bar with overhand grip. Pull body up until chin clears bar.',
                'video_url' => 'https://www.youtube.com/watch?v=example7',
                'is_active' => true,
            ],
            [
                'name' => 'Push-ups',
                'description' => 'Standard push-up exercise',
                'category' => 'strength',
                'target_muscle' => 'chest',
                'difficulty' => 'beginner',
                'instructions' => 'Start in plank position. Lower chest to ground, then push back up.',
                'video_url' => 'https://www.youtube.com/watch?v=example8',
                'is_active' => true,
            ],

            // Flexibility Exercises
            [
                'name' => 'Yoga Flow',
                'description' => 'Basic yoga sequence for flexibility',
                'category' => 'flexibility',
                'target_muscle' => 'full_body',
                'difficulty' => 'beginner',
                'instructions' => 'Follow sun salutation sequence. Focus on breath and gentle stretching.',
                'video_url' => 'https://www.youtube.com/watch?v=example9',
                'is_active' => true,
            ],
            [
                'name' => 'Hamstring Stretch',
                'description' => 'Seated hamstring stretch',
                'category' => 'flexibility',
                'target_muscle' => 'legs',
                'difficulty' => 'beginner',
                'instructions' => 'Sit with legs extended. Reach toward toes while keeping back straight.',
                'video_url' => 'https://www.youtube.com/watch?v=example10',
                'is_active' => true,
            ],
        ];

        foreach ($exercises as $exercise) {
            \App\Models\Exercise::create($exercise);
        }
    }
}
