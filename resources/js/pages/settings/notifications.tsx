import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification Settings',
        href: '/settings/notifications',
    },
];

interface NotificationSetting {
    event_type: string;
    label: string;
    enabled: boolean;
}

interface Props {
    notificationSettings: NotificationSetting[];
}

export default function Notifications({ notificationSettings }: Props) {
    const { auth } = usePage().props as any;
    const [settings, setSettings] = useState(notificationSettings);

    const canEdit = auth.permissions.includes('edit_notifications');

    const handleToggle = (eventType: string, enabled: boolean) => {
        setSettings(prev =>
            prev.map(s => s.event_type === eventType ? { ...s, enabled } : s)
        );
    };

    const handleSave = () => {
        router.post('/settings/notifications', { settings }, {
            onSuccess: () => toast.success('Notification settings saved successfully'),
            onError: () => toast.error('Failed to save notification settings'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification Settings" />
            
            <SettingsLayout>
                <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Notification Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Enable or disable email notifications for different events. Emails will be sent to admin automatically.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email Notifications
                        </CardTitle>
                        <CardDescription>
                            Toggle notifications on or off for specific events
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {settings.map((setting) => (
                            <div key={setting.event_type} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div>
                                    <Label className="text-base font-medium">{setting.label}</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send email notification when this event occurs
                                    </p>
                                </div>
                                <Switch
                                    checked={setting.enabled}
                                    onCheckedChange={(checked) => handleToggle(setting.event_type, checked)}
                                    disabled={!canEdit}
                                />
                            </div>
                        ))}

                        {canEdit && (
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            </SettingsLayout>
        </AppLayout>
    );
}
