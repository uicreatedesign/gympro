import { Head, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Props {
    gateway: string;
    orderId: string;
    amount: number;
    keyId: string;
    member: Member;
    transactionId: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentGateway({ gateway, orderId, amount, keyId, member, transactionId }: Props) {
    useEffect(() => {
        if (gateway === 'razorpay') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [gateway]);

    const handleRazorpayPayment = () => {
        const options = {
            key: keyId,
            amount: amount * 100,
            currency: 'INR',
            name: 'GymPro',
            description: 'Membership Payment',
            order_id: orderId,
            handler: function (response: any) {
                router.post('/member/payment/callback', {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                });
            },
            prefill: {
                name: member.name,
                email: member.email,
                contact: member.phone,
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <AppSidebarLayout>
            <Head title="Payment" />

            <div className="max-w-md mx-auto mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Complete Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">₹{amount}</div>
                            <div className="text-sm text-muted-foreground mt-2">
                                Transaction ID: {transactionId}
                            </div>
                        </div>

                        {gateway === 'razorpay' && (
                            <Button className="w-full" onClick={handleRazorpayPayment}>
                                Pay with Razorpay
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
