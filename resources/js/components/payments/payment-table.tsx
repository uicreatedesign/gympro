import { Payment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Download } from 'lucide-react';

interface Props {
    payments: Payment[];
    onEdit?: (payment: Payment) => void;
    onDelete?: (payment: Payment) => void;
    onDownloadInvoice?: (payment: Payment) => void;
}

const statusColors = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
    refunded: 'bg-gray-500',
};

const methodLabels = {
    cash: 'Cash',
    card: 'Card',
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
};

const typeLabels = {
    subscription: 'Subscription',
    admission: 'Admission',
    other: 'Other',
};

export default function PaymentTable({ payments, onEdit, onDelete, onDownloadInvoice }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    {(onEdit || onDelete || onDownloadInvoice) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.map((payment) => (
                    <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.invoice_number}</TableCell>
                        <TableCell>{payment.member?.name}</TableCell>
                        <TableCell>₹{payment.amount}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{methodLabels[payment.payment_method]}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{typeLabels[payment.payment_type]}</Badge>
                        </TableCell>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge className={statusColors[payment.status]}>
                                {payment.status}
                            </Badge>
                        </TableCell>
                        {(onEdit || onDelete || onDownloadInvoice) && (
                            <TableCell className="text-right space-x-2">
                                {onDownloadInvoice && (
                                    <Button variant="ghost" size="icon" onClick={() => onDownloadInvoice(payment)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                )}
                                {onEdit && (
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(payment)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(payment)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
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
