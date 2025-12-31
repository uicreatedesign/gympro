import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FormEventHandler } from 'react';

interface Props {
    settings: {
        phonepe_enabled: string;
        phonepe_merchant_id: string;
        phonepe_salt_key: string;
        phonepe_salt_index: string;
        phonepe_env: string;
    };
}

export default function PaymentGateways({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        phonepe_enabled: settings.phonepe_enabled === '1',
        phonepe_merchant_id: settings.phonepe_merchant_id || '',
        phonepe_salt_key: settings.phonepe_salt_key || '',
        phonepe_salt_index: settings.phonepe_salt_index || '1',
        phonepe_env: settings.phonepe_env || 'UAT',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/settings/payment-gateways', {
            onSuccess: () => toast.success('Payment gateway settings updated successfully'),
            onError: () => toast.error('Failed to update settings'),
        });
    };

    return (
        <AppLayout>
            <Head title="Payment Gateways" />
            
            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>PhonePe Payment Gateway</CardTitle>
                            <CardDescription>Configure PhonePe payment integration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable PhonePe</Label>
                                    <p className="text-sm text-muted-foreground">Allow members to purchase plans via PhonePe</p>
                                </div>
                                <Switch
                                    checked={data.phonepe_enabled}
                                    onCheckedChange={(checked) => setData('phonepe_enabled', checked)}
                                />
                            </div>

                            {data.phonepe_enabled && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="phonepe_merchant_id">Merchant ID</Label>
                                        <Input
                                            id="phonepe_merchant_id"
                                            value={data.phonepe_merchant_id}
                                            onChange={(e) => setData('phonepe_merchant_id', e.target.value)}
                                            placeholder="Enter PhonePe Merchant ID"
                                        />
                                        {errors.phonepe_merchant_id && (
                                            <p className="text-sm text-red-600">{errors.phonepe_merchant_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phonepe_salt_key">Salt Key</Label>
                                        <Input
                                            id="phonepe_salt_key"
                                            type="password"
                                            value={data.phonepe_salt_key}
                                            onChange={(e) => setData('phonepe_salt_key', e.target.value)}
                                            placeholder="Enter PhonePe Salt Key"
                                        />
                                        {errors.phonepe_salt_key && (
                                            <p className="text-sm text-red-600">{errors.phonepe_salt_key}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phonepe_salt_index">Salt Index</Label>
                                        <Input
                                            id="phonepe_salt_index"
                                            value={data.phonepe_salt_index}
                                            onChange={(e) => setData('phonepe_salt_index', e.target.value)}
                                            placeholder="1"
                                        />
                                        {errors.phonepe_salt_index && (
                                            <p className="text-sm text-red-600">{errors.phonepe_salt_index}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phonepe_env">Environment</Label>
                                        <Select value={data.phonepe_env} onValueChange={(value) => setData('phonepe_env', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UAT">UAT (Testing)</SelectItem>
                                                <SelectItem value="PRODUCTION">Production</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.phonepe_env && (
                                            <p className="text-sm text-red-600">{errors.phonepe_env}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Save Settings
                        </Button>
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
