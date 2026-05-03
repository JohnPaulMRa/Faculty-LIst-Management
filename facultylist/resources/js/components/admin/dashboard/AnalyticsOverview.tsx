import { BarChart3, Calendar as CalendarIcon, ChevronLeft, ChevronRight, GraduationCap, Award, BookOpen, User, FolderArchive } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

interface AnalyticsOverviewProps {
    distributionData: DistributionItem[];
    totals?: DistributionTotals;
    academicYears?: string[];
    selectedAcademicYear?: string;
    queryParamName?: string;
}

const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((acc: number, entry: any) => acc + entry.value, 0);

        return (
            <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200 shadow-xl rounded-2xl text-xs min-w-[220px] animate-in fade-in duration-200">
                <div className="font-bold text-slate-900 mb-3 uppercase tracking-tight border-b border-slate-100 pb-2">
                    {label}
                </div>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => {
                        if (entry.value === 0) return null;
                        const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
                        return (
                            <div key={index} className="flex justify-between items-center text-slate-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: entry.color }} />
                                    <span>{entry.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-slate-900">{entry.value}</span>
                                    <span className="text-slate-400 text-[10px] w-8 text-right">({percentage}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between items-center text-slate-700 font-black bg-slate-50 p-2 mt-3 rounded-lg border border-slate-100">
                    <span>Total Programs:</span>
                    <span className="text-blue-600">{total}</span>
                </div>
            </div>
        );
    }
    return null;
};

export function AnalyticsOverview({
    distributionData = [],
    totals = { baccalaureate: 0, master: 0, doctorate: 0, preBaccalaureate: 0, unclassified: 0, overall: 0 },
    academicYears = [],
    selectedAcademicYear,
    queryParamName = 'academic_year'
}: AnalyticsOverviewProps) {

    const columns = [
        { key: 'baccalaureate', label: 'Baccalaureate' },
        { key: 'doctorate', label: 'Doctorate' },
        { key: 'master', label: 'Master' },
        { key: 'preBaccalaureate', label: 'Pre-Bacc' },
    ];

    const sortedData = useMemo(() => {
        return distributionData
            .filter(d => d.name !== '#N/A')
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [distributionData]);

    const grandTotal = totals.overall;

    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                                Discipline Groups Distribution
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-0.5">
                                Count of faculty by discipline group and degree level
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {academicYears.length > 0 && (
                            <select
                                className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedAcademicYear || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.set(queryParamName, e.target.value);
                                    
                                    const data: any = {};
                                    params.forEach((value, key) => { data[key] = value; });
                                    
                                    router.get(route('admin.dashboard'), data, { preserveState: true, preserveScroll: true, replace: true });
                                }}
                            >
                                <option value="">All Academic Years</option>
                                {academicYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-700 text-white">
                            <th className="text-left px-4 py-4 text-sm font-bold uppercase tracking-wider w-[45%]">
                                Row Labels
                            </th>
                            {columns.map(col => (
                                <th key={col.key} className="text-right px-4 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                                     {col.label}
                                 </th>
                            ))}
                            <th className="text-right px-4 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap bg-slate-900">
                                Grand Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                                    No data available for the selected academic year.
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((row, idx) => {
                                const rowTotal = columns.reduce((sum, col) => sum + ((row as any)[col.key] || 0), 0);
                                const isEmpty = rowTotal === 0;
                                return (
                                    <tr
                                        key={row.name}
                                        className={cn(
                                            'border-b border-gray-100 transition-colors',
                                            isEmpty
                                                ? 'bg-white hover:bg-gray-50'
                                                : idx % 2 === 0
                                                    ? 'bg-blue-50/20 hover:bg-blue-50/60'
                                                    : 'bg-white hover:bg-blue-50/60'
                                        )}
                                    >
                                        <td className="px-4 py-4 text-sm font-bold text-slate-900 uppercase tracking-tight">
                                            {row.name}
                                        </td>
                                        {columns.map(col => {
                                            const val = (row as any)[col.key] || 0;
                                            return (
                                                <td key={col.key} className={cn(
                                                    'px-4 py-3.5 text-right text-sm tabular-nums',
                                                    val > 0 ? 'text-gray-900 font-bold' : 'text-gray-300'
                                                )}>
                                                    {val > 0 ? val : '0'}
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3.5 text-right font-black text-sm text-slate-900 bg-slate-100/50 tabular-nums border-l border-gray-100">
                                            {rowTotal}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    <tfoot className="bg-slate-800 text-white font-bold">
                        <tr>
                            <td className="px-4 py-4 text-sm uppercase tracking-wider">Grand Total</td>
                            {columns.map(col => {
                                const colTotal = sortedData.reduce((sum, row) => sum + ((row as any)[col.key] || 0), 0);
                                return (
                                    <td key={col.key} className="px-4 py-4 text-right text-sm tabular-nums">
                                        {colTotal}
                                    </td>
                                );
                            })}
                            <td className="px-4 py-4 text-right text-sm tabular-nums bg-slate-900 font-black">
                                {grandTotal}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </CardContent>
        </Card>
    );
}



function SimpleCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, currentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, currentMonth: true });
    }

    const nextMonthDays = 42 - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({ day: i, currentMonth: false });
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-sm tracking-tight">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 shadow-none hover:shadow-xs">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 shadow-none hover:shadow-xs">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map((d, index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-9 flex items-center justify-center text-xs rounded-xl transition-all duration-200 cursor-default",
                            d.currentMonth ? "text-gray-900 font-semibold" : "text-gray-300",
                            d.currentMonth && isToday(d.day)
                                ? "bg-indigo-600 text-white font-black shadow-md shadow-indigo-200 scale-105"
                                : d.currentMonth ? "hover:bg-indigo-50 hover:text-indigo-600" : ""
                        )}
                    >
                        {d.day}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StatusOverview() {
    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                            Calendar
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-0.5">
                            Monthly administrative overview
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
                <SimpleCalendar />
            </CardContent>
        </Card>
    );
}

interface HEIDistributionData {
    code: string;
    name: string;
    degrees: {
        [level: string]: {
            FEMALE: number;
            MALE: number;
            total: number;
        };
    };
}

interface HEIDistributionTableProps {
    data: HEIDistributionData[];
    academicYears?: string[];
    selectedAcademicYear?: string;
    queryParamName?: string;
}

export function HEIDistributionTable({ 
    data = [], 
    academicYears = [], 
    selectedAcademicYear,
    queryParamName = 'academic_year'
}: HEIDistributionTableProps) {
    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                                HEIs Distribution by Degree & Gender
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-0.5">
                                Breakdown of faculty across HEIs, degree levels, and gender
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {academicYears.length > 0 && (
                            <select
                                className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={selectedAcademicYear || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.set(queryParamName, e.target.value);
                                    
                                    const data: any = {};
                                    params.forEach((value, key) => { data[key] = value; });
                                    
                                    router.get(route('admin.dashboard'), data, { preserveState: true, preserveScroll: true, replace: true });
                                }}
                            >
                                <option value="">All Academic Years</option>
                                {academicYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 overflow-y-auto flex-1 min-h-0 relative">
                <table className="w-full text-sm border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 shadow-sm">
                        <tr className="bg-slate-800 text-white">
                            <th className="text-left px-4 py-4 text-sm font-bold uppercase tracking-wider w-[25%] sticky top-0 bg-slate-800">HEIs</th>
                            <th className="text-left px-4 py-4 text-sm font-bold uppercase tracking-wider w-[25%] sticky top-0 bg-slate-800">Degree</th>
                            <th className="text-right px-4 py-4 text-sm font-bold uppercase tracking-wider w-[15%] sticky top-0 bg-slate-800">Female</th>
                            <th className="text-right px-4 py-4 text-sm font-bold uppercase tracking-wider w-[15%] sticky top-0 bg-slate-800">Male</th>
                            <th className="text-right px-4 py-4 text-sm font-bold uppercase tracking-wider w-[20%] sticky top-0 bg-slate-900 shadow-sm">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                                    No data available for the selected academic year.
                                </td>
                            </tr>
                        ) : (
                            data.map((hei) => (
                                <React.Fragment key={hei.code}>
                                    {/* HEI Header Row */}
                                    <tr className="bg-slate-100/80 group">
                                        <td className="px-4 py-4 text-sm font-black text-slate-800 border-y border-slate-200" colSpan={5}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                                {hei.name}
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Degree Rows */}
                                    {(() => {
                                        const degreeOrder = [
                                            'Baccalaureate', 
                                            'Doctorate', 
                                            'Master',
                                            'Pre-Baccalaureate'
                                        ];
                                        
                                        return degreeOrder.map((degree, dIdx) => {
                                            const counts = hei.degrees[degree] || { FEMALE: 0, MALE: 0, total: 0 };
                                            
                                            return (
                                                <tr 
                                                    key={degree} 
                                                    className={cn(
                                                        'border-b border-gray-100 transition-colors',
                                                        dIdx % 2 === 0 ? 'bg-blue-50/5' : 'bg-white'
                                                    )}
                                                >
                                                    <td className="px-4 py-4"></td>
                                                    <td className="px-4 py-4 text-sm font-black text-slate-900 italic">
                                                        {degree}
                                                    </td>
                                                    <td className={cn(
                                                        "px-4 py-4 text-right text-base tabular-nums",
                                                        counts.FEMALE > 0 ? "text-gray-900 font-bold" : "text-gray-300"
                                                    )}>
                                                        {counts.FEMALE > 0 ? counts.FEMALE : '0'}
                                                    </td>
                                                    <td className={cn(
                                                        "px-4 py-4 text-right text-base tabular-nums",
                                                        counts.MALE > 0 ? "text-gray-900 font-bold" : "text-gray-300"
                                                    )}>
                                                        {counts.MALE > 0 ? counts.MALE : '0'}
                                                    </td>
                                                    <td className={cn(
                                                        "px-4 py-4 text-right text-base tabular-nums font-black border-l border-gray-100",
                                                        counts.total > 0 ? "text-slate-900 bg-slate-100/50" : "text-gray-300 bg-gray-50/50"
                                                    )}>
                                                        {counts.total > 0 ? counts.total : '0'}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()}

                                    {/* HEI Total Row (Red Bar like in screenshot) */}
                                    {(() => {
                                        // Sum ONLY the visible degrees for table mathematical accuracy
                                        const visibleDegrees = ['Baccalaureate', 'Doctorate', 'Master', 'Pre-Baccalaureate'];
                                        const femaleTotal = visibleDegrees.reduce((sum, d) => sum + (hei.degrees[d]?.FEMALE || 0), 0);
                                        const maleTotal = visibleDegrees.reduce((sum, d) => sum + (hei.degrees[d]?.MALE || 0), 0);
                                        const overallTotal = femaleTotal + maleTotal;
                                        
                                        return (
                                            <tr className="bg-red-600 text-white font-black shadow-inner">
                                                <td className="px-4 py-4 text-sm uppercase tracking-wider" colSpan={2}>
                                                    TOTAL
                                                </td>
                                                <td className="px-4 py-4 text-right text-base tabular-nums">
                                                    {femaleTotal}
                                                </td>
                                                <td className="px-4 py-4 text-right text-base tabular-nums">
                                                    {maleTotal}
                                                </td>
                                                <td className="px-4 py-4 text-right text-base tabular-nums bg-red-700 border-l border-red-800">
                                                    {overallTotal}
                                                </td>
                                            </tr>
                                        );
                                    })()}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}


