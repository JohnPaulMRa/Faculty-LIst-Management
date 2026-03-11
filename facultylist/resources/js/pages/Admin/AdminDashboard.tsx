import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import AdminStatsCard from '@/components/admin/dashboard/AdminStatsCard';
import SchoolList from '@/components/admin/dashboard/SchoolList';
import RecentFacultyUpdates from '@/components/admin/dashboard/RecentFacultyUpdates';
import SystemActivity from '@/components/admin/dashboard/SystemActivity';
import { AnalyticsOverview, StatusOverview } from '@/components/admin/dashboard/AnalyticsOverview';

interface DashboardSchool {
    id: number;
    name: string;
    faculty: number;
    status: string;
}

interface DashboardStat {
    title: string;
    value: string;
    trend?: string;
    subtext?: string;
}

interface DashboardActivity {
    user: string;
    action: string;
    time: string;
}

interface DistributionItem {
    name: string;
    count: number;
}

interface StatusItem {
    name: string;
    value: number;
    color: string;
}

interface UpdateItem {
    id: string | number;
    user: string;
    action: string;
    type: string;
    time: string;
}

interface AdminDashboardProps {
    schools: DashboardSchool[];
    stats: DashboardStat[];
    recentActivities: DashboardActivity[];
    distributionData: DistributionItem[];
    statusData: StatusItem[];
    disciplineUpdates: UpdateItem[];
}

export default function AdminDashboard({
    schools = [],
    stats = [],
    recentActivities = [],
    distributionData = [],
    statusData = [],
    disciplineUpdates = []
}: AdminDashboardProps) {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-8 w-full p-6 md:p-10 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <AdminOverview />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats & School List */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <AdminStatsCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* School List */}
                        <div className="flex-1 min-h-[300px]">
                            <SchoolList schools={schools} />
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="flex flex-col">
                        <StatusOverview statusData={statusData} />
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="mt-8">
                    <AnalyticsOverview
                        distributionData={distributionData}
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
}
