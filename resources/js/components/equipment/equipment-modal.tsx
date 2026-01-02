import { useForm, router } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Equipment } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment?: Equipment | null;
}

export default function EquipmentModal({ open, onOpenChange, equipment }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: '',
        photo: null as File | null,
        quantity: '1',
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0],
        condition: 'good',
        status: 'active',
        notes: '',
    });

    useEffect(() => {
        if (equipment && open) {
            setData({
                name: equipment.name,
                category: equipment.category,
                photo: null,
                quantity: equipment.quantity.toString(),
                purchase_price: equipment.purchase_price,
                purchase_date: equipment.purchase_date,
                condition: equipment.condition,
                status: equipment.status,
                notes: equipment.notes || '',
            });
        } else if (!equipment) {
            reset();
        }
    }, [equipment, open]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value as string | Blob);
        });

        if (equipment) {
            formData.append('_method', 'PUT');
            router.post(`/equipment/${equipment.id}`, formData, {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                    toast.success('Equipment updated successfully');
                },
            });
        } else {
            router.post('/equipment', formData, {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                    toast.success('Equipment created successfully');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
                    <DialogDescription>Fill in the equipment details</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            />
                            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                            />
                            {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchase_price">Purchase Price *</Label>
                            <Input
                                id="purchase_price"
                                type="number"
                                step="0.01"
                                value={data.purchase_price}
                                onChange={(e) => setData('purchase_price', e.target.value)}
                            />
                            {errors.purchase_price && <p className="text-sm text-destructive">{errors.purchase_price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchase_date">Purchase Date *</Label>
                            <Input
                                id="purchase_date"
                                type="date"
                                value={data.purchase_date}
                                onChange={(e) => setData('purchase_date', e.target.value)}
                            />
                            {errors.purchase_date && <p className="text-sm text-destructive">{errors.purchase_date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition *</Label>
                            <Select value={data.condition} onValueChange={(value) => setData('condition', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="excellent">Excellent</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                    <SelectItem value="poor">Poor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="retired">Retired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="photo">Photo</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                            />
                            {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {equipment ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
