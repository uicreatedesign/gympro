import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
    orderId: string;
    amount: number;
    callbackUrl: string;
}

export default function PaymentSimulator({ orderId, amount, callbackUrl }: Props) {
    const handleSuccess = () => {
        router.get(callbackUrl);
    };

    const handleFailure = () => {
        router.get('/member/plans', {}, {
            onSuccess: () => {
                alert('Payment cancelled');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <Head title="Payment Simulator" />

            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Payment Simulator</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">Test Payment Gateway</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                        <div className="text-sm text-muted-foreground">Order ID</div>
                        <div className="font-mono text-sm">{orderId}</div>
                    </div>

                    <div className="text-center space-y-2">
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="text-3xl font-bold">₹{amount}</div>
                    </div>

                    <div className="space-y-3">
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleSuccess}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Simulate Success Payment
                        </Button>

                        <Button 
                            className="w-full" 
                            variant="destructive"
                            size="lg"
                            onClick={handleFailure}
                        >
                            <XCircle className="mr-2 h-5 w-5" />
                            Simulate Failed Payment
                        </Button>
                    </div>

                    <div className="text-xs text-center text-muted-foreground">
                        This is a test payment simulator. In production, this will be replaced with actual PhonePe payment gateway.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
