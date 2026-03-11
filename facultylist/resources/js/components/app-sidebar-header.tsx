import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-17 shrink-0 items-center justify-between gap-5 border-b border-sidebar-border/50 px-6 transition-[width,height] duration-100 ease-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-17 md:px-7 bg-[#0067ce]">
            <div className="flex items-center gap-5 text-white">
                <SidebarTrigger className="-ml-1 h-8 w-8 text-white [&>svg]:size-5 rounded-md">
                    <Menu />
                </SidebarTrigger>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center">
                <NavUser />
            </div>
        </header>
    );
}