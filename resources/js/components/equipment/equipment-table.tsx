import { Equipment } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Eye, Search, X, Package } from 'lucide-react';

interface Props {
    equipment: Equipment[];
    search: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onClearFilters: () => void;
    onEdit: (equipment: Equipment) => void;
    onDelete: (equipment: Equipment) => void;
    onView: (equipment: Equipment) => void;
}

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    retired: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const conditionColors: Record<string, string> = {
    excellent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function EquipmentTable({ equipment, search, statusFilter, onSearchChange, onStatusChange, onClearFilters, onEdit, onDelete, onView }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search equipment..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8 h-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                </Select>
                {(search || statusFilter !== 'all') && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {equipment.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            {item.photo ? (
                                <img src={`/storage/${item.photo}`} alt={item.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                            <Badge className={conditionColors[item.condition]}>
                                {item.condition}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={statusColors[item.status]}>
                                {item.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => onView(item)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => onDelete(item)}>
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
