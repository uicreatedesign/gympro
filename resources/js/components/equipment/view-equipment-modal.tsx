import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment: Equipment | null;
}

export default function ViewEquipmentModal({ open, onOpenChange, equipment }: Props) {
    if (!equipment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Equipment Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {equipment.photo && (
                        <div className="flex justify-center">
                            <img src={`/storage/${equipment.photo}`} alt={equipment.name} className="h-48 w-48 rounded object-cover" />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{equipment.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="font-medium">{equipment.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p className="font-medium">{equipment.quantity}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Purchase Price</p>
                            <p className="font-medium">₹{equipment.purchase_price}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Purchase Date</p>
                            <p className="font-medium">{new Date(equipment.purchase_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Condition</p>
                            <Badge className="capitalize">{equipment.condition}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className="capitalize">{equipment.status}</Badge>
                        </div>
                    </div>
                    {equipment.notes && (
                        <div>
                            <p className="text-sm text-muted-foreground">Notes</p>
                            <p className="text-sm">{equipment.notes}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
