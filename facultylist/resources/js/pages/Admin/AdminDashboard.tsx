import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import AdminStatsCard from '@/components/admin/dashboard/AdminStatsCard';
import SchoolList from '@/components/admin/dashboard/SchoolList';
import RecentFacultyUpdates from '@/components/admin/dashboard/RecentFacultyUpdates';
import SystemActivity from '@/components/admin/dashboard/SystemActivity';
import AnalyticsOverview from '@/components/admin/dashboard/AnalyticsOverview';


export default function AdminDashboard() {
    const stats = [
        { title: "Total Faculty", value: "128", trend: "+12%" },
        { title: "Total School", value: "128", trend: "+12%" },
    ];

    const recentActivities = [
        { user: "Dr. Sarah Johnson", action: "Updated profile details", time: "2 mins ago" },
        { user: "Prof. Michael Chen", action: "Submitted annual report", time: "1 hour ago" },
        { user: "System", action: "Automated backup completed", time: "5 hours ago" },
        { user: "Dr. Emily Davis", action: "Added new publication", time: "1 day ago" },
    ];

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-8 w-full p-6 md:p-10 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <AdminOverview />

                {/* Analytics Section */}
                <div className="mb-8">
                    <AnalyticsOverview />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Stats & School List */}
                    <div className="flex flex-col gap-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <AdminStatsCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* School List */}
                        <div className="flex-1 min-h-[300px]">
                            <SchoolList />
                        </div>
                    </div>

                    {/* Column 2: Recent Faculty Updates */}
                    <div className="flex flex-col">
                        <RecentFacultyUpdates />
                    </div>

                    {/* Column 3: System Activity */}
                    <div className="flex flex-col">
                        <SystemActivity activities={recentActivities} />
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
