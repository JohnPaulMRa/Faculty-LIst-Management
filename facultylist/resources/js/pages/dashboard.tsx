import { Head } from '@inertiajs/react';
import { 
    Users, 
    Award, 
    Briefcase, 
    BookOpen, 
    GraduationCap,
    TrendingUp,
    Filter,
    MoreHorizontal,
    RefreshCw
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// --- MOCK DATA SETS (For Interactivity) ---
const dataSets = {
    '1st Sem': {
        totalFaculty: 3,
        licensedFaculty: 2,
        employment: { fullTime: 2, partTime: 1 },
        qualifications: [
            { label: 'Doctorate', count: 1, color: 'bg-purple-500', text: 'text-purple-600' },
            { label: 'Masters', count: 1, color: 'bg-blue-500', text: 'text-blue-600' },
            { label: 'Bachelors', count: 1, color: 'bg-emerald-500', text: 'text-emerald-600' },
        ],
        teachingLoad: { regular: 1, overload: 1, underload: 1 }
    },
    '2nd Sem': {
        totalFaculty: 3,
        licensedFaculty: 2,
        employment: { fullTime: 2, partTime: 1 },
        qualifications: [
            { label: 'Doctorate', count: 1, color: 'bg-purple-500', text: 'text-purple-600' },
            { label: 'Masters', count: 1, color: 'bg-blue-500', text: 'text-blue-600' },
            { label: 'Bachelors', count: 1, color: 'bg-emerald-500', text: 'text-emerald-600' },
        ],
        teachingLoad: { regular: 1, overload: 1, underload: 1 }
    }
};

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedNumber = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const totalMilSecDur = 1000;
        const incrementTime = (totalMilSecDur / end) * 2;

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, Math.max(incrementTime, 10)); // Prevent infinity

        return () => clearInterval(timer);
    }, [value]);

    return React.createElement('span', null, count);
};

