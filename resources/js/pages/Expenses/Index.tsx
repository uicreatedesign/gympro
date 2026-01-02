import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PageProps, Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
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
    };
}

export default function Index({ expenses, filters }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editExpense, setEditExpense] = useState<Expense | null>(null);
    const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/expenses', 
                { search, category: category === 'all' ? '' : category }, 
                { preserveState: true, preserveScroll: true, only: ['expenses'] }
            );
        }, 500);
        return () => clearTimeout(timer);
    }, [search, category]);

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
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by title..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="equipment">Equipment</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="utilities">Utilities</SelectItem>
                                    <SelectItem value="salaries">Salaries</SelectItem>
                                    <SelectItem value="rent">Rent</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <ExpenseTable
                            expenses={expenses.data}
                            onEdit={setEditExpense}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                </Card>
            </div>

            <ExpenseModal open={createOpen} onOpenChange={setCreateOpen} />
            <ExpenseModal open={!!editExpense} onOpenChange={(open) => !open && setEditExpense(null)} expense={editExpense} />
            <DeleteExpenseDialog open={!!deleteExpense} onOpenChange={(open) => !open && setDeleteExpense(null)} expense={deleteExpense} />
        </AppLayout>
    );
}
