<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_equipment')) {
            abort(403, 'Unauthorized');
        }

        $query = Equipment::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('category', 'like', "%{$request->search}%");
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $equipment = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        $stats = [
            'total' => Equipment::count(),
            'active' => Equipment::where('status', 'active')->count(),
            'maintenance' => Equipment::where('status', 'maintenance')->count(),
        ];

        return Inertia::render('equipment/Index', [
            'equipment' => $equipment,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'per_page' => (int) ($request->per_page ?? 10),
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_equipment')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'quantity' => 'required|integer|min:1',
            'purchase_price' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'condition' => 'required|in:excellent,good,fair,poor',
            'status' => 'required|in:active,maintenance,retired',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('equipment', 'public');
        }

        Equipment::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Equipment $equipment)
    {
        if (!auth()->user()->hasPermission('edit_equipment')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'quantity' => 'required|integer|min:1',
            'purchase_price' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'condition' => 'required|in:excellent,good,fair,poor',
            'status' => 'required|in:active,maintenance,retired',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($equipment->photo) {
                Storage::disk('public')->delete($equipment->photo);
            }
            $validated['photo'] = $request->file('photo')->store('equipment', 'public');
        }

        $equipment->update($validated);

        return redirect()->back();
    }

    public function destroy(Equipment $equipment)
    {
        if (!auth()->user()->hasPermission('delete_equipment')) {
            abort(403, 'Unauthorized');
        }

        if ($equipment->photo) {
            Storage::disk('public')->delete($equipment->photo);
        }

        $equipment->delete();

        return redirect()->back();
    }
}
