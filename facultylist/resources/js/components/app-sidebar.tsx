import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LayoutDashboard, Users, LogOut, Building } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { facultyprofile, logout } from '@/routes';
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
                    { title: 'Private HEIs', href: `${admin.facultyList().url}?type=Private` },
                    { title: 'Public HEIs', href: `${admin.facultyList().url}?type=Public` }
                ]
            },
            {
                title: 'HEIs & Accounts',
                href: admin.heisAccounts(),
                icon: Building,
            },
            {
                title: 'Disciplines',
                href: admin.disciplines(),
                icon: BookOpen,
            },
        ]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-0 border-b-0 bg-[#0067ce]">
                <div className="flex w-full items-center text-white h-17 pl-2 pr-0 overflow-hidden">
                    <Link href={facultyprofile()} prefetch className="flex items-center gap-2 group/logo min-w-0">
                        <div className="shrink-0 flex items-center justify-center">
                            <img
                                src="/favicon.svg.png"
                                alt="CHED Logo"
                                className="h-11 w-11 rounded-full bg-white object-contain p-px transition-transform duration-150"
                            />
                        </div>
                        <div className="flex flex-col justify-center min-w-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                            <h1 className="text-[9px] font-bold uppercase leading-tight tracking-wide text-white whitespace-nowrap">
                                Commission on Higher
                            </h1>
                            <p className="text-[8px] font-medium uppercase tracking-wider text-white/90 mt-0.5 whitespace-nowrap">
                                Education
                            </p>
                        </div>
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="text-base pl-3 h-12 px-3 [&>svg]:size-5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-start"
                        >
                            <Link href={logout()} method="post" as="button" className="w-full justify-start cursor-pointer transition-colors">
                                <LogOut />
                                <span className="transition-[max-width,opacity] duration-150 ease-out overflow-hidden whitespace-nowrap max-w-[200px] group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">Log out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}