import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'General Settings',
        href: '/settings/general',
    },
];

interface Props {
    settings: Record<string, string>;
}

export default function General({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || '',
        currency: settings.currency || 'INR',
        currency_symbol: settings.currency_symbol || '₹',
        tax_rate: settings.tax_rate || '18',
        business_name: settings.business_name || '',
        business_address: settings.business_address || '',
        business_phone: settings.business_phone || '',
        business_email: settings.business_email || '',
        business_website: settings.business_website || '',
        timezone: settings.timezone || 'Asia/Kolkata',
        date_format: settings.date_format || 'd/m/Y',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/settings/general', {
            onSuccess: () => toast.success('Settings updated successfully'),
            onError: () => toast.error('Failed to update settings'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Settings" />
            
            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Settings</CardTitle>
                            <CardDescription>Basic application configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="app_name">Application Name</Label>
                                <Input
                                    id="app_name"
                                    value={data.app_name}
                                    onChange={(e) => setData('app_name', e.target.value)}
                                />
                                {errors.app_name && <p className="text-sm text-destructive">{errors.app_name}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Currency & Tax</CardTitle>
                            <CardDescription>Configure currency and tax settings</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                />
                                {errors.currency && <p className="text-sm text-destructive">{errors.currency}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency_symbol">Currency Symbol</Label>
                                <Input
                                    id="currency_symbol"
                                    value={data.currency_symbol}
                                    onChange={(e) => setData('currency_symbol', e.target.value)}
                                />
                                {errors.currency_symbol && <p className="text-sm text-destructive">{errors.currency_symbol}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                                <Input
                                    id="tax_rate"
                                    type="number"
                                    value={data.tax_rate}
                                    onChange={(e) => setData('tax_rate', e.target.value)}
                                />
                                {errors.tax_rate && <p className="text-sm text-destructive">{errors.tax_rate}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>Your business details for invoices and reports</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="business_name">Business Name</Label>
                                <Input
                                    id="business_name"
                                    value={data.business_name}
                                    onChange={(e) => setData('business_name', e.target.value)}
                                />
                                {errors.business_name && <p className="text-sm text-destructive">{errors.business_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business_address">Business Address</Label>
                                <Textarea
                                    id="business_address"
                                    value={data.business_address}
                                    onChange={(e) => setData('business_address', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="business_phone">Phone</Label>
                                    <Input
                                        id="business_phone"
                                        value={data.business_phone}
                                        onChange={(e) => setData('business_phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="business_email">Email</Label>
                                    <Input
                                        id="business_email"
                                        type="email"
                                        value={data.business_email}
                                        onChange={(e) => setData('business_email', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business_website">Website</Label>
                                <Input
                                    id="business_website"
                                    type="url"
                                    value={data.business_website}
                                    onChange={(e) => setData('business_website', e.target.value)}
                                />
                            </div>
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
