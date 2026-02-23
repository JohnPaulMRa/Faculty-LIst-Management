import { Link, usePage } from '@inertiajs/react';
import { Monitor, Menu, BookOpen, User, UserCog, LogOut } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, facultyprofile, logout } from '@/routes';
import type { BreadcrumbItem, NavItem, SharedData } from '@/types';
import AppLogoIcon from './app-logo-icon';



type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: Monitor,
    },
    {
        title: 'Faculty Profile',
        href: facultyprofile(),
        icon: UserCog,
    },
];

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="flex w-full flex-col font-sans">

            {/* --- TOP BAR: Dark Blue Background --- */}
            <header className="w-full bg-[#003468] text-white">
                <div className="mx-auto flex h-19 w-full items-center justify-between px-6 lg:px-20">

                    {/* LEFT: Logo & Text */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/favicon.svg.png"
                            alt="CHED Logo"
                            className="h-14 w-14 rounded-full bg-white object-contain p-0.5"
                        />
                        <div className="flex flex-col justify-center">
                            <h1 className="text-sm font-bold uppercase leading-tight tracking-wide md:text-base">
                                Commission on Higher Education
                            </h1>
                            <p className="text-[10px] font-medium uppercase tracking-wider opacity-80 md:text-xs">
                                Faculty List Profile
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Username (Just Text, like the reference) */}
                    <div className="hidden text-sm font-medium md:block opacity-90">
                        {auth.user.name}
                    </div>
                </div>
            </header>

            {/* --- BOTTOM BAR: White/Light Background --- */}
            <div className="border-b border-gray-200 bg-white shadow-sm dark:bg-sidebar dark:border-sidebar-border">
                <div className="mx-auto flex h-14 w-full items-center justify-between px-4 lg:px-20">

                    {/* LEFT: Navigation Links or Breadcrumbs */}
                    <div className="flex items-center gap-4">

                        {/* Mobile Menu Trigger (Visible only on small screens) */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 bg-sidebar p-0">
                                    <SheetHeader className="p-4 text-left border-b border-sidebar-border">
                                        <SheetTitle className="flex items-center gap-2">
                                            <AppLogoIcon className="h-6 w-6" />
                                            <span className="text-sm font-bold">CHED XII</span>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col space-y-1 p-2">
                                        {mainNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                    isCurrentUrl(item.href)
                                                        ? "bg-sidebar-accent text-sidebar-primary"
                                                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                                )}
                                            >
                                                {item.icon && <item.icon className="h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Show breadcrumbs if present, otherwise show navigation tabs */}
                        {breadcrumbs.length > 1 ? (
                            <div className="hidden lg:block">
                                <Breadcrumbs breadcrumbs={breadcrumbs} />
                            </div>
                        ) : (
                            <nav className="hidden items-center gap-1 lg:flex">
                                {mainNavItems.map((item) => {
                                    const active = isCurrentUrl(item.href);
                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-4 py-2 text-[15px] font-medium transition-all",
                                                active
                                                    ? "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300"
                                                    : "text-gray-800 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            {item.icon && <item.icon className={cn("h-4.5 w-4.5 md:h-[18px] md:w-[18px]", active ? "text-blue-600" : "text-gray-500")} />}
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </div>

                    {/* RIGHT: Tools & User Dropdown */}
                    <div className="flex items-center gap-4">
                        {/* Static User Manual Link
                        <a href="#" className="hidden items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#003468] md:flex">
                            <BookOpen className="h-4 w-4" />
                            <span>User Guide</span>
                        </a>
                         */}

                        {/* Divider */}
                        <div className="hidden h-5 w-px bg-gray-300 md:block" />

                        {/* Avatar / Logout Menu */}
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}