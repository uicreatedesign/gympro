import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, Archive } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notifications', href: '/notifications' },
];

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    priority: string;
    read_at?: string;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notification[];
        links: any[];
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    };
}

export default function NotificationsIndex({ notifications }: Props) {
    const { props } = usePage();
    const [isLoading, setIsLoading] = useState(false);

    const getCsrfToken = () => (props as any).csrf_token || '';

    const markAsRead = async (id: string) => {
        setIsLoading(true);
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });
            toast.success('Marked as read');
            router.reload();
        } catch {
            toast.error('Failed to mark as read');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNotification = async (id: string) => {
        setIsLoading(true);
        try {
            await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });
            toast.success('Deleted');
            router.reload();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setIsLoading(false);
        }
    };

    const markAllAsRead = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });
            toast.success('All marked as read');
            router.reload();
        } catch {
            toast.error('Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const hasUnread = notifications.data.some(n => !n.read_at);
    const formatTime = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Notifications</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                {notifications.meta.total} {notifications.meta.total === 1 ? 'notification' : 'notifications'}
                            </p>
                        </div>
                    </div>
                    {hasUnread && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={isLoading}
                        >
                            <Archive className="h-4 w-4 mr-2" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.data.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-muted rounded-lg">
                                    <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
                                </div>
                            </div>
                            <p className="text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.data.map(notification => (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                                    !notification.read_at
                                        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                                        : 'bg-background border-border hover:bg-muted/50'
                                }`}
                            >
                                {/* Indicator */}
                                {!notification.read_at && (
                                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm leading-tight">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        {formatTime(notification.created_at)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    {!notification.read_at && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => markAsRead(notification.id)}
                                            disabled={isLoading}
                                            className="h-8 w-8 p-0"
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNotification(notification.id)}
                                        disabled={isLoading}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {notifications.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-8 pt-6 border-t">
                        {notifications.links.map((link: any, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className="h-8 w-8 p-0"
                            >
                                {link.label.replace(/&laquo;|&raquo;/g, '').trim() || '...'}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
