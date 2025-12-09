<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{

    public function index()
    {
        return Inertia::render('Roles/Index', [
            'roles' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'array',
        ]);

        $role = Role::create($validated);
        $role->permissions()->sync($request->permissions ?? []);

        return redirect()->back()->with('success', 'Role created successfully');
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'array',
        ]);

        $role->update($validated);
        $role->permissions()->sync($request->permissions ?? []);

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->back()->with('success', 'Role deleted successfully');
    }
}
