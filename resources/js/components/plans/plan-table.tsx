import { Plan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
    plans: Plan[];
    onEdit?: (plan: Plan) => void;
    onDelete?: (plan: Plan) => void;
}

const shiftLabels = {
    morning: 'Morning',
    evening: 'Evening',
    full_day: 'Full Day',
};

export default function PlanTable({ plans, onEdit, onDelete }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-16">Sr No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {plans.map((plan, index) => (
                    <TableRow key={plan.id} className="hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}</TableCell>
                        <TableCell>₹{plan.price}</TableCell>
                        <TableCell>
                            <Badge 
                                variant="outline"
                                className={
                                    plan.shift === 'morning'
                                        ? 'border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950'
                                        : plan.shift === 'evening'
                                        ? 'border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-950'
                                        : 'border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-950'
                                }
                            >
                                {shiftLabels[plan.shift]}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {plan.personal_training && <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:bg-indigo-950">PT</Badge>}
                                {plan.group_classes && <Badge variant="outline" className="border-cyan-200 text-cyan-700 bg-cyan-50 dark:border-cyan-800 dark:text-cyan-400 dark:bg-cyan-950">Classes</Badge>}
                                {plan.locker_facility && <Badge variant="outline" className="border-teal-200 text-teal-700 bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:bg-teal-950">Locker</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge 
                                variant="outline"
                                className={
                                    plan.status === 'active'
                                        ? 'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950'
                                        : 'border-gray-200 text-gray-700 bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:bg-gray-950'
                                }
                            >
                                {plan.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onEdit && (
                                        <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button variant="outline" size="sm" onClick={() => onDelete(plan)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
