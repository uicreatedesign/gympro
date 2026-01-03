import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Check, CheckCheck, Trash2, Filter, Mail, MailOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  user_id: number | null;
  read_at: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  icon: string | null;
  color: string;
  created_at: string;
}

interface Props {
  notifications: {
    data: Notification[];
    links?: any[];
    meta?: any;
  };
  stats: {
    total: number;
    unread: number;
    read: number;
  };
  types?: Array<{ value: string; label: string }>;
  filters?: {
    filter?: string;
    type?: string;
  };
}

export default function NotificationsIndex({ notifications, stats, types, filters }: Props) {
  const [selectedFilter, setSelectedFilter] = useState(filters?.filter || 'all');
  const [selectedType, setSelectedType] = useState(filters?.type || 'all');

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    router.get('/notifications', { filter: filter === 'all' ? undefined : filter, type: selectedType === 'all' ? undefined : selectedType }, { preserveState: true });
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    router.get('/notifications', { filter: selectedFilter === 'all' ? undefined : selectedFilter, type: type === 'all' ? undefined : type }, { preserveState: true });
  };

  const markAsRead = (id: number) => {
    router.patch(`/notifications/${id}/read`, {}, { preserveScroll: true });
  };

  const markAllAsRead = () => {
    router.patch('/notifications/mark-all-read', {}, { preserveScroll: true });
  };

  const deleteNotification = (id: number) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      router.delete(`/notifications/${id}`, { preserveScroll: true });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <AppLayout>
      <Head title="Notifications" />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          {stats.unread > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Read</p>
                  <p className="text-2xl font-bold text-green-600">{stats.read}</p>
                </div>
                <MailOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types?.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {notifications.data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                notifications.data.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      notification.read_at 
                        ? 'bg-gray-50 dark:bg-gray-900/50' 
                        : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: notification.color }}
                          />
                          <h3 className={`font-medium ${!notification.read_at ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {!notification.read_at && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {!notification.read_at && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.meta?.last_page > 1 && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {notifications.meta?.from} to {notifications.meta?.to} of {notifications.meta?.total} notifications
                </div>
                <div className="flex items-center gap-2">
                  {notifications.links?.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`px-3 py-1 text-sm rounded ${
                        link.active
                          ? 'bg-blue-600 text-white'
                          : link.url
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
