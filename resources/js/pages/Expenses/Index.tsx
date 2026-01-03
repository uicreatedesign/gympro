import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { PageProps, Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import ExpenseTable from '@/components/expenses/expense-table';
import ExpenseModal from '@/components/expenses/expense-modal';
import DeleteExpenseDialog from '@/components/expenses/delete-expense-dialog';

interface Props extends PageProps {
    expenses: {
        data: Expense[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        category?: string;
        per_page: number;
    };
}

export default function Index({ expenses, filters }: Props) {
    const { auth } = usePage().props as any;
    const [createOpen, setCreateOpen] = useState(false);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);
    const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
    const [debouncedSearch] = useDebounce(search, 500);

    const canEdit = auth.permissions.includes('edit_expenses');
    const canDelete = auth.permissions.includes('delete_expenses');

    useEffect(() => {
        router.get('/expenses', {
            search: debouncedSearch || undefined,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
            per_page: filters.per_page
        }, { preserveState: true, preserveScroll: true, replace: true });
    }, [debouncedSearch, categoryFilter]);

    const handleClearFilters = () => {
        setSearch('');
        setCategoryFilter('all');
    };

    const handlePageChange = (page: number) => {
        router.get('/expenses', {
            page,
            search: search || undefined,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
            per_page: filters.per_page
        }, { preserveState: true });
    };

    const handlePerPageChange = (value: string) => {
        router.get('/expenses', {
            search: search || undefined,
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
            per_page: value
        }, { preserveState: true });
    };

    const startItem = (expenses.current_page - 1) * expenses.per_page + 1;
    const endItem = Math.min(expenses.current_page * expenses.per_page, expenses.total);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const { current_page, last_page } = expenses;
        if (last_page <= 7) return Array.from({ length: last_page }, (_, i) => i + 1);
        pages.push(1);
        if (current_page > 3) pages.push('...');
        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) pages.push(i);
        if (current_page < last_page - 2) pages.push('...');
        pages.push(last_page);
        return pages;
    };

    const handleDelete = (id: number) => {
        const expense = expenses.data.find(e => e.id === id);
        if (expense) setDeleteExpense(expense);
    };

    return (
        <AppLayout>
            <Head title="Expenses" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Expenses</h1>
                        <p className="text-muted-foreground">Manage gym expenses</p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <ExpenseTable
                            expenses={expenses.data}
                            search={search}
                            categoryFilter={categoryFilter}
                            onSearchChange={setSearch}
                            onCategoryChange={setCategoryFilter}
                            onClearFilters={handleClearFilters}
                            onEdit={canEdit ? setEditExpense : () => {}}
                            onDelete={canDelete ? handleDelete : () => {}}
                        />
                        {expenses.data.length === 0 && (
                            <div className="text-center py-12">
                                <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No expenses found</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {search || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by adding a new expense'}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {startItem} to {endItem} of {expenses.total} results
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(expenses.current_page - 1)} className={expenses.current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                    {getPageNumbers().map((page, idx) => (
                                        <PaginationItem key={idx}>
                                            {page === '...' ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlePageChange(page as number)} isActive={page === expenses.current_page} className="cursor-pointer">{page}</PaginationLink>}
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(expenses.current_page + 1)} className={expenses.current_page === expenses.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ExpenseModal open={createOpen} onOpenChange={setCreateOpen} />
            <ExpenseModal open={!!editExpense} onOpenChange={(open) => !open && setEditExpense(null)} expense={editExpense} />
            <DeleteExpenseDialog open={!!deleteExpense} onOpenChange={(open) => !open && setDeleteExpense(null)} expense={deleteExpense} />
        </AppLayout>
    );
}
