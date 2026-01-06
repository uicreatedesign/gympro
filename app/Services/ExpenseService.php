<?php

namespace App\Services;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExpenseService
{
    /**
     * Get paginated expenses with filtering
     */
    public function getExpenses(array $filters = []): LengthAwarePaginator
    {
        $query = Expense::query();

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        // Apply category filter
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        $perPage = $filters['per_page'] ?? 10;
        return $query->orderBy('expense_date', 'desc')->paginate($perPage);
    }

    /**
     * Create a new expense
     */
    public function createExpense(array $data): Expense
    {
        return Expense::create($data);
    }

    /**
     * Update expense
     */
    public function updateExpense(Expense $expense, array $data): Expense
    {
        $expense->update($data);
        return $expense->fresh();
    }

    /**
     * Delete expense
     */
    public function deleteExpense(Expense $expense): bool
    {
        return $expense->delete();
    }

    /**
     * Get expense by ID
     */
    public function getExpenseById(int $id): Expense
    {
        return Expense::findOrFail($id);
    }

    /**
     * Get expense statistics
     */
    public function getExpenseStatistics(string $startDate = null, string $endDate = null): array
    {
        $query = Expense::query();

        if ($startDate && $endDate) {
            $query->whereBetween('expense_date', [$startDate, $endDate]);
        }

        return [
            'total_expenses' => $query->sum('amount'),
            'expense_count' => $query->count(),
            'by_category' => (clone $query)->selectRaw('category, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('category')
                ->get(),
            'by_payment_method' => (clone $query)->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
                ->groupBy('payment_method')
                ->get(),
            'monthly_totals' => (clone $query)->selectRaw('DATE_FORMAT(expense_date, "%Y-%m") as month, SUM(amount) as total')
                ->groupBy('month')
                ->orderBy('month')
                ->get(),
            'average_expense' => $query->avg('amount'),
        ];
    }

    /**
     * Get expense categories with totals
     */
    public function getExpenseCategoriesWithTotals(string $startDate = null, string $endDate = null): Collection
    {
        $query = Expense::selectRaw('category, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('total', 'desc');

        if ($startDate && $endDate) {
            $query->whereBetween('expense_date', [$startDate, $endDate]);
        }

        return $query->get();
    }

    /**
     * Get monthly expense trends
     */
    public function getMonthlyExpenseTrends(int $months = 12): Collection
    {
        return Expense::selectRaw('
                DATE_FORMAT(expense_date, "%Y-%m") as month,
                SUM(amount) as total,
                COUNT(*) as count,
                AVG(amount) as average
            ')
            ->where('expense_date', '>=', now()->subMonths($months))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Get expenses by date range
     */
    public function getExpensesByDateRange(string $startDate, string $endDate): Collection
    {
        return Expense::whereBetween('expense_date', [$startDate, $endDate])
            ->orderBy('expense_date', 'desc')
            ->get();
    }

    /**
     * Calculate expense totals by category
     */
    public function calculateExpenseTotalsByCategory(string $startDate = null, string $endDate = null): array
    {
        $categories = ['equipment', 'maintenance', 'utilities', 'salaries', 'rent', 'marketing', 'other'];
        $totals = [];

        foreach ($categories as $category) {
            $query = Expense::where('category', $category);

            if ($startDate && $endDate) {
                $query->whereBetween('expense_date', [$startDate, $endDate]);
            }

            $totals[$category] = [
                'total' => $query->sum('amount'),
                'count' => $query->count(),
                'average' => $query->avg('amount') ?? 0,
            ];
        }

        return $totals;
    }

    /**
     * Get validation rules for expense
     */
    public function getValidationRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|in:equipment,maintenance,utilities,salaries,rent,marketing,other',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,card,upi,bank_transfer',
        ];
    }

    /**
     * Bulk create expenses (for importing)
     */
    public function bulkCreateExpenses(array $expensesData): array
    {
        $created = [];
        $errors = [];

        foreach ($expensesData as $index => $expenseData) {
            try {
                $created[] = $this->createExpense($expenseData);
            } catch (\Exception $e) {
                $errors[] = [
                    'row' => $index + 1,
                    'error' => $e->getMessage(),
                    'data' => $expenseData,
                ];
            }
        }

        return [
            'created_count' => count($created),
            'error_count' => count($errors),
            'errors' => $errors,
        ];
    }

    /**
     * Get expense summary for dashboard
     */
    public function getExpenseSummary(): array
    {
        $thisMonth = Expense::whereBetween('expense_date', [
            now()->startOfMonth(),
            now()->endOfMonth()
        ])->sum('amount');

        $lastMonth = Expense::whereBetween('expense_date', [
            now()->subMonth()->startOfMonth(),
            now()->subMonth()->endOfMonth()
        ])->sum('amount');

        $percentageChange = $lastMonth > 0
            ? (($thisMonth - $lastMonth) / $lastMonth) * 100
            : ($thisMonth > 0 ? 100 : 0);

        return [
            'this_month' => $thisMonth,
            'last_month' => $lastMonth,
            'percentage_change' => round($percentageChange, 2),
            'top_categories' => $this->getExpenseCategoriesWithTotals(
                now()->startOfMonth()->toDateString(),
                now()->endOfMonth()->toDateString()
            )->take(5),
        ];
    }
}
