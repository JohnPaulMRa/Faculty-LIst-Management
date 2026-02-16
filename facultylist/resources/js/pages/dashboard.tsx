import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import FacultyOverview from '@/components/faculty/dashboard/FacultyOverview';
import FacultyStats from '@/components/faculty/dashboard/FacultyStats';
import FacultyTrends from '@/components/faculty/dashboard/FacultyTrends';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// --- INTERFACES ---
interface DashboardStats {
    totalFaculty: number;
    licensedFaculty: number;
    employment: {
        fullTime: number;
        partTime: number;
    };
    gender: {
        male: number;
        female: number;
    };
    status: {
        updated: number;
        notUpdated: number;
    };
    qualifications: {
        label: string;
        count: number;
        color: string;
        text: string;
    }[];
    teachingLoad: {
        regular: number;
        overload: number;
        underload: number;
    };
    employmentTrends?: {
        years: string[];
        series: {
            name: string;
            color: string;
            data: number[];
        }[];
    };
}

interface DashboardProps {
    overview: DashboardStats;
}

export default function Dashboard({ overview }: DashboardProps) {
    const [selectedYear, setSelectedYear] = useState<string>('2024-2025');
    const [isLoading, setIsLoading] = useState(false);

    // Use the real data from controller
    const data = overview;

    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate reload or use Inertia to reload
        setTimeout(() => setIsLoading(false), 800);
        window.location.reload();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:px-10 w-full bg-gray-50 text-[#1b1b18] dark:text-[#EDEDEC] transition-colors duration-300 min-h-screen">

                <FacultyOverview
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                />

                <FacultyStats stats={data} />

                {data.employmentTrends && data.employmentTrends.years.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        <FacultyTrends trends={data.employmentTrends} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}