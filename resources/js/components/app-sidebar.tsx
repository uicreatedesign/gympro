import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import roles from '@/routes/roles';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Shield, Users, CreditCard, Calendar, UserCheck, UserCog, Dumbbell, Wallet, BarChart3 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permission: null,
    },
    {
        title: 'Members',
        href: '/members',
        icon: Users,
        permission: 'view_members',
    },
    {
        title: 'Plans',
        href: '/plans',
        icon: CreditCard,
        permission: 'view_plans',
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: Calendar,
        permission: 'view_subscriptions',
    },
    {
        title: 'Attendance',
        href: '/attendances',
        icon: UserCheck,
        permission: 'view_attendances',
    },
    {
        title: 'Trainers',
        href: '/trainers',
        icon: Dumbbell,
        permission: 'view_trainers',
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: Wallet,
        permission: 'view_payments',
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        permission: 'view_reports',
    },
    {
        title: 'Users',
        href: '/users',
        icon: UserCog,
        permission: 'view_users',
    },
    {
        title: 'Roles & Permissions',
        href: roles.index(),
        icon: Shield,
        permission: 'view_roles',
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userPermissions = auth?.permissions || [];

    // Filter menu items based on permissions
    const filteredNavItems = mainNavItems.filter(item => {
        if (!item.permission) return true; // Always show items without permission requirement
        return userPermissions.includes(item.permission);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
