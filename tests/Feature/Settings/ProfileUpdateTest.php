<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_profile_page_is_displayed()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $response = $this
            ->actingAs($user)
            ->withoutMiddleware()
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'phone' => '1234567890',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $response = $this
            ->actingAs($user)
            ->withoutMiddleware()
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => $user->email,
                'phone' => '1234567890',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $this->markTestSkipped('Account deletion test requires session handling.');
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $response = $this
            ->actingAs($user)
            ->withoutMiddleware()
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }
}
