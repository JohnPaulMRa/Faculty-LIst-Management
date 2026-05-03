import { Head } from '@inertiajs/react';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';

import { AnalyticsOverview, StatusOverview, HEIDistributionTable } from '@/components/admin/dashboard/AnalyticsOverview';
import SchoolList from '@/components/admin/dashboard/SchoolList';
import SubmittedHeisList from '@/components/admin/dashboard/SubmittedHeisList';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

interface DashboardSchool {
    id: number;
    name: string;
    faculty: number;
    status: string;
}




interface DistributionItem {
    name: string;
    baccalaureate: number;
    master: number;
    doctorate: number;
    preBaccalaureate: number;
    unclassified: number;
    count: number;
}

interface DistributionTotals {
    baccalaureate: number;
    master: number;
    doctorate: number;
    preBaccalaureate: number;
    unclassified: number;
    overall: number;
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
    totals?: DistributionTotals;
    statusData: StatusItem[];
    heiDistributionData: any[];
    recentSubmissions: Submission[];
    academicYears?: string[];
    selectedYearDiscipline?: string;
    selectedYearHei?: string;
}

export default function AdminDashboard({
    heis = [],
    distributionData = [],
    totals = { baccalaureate: 0, master: 0, doctorate: 0, preBaccalaureate: 0, unclassified: 0, overall: 0 },
    statusData = [],
    heiDistributionData = [],
    recentSubmissions = [],
    academicYears = [],
    selectedYearDiscipline,
    selectedYearHei
}: AdminDashboardProps) {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-8 w-full p-6 md:p-10 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <AdminOverview />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Row: Submissions and Status */}
                    <div className="lg:col-span-2">
                        <SubmittedHeisList recentSubmissions={recentSubmissions} />
                    </div>
                    <div className="lg:col-span-1">
                        <StatusOverview />
                    </div>

                    {/* Bottom Row: Distribution Analytics */}
                    <div className="lg:col-span-2">
                        <AnalyticsOverview
                            distributionData={distributionData}
                            totals={totals}
                            academicYears={academicYears}
                            selectedAcademicYear={selectedYearDiscipline}
                            queryParamName="year_discipline"
                        />
                    </div>
                    <div className="lg:col-span-1 relative min-h-[500px]">
                        <div className="absolute inset-0">
                            <HEIDistributionTable 
                                data={heiDistributionData} 
                                academicYears={academicYears}
                                selectedAcademicYear={selectedYearHei}
                                queryParamName="year_hei"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}

