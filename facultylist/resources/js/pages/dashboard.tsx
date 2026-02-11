import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Briefcase, 
    RefreshCw,
    Calendar
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AcademicYearSelect from '@/components/common/AcademicYearSelect';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

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

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedNumber = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const timer = setInterval(() => {
            start += Math.ceil(end / 100); // Increment by 1% of total or 1
            if (start > end) start = end;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, 10); // Prevent infinity

        return () => clearInterval(timer);
    }, [value]);

    return React.createElement('span', null, count);
};

export default function Dashboard({ overview }: DashboardProps) {
    // For now, using the same data for both terms since backend filtering isn't implemented per-term yet
    const [selectedYear, setSelectedYear] = useState<string>('2024-2025');
    const [animateCharts, setAnimateCharts] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, value: number, series: string } | null>(null);

    // Use the real data from controller
    const data = overview;

    // Trigger chart animations on load or term change
    useEffect(() => {
        // Use timeout to avoid synchronous state update warning
        const timer1 = setTimeout(() => setAnimateCharts(false), 0);
        const timer2 = setTimeout(() => setAnimateCharts(true), 100);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [selectedYear]);

    // Handle Refresh Interaction (In a real app, this might re-fetch data)
    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate reload or use Inertia to reload
        setTimeout(() => setIsLoading(false), 800);
        window.location.reload(); 
    };

    // Derived Calculations
    const trends = data.employmentTrends;
    const hasTrends = trends && trends.years.length > 0;
    const allValues = hasTrends ? trends!.series.flatMap(s => s.data) : [];
    const maxVal = Math.max(...allValues, 5);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:px-8 w-full text-[#1b1b18] dark:text-[#EDEDEC] transition-colors duration-300">
                
                {/* --- HEADER WITH CONTROLS --- */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-[#003468] to-blue-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                            Faculty Overview
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Faculty metrics and workload analytics for <span className="font-semibold text-[#003468] dark:text-white">Academic Year {selectedYear}</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Term Switcher with Sliding Background */}
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Academic Year:
                             </span>
                             <AcademicYearSelect 
                                value={selectedYear} 
                                onValueChange={setSelectedYear} 
                                className="w-[180px] bg-white dark:bg-[#18181b] border-gray-200 dark:border-gray-800"
                             />
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
                <div className="mb-6">
                    {/* 1. Total Faculty */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]"
                    >
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
                    </motion.div>
                </div>

                {/* --- DETAILED CHARTS GRID --- */}
                <div className="grid gap-6 grid-cols-1">

                    {/* 5. Employment Status Trends (Line Graph) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#18181b]"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <Briefcase className="h-4 w-4 text-gray-500" /> Employment Status
                            </h3>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400">Academic Year</span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            {/* Legend */}
                            <div className="mb-6 flex flex-wrap gap-4 justify-center">
                                {hasTrends && trends!.series.map((s) => (
                                    <div key={s.name} className="flex items-center gap-2 text-xs">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                                        <span className="text-gray-600 dark:text-gray-400">{s.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Line Chart Area */}
                            <div className="relative h-64 w-full" onMouseLeave={() => setHoveredPoint(null)}>
                                {hasTrends && trends ? (
                                    <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        
                                        {/* Definitions for Gradients */}
                                        <defs>
                                            {trends.series.map((series, i) => (
                                                <linearGradient key={`grad-${i}`} id={`gradient-${i}`} x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor={series.color} stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor={series.color} stopOpacity="0" />
                                                </linearGradient>
                                            ))}
                                        </defs>

                                        {/* Grid Lines */}
                                        {[0, 25, 50, 75, 100].map((y) => (
                                            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-100 dark:text-gray-800" vectorEffect="non-scaling-stroke" />
                                        ))}

                                        {/* Series Paths and Areas */}
                                        {trends.series.map((series, sIndex) => {
                                            // Calculate points for the line
                                            let lastX = 0;
                                            let firstX = 0;
                                            
                                            const points = series.data.map((val: number, i: number) => {
                                                const yearsLength = trends.years.length;
                                                // Center if single point, otherwise distribute properly
                                                const x = yearsLength === 1 ? 50 : (i / (yearsLength - 1)) * 100;
                                                const y = 100 - (val / maxVal) * 100;
                                                
                                                if (i === 0) firstX = x;
                                                if (i === series.data.length - 1) lastX = x;
                                                
                                                return `${x},${y}`;
                                            }).join(' ');

                                            // Close the path for area fill: Go down from last point, then across to first point's x, then up
                                            const areaPoints = `${points} ${lastX},100 ${firstX},100`;

                                            return (
                                                <g key={series.name}>
                                                    {/* Area Fill */}
                                                    <path 
                                                        d={`M ${areaPoints}`} 
                                                        fill={`url(#gradient-${sIndex})`}
                                                        className={animateCharts ? 'animate-fade-in' : 'opacity-0'}
                                                        style={{ transition: `opacity 1s ease-out ${sIndex * 0.2}s` }}
                                                    />
                                                    {/* Line */}
                                                    <path 
                                                        d={`M ${points}`} 
                                                        fill="none" 
                                                        stroke={series.color} 
                                                        strokeWidth="2" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        vectorEffect="non-scaling-stroke"
                                                        className={animateCharts ? 'animate-draw' : ''}
                                                        style={{ 
                                                            strokeDasharray: 1000, 
                                                            strokeDashoffset: animateCharts ? 0 : 1000, 
                                                            transition: `stroke-dashoffset 2s ease-out ${sIndex * 0.2}s` 
                                                        }}
                                                    />
                                                </g>
                                            );
                                        })}
                                    </svg>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">No trend data available</div>
                                )}
                                
                                {/* HTML Points Overlay */}
                                {hasTrends && trends!.series.map((series, sIndex) => (
                                    <div key={`points-${series.name}`} className="absolute inset-0 pointer-events-none">
                                        {series.data.map((val: number, i: number) => {
                                            const yearsLength = trends!.years.length;
                                            const x = (i / (yearsLength - 1 || 1)) * 100;
                                            const y = 100 - (val / maxVal) * 100;
                                            return (
                                                <div 
                                                    key={i}
                                                    className="absolute h-3 w-3 rounded-full border-2 border-white pointer-events-auto cursor-pointer opacity-0 transition-all duration-300 hover:scale-125 hover:opacity-100"
                                                    style={{ 
                                                        left: `${x}%`, 
                                                        top: `${y}%`,
                                                        backgroundColor: series.color,
                                                        transform: 'translate(-50%, -50%)',
                                                        opacity: animateCharts ? 1 : 0, 
                                                        transitionDelay: `${1 + (sIndex * 0.1) + (i * 0.05)}s` 
                                                    }}
                                                    onMouseEnter={() => setHoveredPoint({ x, y, value: val, series: series.name })}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}

                                {/* Custom Tooltip */}
                                <AnimatePresence>
                                    {hoveredPoint && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-xl dark:bg-white dark:text-gray-900 pointer-events-none"
                                            style={{
                                                left: `${hoveredPoint.x}%`,
                                                top: `${hoveredPoint.y}%`,
                                                transform: 'translate(-50%, -150%)',
                                                marginTop: '-12px'
                                            }}
                                        >
                                            <div className="font-semibold">{hoveredPoint.series}</div>
                                            <div>{hoveredPoint.value} Faculty</div>
                                            <div className="absolute bottom-0 left-1/2 -mb-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-white"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                {/* X-Axis Labels */}
                                <div className="absolute inset-x-0 bottom-0 top-[102%] flex justify-between text-[10px] text-gray-400">
                                    {hasTrends && trends!.years.map((year: string, i: number) => (
                                        <span key={i}>{year}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </AppLayout>
    );
}