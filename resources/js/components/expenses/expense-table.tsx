import { Expense } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: number) => void;
}

const categoryColors: Record<string, string> = {
    equipment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    utilities: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    salaries: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    rent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function ExpenseTable({ expenses, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.map((expense, index) => (
                    <TableRow key={expense.id} className="hover:bg-muted/50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <div>
                                <p className="font-medium">{expense.title}</p>
                                {expense.description && (
                                    <p className="text-sm text-muted-foreground">{expense.description}</p>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={categoryColors[expense.category]}>
                                {expense.category}
                            </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">₹{expense.amount}</TableCell>
                        <TableCell>{new Date(expense.expense_date).toLocaleDateString()}</TableCell>
                        <TableCell className="capitalize">{expense.payment_method.replace('_', ' ')}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
