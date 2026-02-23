import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LayoutDashboard, Users } from 'lucide-react';
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
import { facultyprofile } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Faculty Profile',
        href: facultyprofile(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const navItems = user.role === 'Admin'
        ? [
            {
                title: 'Admin Dashboard',
                href: admin.dashboard(),
                icon: LayoutDashboard,
            },
            {
                title: 'Faculty List',
                href: admin.facultyList(),
                icon: Users,
                items: [
                    { title: 'Private Schools', href: `${admin.facultyList().url}?type=Private` },
                    { title: 'Public Schools', href: `${admin.facultyList().url}?type=Public` }
                ]
            },
            {
                title: 'Disciplines',
                href: admin.disciplines(),
                icon: BookOpen,
            },
        ]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={facultyprofile()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
