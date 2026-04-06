import { Head } from '@inertiajs/react';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import AdminStatsCard from '@/components/admin/dashboard/AdminStatsCard';
import { AnalyticsOverview, StatusOverview } from '@/components/admin/dashboard/AnalyticsOverview';
import SubmittedHeisList from '@/components/admin/dashboard/SubmittedHeisList';
import SchoolList from '@/components/admin/dashboard/SchoolList';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface DashboardSchool {
    id: number;
    name: string;
    faculty: number;
    status: string;
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



interface Submission {
    id: number;
    hei_id: number;
    hei_name: string;
    academic_year: string;
    total_faculty: number;
    type: string;
    submitted_by: string;
    time: string;
    date: string;
}

interface AdminDashboardProps {
    heis: DashboardSchool[];
    distributionData: DistributionItem[];
    statusData: StatusItem[];
    recentSubmissions: Submission[];
}

export default function AdminDashboard({
    heis = [],
    distributionData = [],
    statusData = [],
    recentSubmissions = []
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

                        {/* School List */}
                        <div className="flex-1 min-h-[300px]">
                            <SchoolList schools={heis} />
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="flex flex-col">
                        <StatusOverview statusData={statusData} />
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <AnalyticsOverview
                        distributionData={distributionData}
                    />
                    <SubmittedHeisList recentSubmissions={recentSubmissions} />
                </div>
            </div>
        </AppSidebarLayout>
    );
}
