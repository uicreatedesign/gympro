import { Plan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

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
                {plans.map((plan) => (
                    <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}</TableCell>
                        <TableCell>₹{plan.price}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{shiftLabels[plan.shift]}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {plan.personal_training && <Badge variant="secondary">PT</Badge>}
                                {plan.group_classes && <Badge variant="secondary">Classes</Badge>}
                                {plan.locker_facility && <Badge variant="secondary">Locker</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={plan.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                                {plan.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete) && (
                            <TableCell className="text-right space-x-2">
                                {onEdit && (
                                    <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(plan)}>
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
