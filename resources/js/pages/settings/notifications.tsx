import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
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

interface NotificationSettings {
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  member_registered: boolean;
  subscription_created: boolean;
  subscription_expiring: boolean;
  subscription_expired: boolean;
  payment_received: boolean;
  payment_failed: boolean;
  attendance_marked: boolean;
}

interface Props {
  settings: NotificationSettings;
}

export default function NotificationSettings({ settings }: Props) {
  const [emailEnabled, setEmailEnabled] = useState(settings?.email_enabled || false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(settings?.whatsapp_enabled || false);
  const [smsEnabled, setSmsEnabled] = useState(settings?.sms_enabled || false);
  const [pushEnabled, setPushEnabled] = useState(settings?.push_enabled || true);
  const [memberRegistered, setMemberRegistered] = useState(settings?.member_registered || false);
  const [subscriptionCreated, setSubscriptionCreated] = useState(settings?.subscription_created || false);
  const [subscriptionExpiring, setSubscriptionExpiring] = useState(settings?.subscription_expiring || false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(settings?.subscription_expired || false);
  const [paymentReceived, setPaymentReceived] = useState(settings?.payment_received || false);
  const [paymentFailed, setPaymentFailed] = useState(settings?.payment_failed || false);
  const [attendanceMarked, setAttendanceMarked] = useState(settings?.attendance_marked || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestNotification = (channel: string) => {
    setIsTesting(true);
    router.post('/api/settings/notifications/test', { channel }, {
      onSuccess: () => {
        toast.success(`Test notification sent via ${channel}`);
        setIsTesting(false);
      },
      onError: () => {
        toast.error(`Failed to send test notification via ${channel}`);
        setIsTesting(false);
      },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    router.post('/settings/notifications', {
      email_enabled: emailEnabled,
      whatsapp_enabled: whatsappEnabled,
      sms_enabled: smsEnabled,
      push_enabled: pushEnabled,
      member_registered: memberRegistered,
      subscription_created: subscriptionCreated,
      subscription_expiring: subscriptionExpiring,
      subscription_expired: subscriptionExpired,
      payment_received: paymentReceived,
      payment_failed: paymentFailed,
      attendance_marked: attendanceMarked,
    }, {
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notification Settings" />
      
      <SettingsLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <p className="text-sm text-muted-foreground">Configure how you want to receive notifications</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Channels
                </CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={emailEnabled ? 'default' : 'secondary'}>
                      {emailEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    {emailEnabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestNotification('email')}
                        disabled={isTesting}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => setEmailEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                      <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={whatsappEnabled ? 'default' : 'secondary'}>
                      {whatsappEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    {whatsappEnabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestNotification('whatsapp')}
                        disabled={isTesting}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsappEnabled}
                        onChange={(e) => setWhatsappEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded">
                      <Smartphone className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                    </div>
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={smsEnabled ? 'default' : 'secondary'}>
                      {smsEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    {smsEnabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestNotification('sms')}
                        disabled={isTesting}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsEnabled}
                        onChange={(e) => setSmsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                      <Bell className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">In-app notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pushEnabled ? 'default' : 'secondary'}>
                      {pushEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    {pushEnabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestNotification('push')}
                        disabled={isTesting}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={(e) => setPushEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {(whatsappEnabled || smsEnabled) && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      WhatsApp and SMS integrations require API configuration. Contact support for setup assistance.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Notification Events */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Events</CardTitle>
                <CardDescription>Select which events should trigger notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Member Registered</p>
                    <p className="text-xs text-muted-foreground">Notify when a new member registers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={memberRegistered}
                      onChange={(e) => setMemberRegistered(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Subscription Created</p>
                    <p className="text-xs text-muted-foreground">Notify when a subscription is created</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscriptionCreated}
                      onChange={(e) => setSubscriptionCreated(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Subscription Expiring</p>
                    <p className="text-xs text-muted-foreground">Notify when subscription is about to expire</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscriptionExpiring}
                      onChange={(e) => setSubscriptionExpiring(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Subscription Expired</p>
                    <p className="text-xs text-muted-foreground">Notify when subscription has expired</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscriptionExpired}
                      onChange={(e) => setSubscriptionExpired(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Payment Received</p>
                    <p className="text-xs text-muted-foreground">Notify when payment is received</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentReceived}
                      onChange={(e) => setPaymentReceived(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Payment Failed</p>
                    <p className="text-xs text-muted-foreground">Notify when payment fails</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentFailed}
                      onChange={(e) => setPaymentFailed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Attendance Marked</p>
                    <p className="text-xs text-muted-foreground">Notify when attendance is marked</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendanceMarked}
                      onChange={(e) => setAttendanceMarked(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
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
