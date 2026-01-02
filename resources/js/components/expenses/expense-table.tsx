import { Expense } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Search, X } from 'lucide-react';

interface Props {
    expenses: Expense[];
    search: string;
    categoryFilter: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onClearFilters: () => void;
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

export default function ExpenseTable({ expenses, search, categoryFilter, onSearchChange, onCategoryChange, onClearFilters, onEdit, onDelete }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search expenses..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8 h-9"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Category" />
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
                {(search || categoryFilter !== 'all') && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
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
                                <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onDelete(expense.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}
