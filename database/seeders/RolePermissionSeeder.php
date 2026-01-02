<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'view_users', 'description' => 'View users list'],
            ['name' => 'create_users', 'description' => 'Create new users'],
            ['name' => 'edit_users', 'description' => 'Edit existing users'],
            ['name' => 'delete_users', 'description' => 'Delete users'],
            ['name' => 'view_roles', 'description' => 'View roles list'],
            ['name' => 'create_roles', 'description' => 'Create new roles'],
            ['name' => 'edit_roles', 'description' => 'Edit existing roles'],
            ['name' => 'delete_roles', 'description' => 'Delete roles'],
            ['name' => 'manage_permissions', 'description' => 'Manage role permissions'],
            ['name' => 'view_members', 'description' => 'View members list'],
            ['name' => 'create_members', 'description' => 'Create new members'],
            ['name' => 'edit_members', 'description' => 'Edit existing members'],
            ['name' => 'delete_members', 'description' => 'Delete members'],
            ['name' => 'view_plans', 'description' => 'View plans list'],
            ['name' => 'create_plans', 'description' => 'Create new plans'],
            ['name' => 'edit_plans', 'description' => 'Edit existing plans'],
            ['name' => 'delete_plans', 'description' => 'Delete plans'],
            ['name' => 'view_subscriptions', 'description' => 'View subscriptions list'],
            ['name' => 'create_subscriptions', 'description' => 'Create new subscriptions'],
            ['name' => 'edit_subscriptions', 'description' => 'Edit existing subscriptions'],
            ['name' => 'delete_subscriptions', 'description' => 'Delete subscriptions'],
            ['name' => 'view_attendances', 'description' => 'View attendances list'],
            ['name' => 'create_attendances', 'description' => 'Create new attendances'],
            ['name' => 'edit_attendances', 'description' => 'Edit existing attendances'],
            ['name' => 'delete_attendances', 'description' => 'Delete attendances'],
            ['name' => 'view_trainers', 'description' => 'View trainers list'],
            ['name' => 'create_trainers', 'description' => 'Create new trainers'],
            ['name' => 'edit_trainers', 'description' => 'Edit existing trainers'],
            ['name' => 'delete_trainers', 'description' => 'Delete trainers'],
            ['name' => 'view_payments', 'description' => 'View payments list'],
            ['name' => 'create_payments', 'description' => 'Create new payments'],
            ['name' => 'edit_payments', 'description' => 'Edit existing payments'],
            ['name' => 'delete_payments', 'description' => 'Delete payments'],
            ['name' => 'view_expenses', 'description' => 'View expenses list'],
            ['name' => 'create_expenses', 'description' => 'Create new expenses'],
            ['name' => 'edit_expenses', 'description' => 'Edit existing expenses'],
            ['name' => 'delete_expenses', 'description' => 'Delete expenses'],
            ['name' => 'view_settings', 'description' => 'View settings'],
            ['name' => 'edit_settings', 'description' => 'Edit settings'],
            ['name' => 'view_reports', 'description' => 'View reports and analytics'],
            ['name' => 'view_member_dashboard', 'description' => 'Access member dashboard'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                ['description' => $permission['description']]
            );
        }

        $admin = Role::firstOrCreate(
            ['name' => 'Admin'],
            ['description' => 'Full system access']
        );
        $admin->permissions()->sync(Permission::all());

        $manager = Role::firstOrCreate(
            ['name' => 'Manager'],
            ['description' => 'Limited management access']
        );
        $manager->permissions()->sync(
            Permission::whereIn('name', ['view_users', 'view_roles', 'view_members', 'create_members', 'edit_members', 'view_plans', 'create_plans', 'edit_plans', 'view_subscriptions', 'create_subscriptions', 'edit_subscriptions', 'view_attendances', 'create_attendances', 'edit_attendances', 'view_trainers', 'create_trainers', 'edit_trainers', 'view_payments', 'create_payments', 'edit_payments', 'view_expenses', 'create_expenses', 'edit_expenses', 'view_reports'])->pluck('id')
        );

        $viewer = Role::firstOrCreate(
            ['name' => 'Viewer'],
            ['description' => 'Read-only access']
        );
        $viewer->permissions()->sync(
            Permission::whereIn('name', ['view_users', 'view_roles', 'view_members', 'view_plans', 'view_subscriptions', 'view_attendances', 'view_trainers', 'view_payments', 'view_expenses', 'view_reports'])->pluck('id')
        );

        Role::firstOrCreate(
            ['name' => 'Trainer'],
            ['description' => 'Gym trainer access']
        );

        $memberRole = Role::firstOrCreate(
            ['name' => 'Member'],
            ['description' => 'Gym member access']
        );
        $memberRole->permissions()->sync(
            Permission::whereIn('name', ['view_member_dashboard'])->pluck('id')
        );
    }
}
