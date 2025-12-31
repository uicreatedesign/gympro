import { Link, usePage } from '@inertiajs/react';
import { Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from './app-layout';

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const { url, auth } = usePage().props as any;
    const userPermissions = auth?.permissions || [];

    const menuItems = [
        {
            href: '/settings/general',
            label: 'General Settings',
            icon: Settings,
            permission: 'view_settings',
        },
        {
            href: '/roles',
            label: 'Roles & Permissions',
            icon: Shield,
            permission: 'view_roles',
        },
    ];

    const filteredItems = menuItems.filter(item => userPermissions.includes(item.permission));

    return (
        <AppLayout>
            <div className="container mx-auto p-6">
                <div className="flex gap-6">
                    <aside className="w-64 shrink-0">
                        <nav className="space-y-1">
                            {filteredItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = url === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-gray-50 dark:hover:bg-[oklch(0.269_0_0)]'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        </AppLayout>
    );
}