export default function Dashboard() {
    const [selectedTerm, setSelectedTerm] = useState<'1st Sem' | '2nd Sem'>('1st Sem');
    const [animateCharts, setAnimateCharts] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const data = dataSets[selectedTerm];

    // Trigger chart animations on load or data change
    useEffect(() => {
        const raf = requestAnimationFrame(() => setAnimateCharts(false));
        const timer = setTimeout(() => setAnimateCharts(true), 100);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(timer);
        };
    }, [selectedTerm]);

    // Handle Refresh Interaction
    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    // Derived Calculations
    const ftPercentage = Math.round((data.employment.fullTime / data.totalFaculty) * 100);
    const licensePercentage = Math.round((data.licensedFaculty / data.totalFaculty) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            {/* FIX APPLIED HERE:
               - Removed "max-w-7xl"
               - Removed "mx-auto"
               - Added "w-full"
               - Adjusted padding to "p-4 md:px-8" to align with full-width headers
            */}
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:px-8 w-full text-[#1b1b18] dark:text-[#EDEDEC] transition-colors duration-300">
                
                {/* --- HEADER WITH CONTROLS --- */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-[#003468] to-blue-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                            Faculty Overview
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Faculty metrics and workload analytics for <span className="font-semibold text-[#003468] dark:text-white">{selectedTerm === '1st Sem' ? '1st Semester 2024-2025' : '2nd Semester 2023-2024'}</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Term Switcher */}
                        <div className="relative inline-flex h-9 items-center rounded-lg bg-gray-100 p-1 dark:bg-[#18181b] border border-gray-200 dark:border-gray-800">
                            {(['1st Sem', '2nd Sem'] as const).map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSelectedTerm(term)}
                                    className={`relative z-10 inline-flex h-full items-center justify-center whitespace-nowrap rounded-md px-4 text-xs font-medium transition-all ${
                                        selectedTerm === term
                                            ? 'bg-white text-[#003468] shadow-sm dark:bg-gray-800 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                                    }`}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>

                        {/* Refresh Button */}
                        <button 
                            onClick={handleRefresh}
                            className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${isLoading ? 'animate-spin text-blue-600' : 'text-gray-500'}`}
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* --- TOP METRICS GRID --- */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    
                    {/* 1. Total Faculty */}
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-50 transition-all group-hover:scale-150 dark:bg-blue-900/10"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-900/20 dark:text-blue-400">
                                <Users className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Faculty</p>
                                <h3 className="text-3xl font-bold text-[#003468] dark:text-white">
                                    <AnimatedNumber value={data.totalFaculty} />
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* 2. Licensed Faculty */}
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-50 transition-all group-hover:scale-150 dark:bg-amber-900/10"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-900/20 dark:text-amber-400">
                                <Award className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Licensed</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold text-[#003468] dark:text-white">
                                        <AnimatedNumber value={data.licensedFaculty} />
                                    </h3>
                                    <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full dark:bg-green-900/30">
                                        <TrendingUp className="mr-1 h-3 w-3" /> {licensePercentage}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Overloaded Faculty */}
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-50 transition-all group-hover:scale-150 dark:bg-red-900/10"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm dark:bg-red-900/20 dark:text-red-400">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overloaded</p>
                                <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    <AnimatedNumber value={data.teachingLoad.overload} />
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* 4. Full-Time Staff */}
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-50 transition-all group-hover:scale-150 dark:bg-emerald-900/10"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-400">
                                <Briefcase className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full-Time</p>
                                <h3 className="text-3xl font-bold text-[#003468] dark:text-white">
                                    <AnimatedNumber value={data.employment.fullTime} />
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- DETAILED CHARTS GRID --- */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* 5. Employment Status (Animated Donut) */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <Briefcase className="h-4 w-4 text-gray-500" /> Employment Status
                            </h3>
                            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="h-4 w-4" /></button>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center p-6">
                            <div className="relative flex h-48 w-48 items-center justify-center">
                                {/* SVG Ring */}
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    {/* Track */}
                                    <circle className="text-gray-100 dark:text-gray-800" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    {/* Full Time Segment */}
                                    <circle 
                                        className="text-emerald-500 transition-all duration-1500ms ease-out dark:text-emerald-400" 
                                        strokeWidth="10" 
                                        strokeDasharray={animateCharts ? `${ftPercentage * 2.51} 251` : "0 251"} 
                                        strokeLinecap="round" 
                                        stroke="currentColor" 
                                        fill="transparent" 
                                        r="40" 
                                        cx="50" 
                                        cy="50" 
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{ftPercentage}%</span>
                                    <span className="text-xs font-medium uppercase text-gray-400">Regular</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 grid w-full grid-cols-2 gap-4">
                                <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-900/10">
                                    <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Full-Time</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white"><AnimatedNumber value={data.employment.fullTime} /></p>
                                </div>
                                <div className="rounded-xl bg-orange-50 p-3 text-center dark:bg-orange-900/10">
                                    <p className="text-xs font-semibold uppercase text-orange-600 dark:text-orange-400">Part-Time</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white"><AnimatedNumber value={data.employment.partTime} /></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Qualification Levels (Animated Bars) */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <GraduationCap className="h-4 w-4 text-gray-500" /> Qualifications
                            </h3>
                            <Filter className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-6 p-6">
                            {data.qualifications.map((qual, index) => (
                                <div key={qual.label} className="group cursor-pointer">
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="font-medium text-gray-700 transition-colors group-hover:text-[#003468] dark:text-gray-300 dark:group-hover:text-white">{qual.label}</span>
                                        <span className={`font-bold ${qual.text}`}>
                                            <AnimatedNumber value={qual.count} />
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div 
                                            className={`h-full rounded-full ${qual.color} transition-all duration-1200ms ease-out`} 
                                            style={{ 
                                                width: animateCharts ? `${(qual.count / data.totalFaculty) * 100}%` : '0%',
                                                transitionDelay: `${index * 150}ms`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 7. Teaching Load Summary (Status Cards) */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <BookOpen className="h-4 w-4 text-gray-500" /> Workload Summary
                            </h3>
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-4 p-6">
                            {/* Regular Load */}
                            <div className="relative overflow-hidden rounded-xl border border-green-100 bg-green-50/50 p-4 transition-all hover:bg-green-50 dark:border-green-900/30 dark:bg-green-900/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">Regular Load</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-700 dark:text-green-400">
                                        <AnimatedNumber value={data.teachingLoad.regular} />
                                    </span>
                                </div>
                            </div>

                            {/* Overload */}
                            <div className="relative overflow-hidden rounded-xl border border-red-100 bg-red-50/50 p-4 transition-all hover:bg-red-50 dark:border-red-900/30 dark:bg-red-900/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">Overload</span>
                                    </div>
                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                        <AnimatedNumber value={data.teachingLoad.overload} />
                                    </span>
                                </div>
                            </div>

                            {/* Underload */}
                            <div className="relative overflow-hidden rounded-xl border border-amber-100 bg-amber-50/50 p-4 transition-all hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">Underload</span>
                                    </div>
                                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                        <AnimatedNumber value={data.teachingLoad.underload} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}