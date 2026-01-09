import { useState, FormEvent } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Mail, MessageSquare, AlertCircle, Smartphone, Send } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notification Settings',
        href: '/settings/notifications',
    },
];

interface Props {
    settings: Record<string, Record<string, boolean>>;
    events: Record<string, string>;
    channels: string[];
}

const channelIcons: Record<string, React.ReactNode> = {
    email: <Mail className="h-4 w-4" />,
    push: <Bell className="h-4 w-4" />,
    sms: <Smartphone className="h-4 w-4" />,
    whatsapp: <MessageSquare className="h-4 w-4" />,
};

const channelColors: Record<string, string> = {
    email: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    push: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    sms: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    whatsapp: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
};

export default function NotificationSettings({ settings, events, channels }: Props) {
    const { props } = usePage();
    const [formSettings, setFormSettings] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [testingChannel, setTestingChannel] = useState<string | null>(null);

    const handleToggle = (event: string, channel: string) => {
        setFormSettings(prev => ({
            ...prev,
            [event]: {
                ...prev[event],
                [channel]: !prev[event][channel],
            },
        }));
    };

    const handleTestNotification = async (channel: string) => {
        setTestingChannel(channel);
        try {
            const response = await fetch('/settings/notifications/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (props as any).csrf_token || '',
                },
                body: JSON.stringify({ channel }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Test notification sent via ${channel}`);
            } else {
                toast.error(data.message || `Failed to send test notification via ${channel}`);
            }
        } catch (error) {
            toast.error(`Failed to send test notification via ${channel}`);
        } finally {
            setTestingChannel(null);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post('/settings/notifications', { settings: formSettings }, {
            onSuccess: () => {
                toast.success('Notification settings updated successfully');
                setIsSaving(false);
            },
            onError: () => {
                toast.error('Failed to update notification settings');
                setIsSaving(false);
            },
        });
    };

    const getEnabledChannelsForEvent = (event: string): number => {
        return Object.values(formSettings[event] || {}).filter(Boolean).length;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification Settings" />
            
            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold">Notification Settings</h2>
                        <p className="text-sm text-muted-foreground">
                            Configure which events trigger notifications and through which channels
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Channels Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Channels
                                </CardTitle>
                                <CardDescription>Test and manage your notification channels</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {channels.map(channel => (
                                    <div key={channel} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded ${channelColors[channel]}`}>
                                                {channelIcons[channel]}
                                            </div>
                                            <div>
                                                <p className="font-medium capitalize">{channel} Notifications</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {getEnabledChannelsForEvent(channel) > 0 
                                                        ? `Enabled for ${Object.values(formSettings).filter(e => e[channel]).length} events`
                                                        : 'Not enabled for any events'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleTestNotification(channel)}
                                            disabled={testingChannel === channel}
                                        >
                                            <Send className="h-3 w-3 mr-1" />
                                            {testingChannel === channel ? 'Sending...' : 'Test'}
                                        </Button>
                                    </div>
                                ))}
                                {(channels.includes('sms') || channels.includes('whatsapp')) && (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-xs">
                                            SMS and WhatsApp require API configuration. Contact support for setup.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event-Channel Matrix */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Notification Matrix</CardTitle>
                                <CardDescription>Select which channels should notify you for each event</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold">Event</th>
                                                {channels.map(channel => (
                                                    <th key={channel} className="text-center py-3 px-4 font-semibold">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className={`p-2 rounded ${channelColors[channel]}`}>
                                                                {channelIcons[channel]}
                                                            </div>
                                                            <span className="text-xs capitalize">{channel}</span>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(events).map(([eventKey, eventLabel]) => (
                                                <tr key={eventKey} className="border-b hover:bg-muted/50">
                                                    <td className="py-4 px-4">
                                                        <div>
                                                            <p className="font-medium text-sm">{eventLabel}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {getEnabledChannelsForEvent(eventKey)} of {channels.length} enabled
                                                            </p>
                                                        </div>
                                                    </td>
                                                    {channels.map(channel => (
                                                        <td key={`${eventKey}-${channel}`} className="text-center py-4 px-4">
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formSettings[eventKey]?.[channel] ?? true}
                                                                    onChange={() => handleToggle(eventKey, channel)}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                            </label>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newSettings: typeof formSettings = {};
                                        Object.keys(events).forEach(event => {
                                            newSettings[event] = {};
                                            channels.forEach(channel => {
                                                newSettings[event][channel] = true;
                                            });
                                        });
                                        setFormSettings(newSettings);
                                    }}
                                >
                                    Enable All
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newSettings: typeof formSettings = {};
                                        Object.keys(events).forEach(event => {
                                            newSettings[event] = {};
                                            channels.forEach(channel => {
                                                newSettings[event][channel] = false;
                                            });
                                        });
                                        setFormSettings(newSettings);
                                    }}
                                >
                                    Disable All
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormSettings(settings)}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
