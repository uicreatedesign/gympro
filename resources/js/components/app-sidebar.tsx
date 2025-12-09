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
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Shield, Users, CreditCard, Calendar, UserCheck, UserCog, Dumbbell, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Members',
        href: '/members',
        icon: Users,
    },
    {
        title: 'Plans',
        href: '/plans',
        icon: CreditCard,
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: Calendar,
    },
    {
        title: 'Attendance',
        href: '/attendances',
        icon: UserCheck,
    },
    {
        title: 'Trainers',
        href: '/trainers',
        icon: Dumbbell,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: Wallet,
    },
    {
        title: 'Users',
        href: '/users',
        icon: UserCog,
    },
    {
        title: 'Roles & Permissions',
        href: roles.index(),
        icon: Shield,
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
