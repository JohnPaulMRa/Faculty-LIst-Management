import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    const [openStates, setOpenStates] = useState<Record<string, boolean>>(() => {
        let parsed: Record<string, boolean> = {};
        if (typeof window !== 'undefined') {
            try {
                const saved = sessionStorage.getItem('sidebar-open-states');
                if (saved) parsed = JSON.parse(saved);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_e) {
                // ignore
            }
        }

        const initial = { ...parsed };
        items.forEach(item => {
            if (item.items && item.items.length > 0) {
                const isActive = (item.href && isCurrentUrl(item.href)) || item.items.some(sub => isCurrentUrl(sub.href));
                if (isActive) {
                    initial[item.title] = true;
                } else if (initial[item.title] === undefined) {
                    initial[item.title] = false;
                }
            }
        });
        return initial;
    });

    const handleOpenChange = (title: string, open: boolean) => {
        setOpenStates(prev => {
            const next = { ...prev, [title]: open };
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                try { sessionStorage.setItem('sidebar-open-states', JSON.stringify(next)); } catch (_e) { /* ignore */ }
            }
            return next;
        });
    };

    return (
        <SidebarGroup className="px-2 py-2 pl-3">

            <SidebarMenu>
                {items.map((item) => (
                    item.items && item.items.length > 0 ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={openStates[item.title] || false}
                            onOpenChange={(open) => handleOpenChange(item.title, open)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isCurrentUrl(item.href) || item.items.some(sub => isCurrentUrl(sub.href))}
                                        className="text-base h-12 px-3 [&>svg]:size-5 hover:bg-sidebar-black hover:text-sidebar-black-foreground data-[active=true]:bg-sidebar-black data-[active=true]:text-sidebar-black-foreground transition-colors group-data-[collapsible=icon]:justify-start"
                                    >
                                        {item.icon && <item.icon />}
                                        <span className="transition-[max-width,opacity] duration-100 ease-linear overflow-hidden whitespace-nowrap max-w-[200px] group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                                        <ChevronRight className="ml-auto transition-all duration-100 ease-linear group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:overflow-hidden" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(subItem.href)} className="text-base h-10 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium transition-colors">
                                                    <Link href={subItem.href}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                                className="text-base h-12 px-3 [&>svg]:size-5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-start"
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span className="transition-[max-width,opacity] duration-100 ease-linear overflow-hidden whitespace-nowrap max-w-[200px] group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
