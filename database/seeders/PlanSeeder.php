<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Basic Monthly',
                'duration_months' => 1,
                'price' => 999,
                'admission_fee' => 500,
                'shift' => 'morning',
                'personal_training' => false,
                'group_classes' => false,
                'locker_facility' => true,
                'description' => 'Perfect for beginners - Morning access with locker facility',
                'status' => 'active',
            ],
            [
                'name' => 'Premium Monthly',
                'duration_months' => 1,
                'price' => 1999,
                'admission_fee' => 500,
                'shift' => 'full_day',
                'personal_training' => true,
                'group_classes' => true,
                'locker_facility' => true,
                'description' => 'All-inclusive monthly plan with personal training and group classes',
                'status' => 'active',
            ],
            [
                'name' => 'Basic Yearly',
                'duration_months' => 12,
                'price' => 9999,
                'admission_fee' => 1000,
                'shift' => 'morning',
                'personal_training' => false,
                'group_classes' => false,
                'locker_facility' => true,
                'description' => 'Save more with yearly plan - Morning access with locker facility',
                'status' => 'active',
            ],
            [
                'name' => 'Premium Yearly',
                'duration_months' => 12,
                'price' => 19999,
                'admission_fee' => 1000,
                'shift' => 'full_day',
                'personal_training' => true,
                'group_classes' => true,
                'locker_facility' => true,
                'description' => 'Best value - Full year access with all premium features',
                'status' => 'active',
            ],
        ];

        foreach ($plans as $plan) {
            Plan::firstOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }

        $this->command->info('Plans created successfully!');
    }
}
