import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

export default function QRCheckIn() {
    const [memberId, setMemberId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async () => {
        if (!memberId) {
            toast.error('Please enter member ID');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/attendances/qr-checkin', {
                member_id: memberId,
            });

            if (response.data.type === 'checkin') {
                toast.success(response.data.message);
            } else if (response.data.type === 'checkout') {
                toast.success(response.data.message);
            }
            setMemberId('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="QR Check-In" />

            <div className="container mx-auto p-6">
                <div className="max-w-md mx-auto mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>QR Code Check-In</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Scan QR or Enter Member ID"
                                    value={memberId}
                                    onChange={(e) => setMemberId(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
                                    autoFocus
                                />
                            </div>
                            <Button 
                                className="w-full" 
                                onClick={handleCheckIn}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Check In/Out'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
