import { Head, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Smartphone } from 'lucide-react';

interface Plan {
    id: number;
    name: string;
    duration_months: number;
    price: number;
    admission_fee: number;
    shift: string;
    shift_time: string;
    personal_training: boolean;
    group_classes: boolean;
    locker_facility: boolean;
    description: string;
}

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Props {
    plan: Plan;
    member: Member;
    hasActiveSubscription: boolean;
}

export default function Checkout({ plan, member, hasActiveSubscription }: Props) {
    const { post, processing } = useForm({
        plan_id: plan.id,
        gateway: 'phonepe',
    });

    const admissionFee = hasActiveSubscription ? 0 : plan.admission_fee;
    const totalAmount = plan.price + admissionFee;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/member/payment/initiate');
    };

    return (
        <AppSidebarLayout>
            <Head title="Checkout" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                    <p className="text-muted-foreground">Review your order and complete payment</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Member Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name</span>
                                    <span className="font-medium">{member.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium">{member.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phone</span>
                                    <span className="font-medium">{member.phone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>Secure payment via PhonePe</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-3 border rounded-lg p-4 bg-accent/50">
                                    <Smartphone className="h-5 w-5" />
                                    <div>
                                        <div className="font-medium">PhonePe</div>
                                        <div className="text-sm text-muted-foreground">UPI, Cards, Wallets & More</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="font-semibold">{plan.name}</div>
                                    <div className="text-sm text-muted-foreground">{plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''}</div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span>{plan.shift} Shift</span>
                                    </div>
                                    {plan.personal_training && (
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span>Personal Training</span>
                                        </div>
                                    )}
                                    {plan.group_classes && (
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span>Group Classes</span>
                                        </div>
                                    )}
                                    {plan.locker_facility && (
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span>Locker Facility</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Plan Price</span>
                                        <span>₹{plan.price}</span>
                                    </div>
                                    {admissionFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Admission Fee</span>
                                            <span>₹{admissionFee}</span>
                                        </div>
                                    )}
                                    {hasActiveSubscription && (
                                        <div className="text-xs text-green-600">
                                            Admission fee waived (existing member)
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Processing...' : 'Proceed to Payment'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
