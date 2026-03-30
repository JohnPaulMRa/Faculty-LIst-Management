import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import FacultyOverview from '@/components/faculty/dashboard/FacultyOverview';
import FacultyStats from '@/components/faculty/dashboard/FacultyStats';
import FacultyTrends from '@/components/faculty/dashboard/FacultyTrends';

const breadcrumbs: BreadcrumbItem[] = [];

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
    selectedYear: string;
    availableYears: string[];
    schoolType?: string;
}

export default function Dashboard({ overview, selectedYear: initialYear, availableYears = [], schoolType }: DashboardProps) {
    const [selectedYear, setSelectedYear] = useState<string>(initialYear);
    const [isLoading, setIsLoading] = useState(false);

    // Sync selectedYear when server sends a new value (after navigation)
    useEffect(() => {
        setSelectedYear(initialYear);
    }, [initialYear]);

    // Use the real data from controller
    const data = overview;

    const handleRefresh = () => {
        setIsLoading(true);
        router.reload({
            only: ['overview', 'selectedYear'],
            onFinish: () => setIsLoading(false),
        });
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        setIsLoading(true);
        router.visit(dashboard().url, {
            data: { year: year === 'All Years' ? '' : year },
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:px-10 w-full  text-[#1b1b18] dark:text-[#EDEDEC] transition-colors duration-300 min-h-screen">

                <FacultyOverview
                    selectedYear={selectedYear}
                    onYearChange={handleYearChange}
                    onRefresh={handleRefresh}
                    isLoading={isLoading}
                    availableYears={availableYears}
                />

                <FacultyStats stats={data} />

                {data.employmentTrends && data.employmentTrends.years.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        <FacultyTrends trends={data.employmentTrends} schoolType={schoolType} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
