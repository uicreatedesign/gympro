import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { UserInfo } from '@/components/user-info';
import { useEffect, useState } from 'react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetch('/api/notifications/unread-count')
            .then(res => res.json())
            .then(data => setUnreadCount(data.count))
            .catch(() => setUnreadCount(0));

        const interval = setInterval(() => {
            fetch('/api/notifications/unread-count')
                .then(res => res.json())
                .then(data => setUnreadCount(data.count))
                .catch(() => {});
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-3">
                <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 hover:bg-red-600">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 px-2">
                            <UserInfo user={user} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
