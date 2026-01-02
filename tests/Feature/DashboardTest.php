<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_with_role_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $this->actingAs($user)->get(route('dashboard'))->assertOk();
    }
}
