<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Services\EquipmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function __construct(
        private EquipmentService $equipmentService
    ) {}

    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_equipment')) {
            abort(403, 'Unauthorized');
        }

        $filters = [
            'search' => $request->search,
            'status' => $request->status !== 'all' ? $request->status : null,
            'per_page' => (int) ($request->per_page ?? 10),
        ];

        $result = $this->equipmentService->getEquipment($filters);

        return Inertia::render('equipment/Index', [
            'equipment' => $result['equipment'],
            'stats' => $result['stats'],
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_equipment')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate($this->equipmentService->getValidationRules());

        // Handle file upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo');
        }

        $this->equipmentService->createEquipment($validated);

        return redirect()->back();
    }

    public function update(Request $request, Equipment $equipment)
    {
        if (!auth()->user()->hasPermission('edit_equipment')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate($this->equipmentService->getValidationRules());

        // Handle file upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo');
        }

        $this->equipmentService->updateEquipment($equipment, $validated);

        return redirect()->back();
    }

    public function destroy(Equipment $equipment)
    {
        if (!auth()->user()->hasPermission('delete_equipment')) {
            abort(403, 'Unauthorized');
        }

        $this->equipmentService->deleteEquipment($equipment);

        return redirect()->back();
    }
}
