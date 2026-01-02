<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Member;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_admin_can_view_members()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $response = $this->actingAs($user)->get('/members');
        $response->assertOk();
    }

    public function test_admin_can_create_member()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $memberData = [
            'name' => 'Test Member',
            'email' => 'member@test.com',
            'phone' => '1234567890',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
            'address' => '123 Test Street',
            'join_date' => now()->format('Y-m-d'),
            'status' => 'active',
            'password' => 'password',
            'notes' => null,
        ];

        $response = $this->actingAs($user)->withoutMiddleware()->post('/members', $memberData);
        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'member@test.com']);
    }

    public function test_viewer_cannot_create_member()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Viewer')->first();
        $user->roles()->attach($role->id);

        $memberUser = User::factory()->create();

        $memberData = [
            'user_id' => $memberUser->id,
            'gender' => 'male',
            'status' => 'active',
        ];

        $response = $this->actingAs($user)->withoutMiddleware()->post('/members', $memberData);
        $response->assertForbidden();
    }
}
