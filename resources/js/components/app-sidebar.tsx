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
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import roles from '@/routes/roles';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Shield, Users, CreditCard, Calendar, UserCheck, UserCog, Dumbbell, Wallet, BarChart3, Receipt, Wrench, Settings } from 'lucide-react';
import AppLogo from './app-logo';

const navSections = [
    {
        label: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
                permission: null,
            },
        ],
    },
    {
        label: 'Management',
        items: [
            {
                title: 'Members',
                href: '/members',
                icon: Users,
                permission: 'view_members',
            },
            {
                title: 'Trainers',
                href: '/trainers',
                icon: Dumbbell,
                permission: 'view_trainers',
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
        ],
    },
    {
        label: 'Operations',
        items: [
            {
                title: 'Attendance',
                href: '/attendances',
                icon: UserCheck,
                permission: 'view_attendances',
            },
            {
                title: 'Equipment',
                href: '/equipment',
                icon: Wrench,
                permission: 'view_equipment',
            },
        ],
    },
    {
        label: 'Finance',
        items: [
            {
                title: 'Payments',
                href: '/payments',
                icon: Wallet,
                permission: 'view_payments',
            },
            {
                title: 'Expenses',
                href: '/expenses',
                icon: Receipt,
                permission: 'view_expenses',
            },
        ],
    },
    {
        label: 'System',
        items: [
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
                href: '/roles',
                icon: Shield,
                permission: 'view_roles',
            },
        ],
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

    // Filter sections and items based on permissions
    const filteredSections = navSections.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (!item.permission) return true;
            return userPermissions.includes(item.permission);
        }),
    })).filter(section => section.items.length > 0);

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
                {filteredSections.map((section, index) => (
                    <SidebarGroup key={index}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <NavMain items={section.items} />
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
