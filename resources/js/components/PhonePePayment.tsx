import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';

interface PhonePePaymentProps {
    amount: number;
    orderId: string;
    planId?: number;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function PhonePePayment({ amount, orderId, planId, onSuccess, onError }: PhonePePaymentProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        
        router.post('/member/payment/initiate', {
            plan_id: planId,
            gateway: 'phonepe',
        }, {
            onSuccess: () => {
                onSuccess?.();
                setLoading(false);
            },
            onError: (errors) => {
                onError?.(Object.values(errors).flat().join(', ') || 'Payment initiation failed');
                setLoading(false);
            }
        });
    };

    return (
        <Button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full"
        >
            {loading ? 'Processing...' : `Pay ₹${amount} with PhonePe`}
        </Button>
    );
}