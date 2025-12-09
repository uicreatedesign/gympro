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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Calendar, ShoppingCart } from 'lucide-react';
import AppLogo from '../app-logo';

const memberNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/member/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Attendance',
        href: '/member/attendance',
        icon: Calendar,
    },
    {
        title: 'Buy Plans',
        href: '/member/plans',
        icon: ShoppingCart,
    },
];

const footerNavItems: NavItem[] = [];

export function MemberSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/member/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={memberNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
