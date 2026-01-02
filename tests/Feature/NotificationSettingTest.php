<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\NotificationSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationSettingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_admin_can_view_notification_settings()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $response = $this->actingAs($user)->get('/settings/notifications');
        $response->assertOk();
    }

    public function test_admin_can_update_notification_settings()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Admin')->first();
        $user->roles()->attach($role->id);

        $settings = [
            'settings' => [
                [
                    'event_type' => 'member_registered',
                    'enabled' => true,
                ],
                [
                    'event_type' => 'payment_received',
                    'enabled' => false,
                ],
            ],
        ];

        $response = $this->actingAs($user)->withoutMiddleware()->post('/settings/notifications', $settings);
        $response->assertRedirect();
        
        $this->assertDatabaseHas('notification_settings', [
            'event_type' => 'member_registered',
            'enabled' => true,
        ]);
    }

    public function test_viewer_can_view_but_not_edit_notification_settings()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Viewer')->first();
        $user->roles()->attach($role->id);

        $response = $this->actingAs($user)->get('/settings/notifications');
        $response->assertOk();

        $settings = [
            'settings' => [
                ['event_type' => 'member_registered', 'enabled' => true],
            ],
        ];

        $response = $this->actingAs($user)->withoutMiddleware()->post('/settings/notifications', $settings);
        $response->assertForbidden();
    }

    public function test_member_cannot_access_notification_settings()
    {
        $user = User::factory()->create();
        $role = Role::where('name', 'Member')->first();
        $user->roles()->attach($role->id);

        $response = $this->actingAs($user)->get('/settings/notifications');
        $response->assertForbidden();
    }
}
