import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItemWithSubmenu extends NavItem {
    submenu?: NavItem[];
}

export function NavMain({ items = [] }: { items: NavItemWithSubmenu[] }) {
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    useEffect(() => {
        items.forEach((item) => {
            if (item.submenu) {
                const isOnParent = page.url.startsWith(resolveUrl(item.href));
                const isOnChild = item.submenu.some(sub => page.url.startsWith(resolveUrl(sub.href)));
                if (isOnParent || isOnChild) {
                    setExpandedItems(prev => prev.includes(item.title) ? prev : [...prev, item.title]);
                }
            }
        });
    }, [page.url]);

    const toggleExpanded = (title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    {item.submenu ? (
                        <>
                            <div className="relative">
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(
                                        resolveUrl(item.href),
                                    )}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                                <button
                                    onClick={(e) => toggleExpanded(item.title, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                >
                                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedItems.includes(item.title) ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                            {expandedItems.includes(item.title) && (
                                <SidebarMenuSub>
                                    {item.submenu.map((subitem) => (
                                        <SidebarMenuSubItem key={subitem.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={page.url.startsWith(
                                                    resolveUrl(subitem.href),
                                                )}
                                            >
                                                <Link href={subitem.href} prefetch>
                                                    <span>{subitem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </>
                    ) : (
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    )}
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
