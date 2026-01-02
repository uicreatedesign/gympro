<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasPermission('view_expenses')) {
            abort(403, 'Unauthorized');
        }

        $query = Expense::query();

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $expenses = $query->orderBy('expense_date', 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'per_page' => (int) ($request->per_page ?? 10),
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasPermission('create_expenses')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|in:equipment,maintenance,utilities,salaries,rent,marketing,other',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
        ]);

        Expense::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Expense $expense)
    {
        if (!auth()->user()->hasPermission('edit_expenses')) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|in:equipment,maintenance,utilities,salaries,rent,marketing,other',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
        ]);

        $expense->update($validated);

        return redirect()->back();
    }

    public function destroy(Expense $expense)
    {
        if (!auth()->user()->hasPermission('delete_expenses')) {
            abort(403, 'Unauthorized');
        }

        $expense->delete();

        return redirect()->back();
    }
}
