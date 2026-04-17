import { BarChart3, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DistributionItem {
    name: string;
    count: number;
    children?: DistributionItem[];
}

interface AnalyticsOverviewProps {
    distributionData: DistributionItem[];
}

// Unique, high-contrast colors per discipline group
const COLORS = [
    '#ff5722', '#343a4e', '#00838f', '#8bc34a', '#ffc107',
    '#7c4dff', '#e91e63', '#3f51b5', '#009688', '#4caf50',
    '#ff9800', '#607d8b', '#f44336', '#ad1457', '#2e7d32',
    '#0277bd', '#ef6c00', '#4527a0', '#1565c0', '#2196f3',
    '#827717', '#00695c',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
            <div className="bg-white p-3 border-2 border-gray-800 shadow-2xl rounded-none text-xs">
                <div className="flex items-center gap-2 font-black text-gray-900 mb-1 uppercase tracking-tight">
                    <div className="w-2 h-2 shrink-0" style={{ backgroundColor: payload[0].fill }} />
                    {item.name}
                </div>
                <div className="flex justify-between items-center text-gray-600 font-bold gap-8">
                    <span>Disciplines:</span>
                    <span className="text-gray-900">{item.count}</span>
                </div>
            </div>
        );
    }
    return null;
};

export function AnalyticsOverview({ distributionData = [] }: AnalyticsOverviewProps) {
    const sortedData = [...distributionData]
        .filter(d => d.count > 0)
        .sort((a, b) => b.count - a.count);

    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                            Disciplines Groups
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-0.5">
                            Overview of discipline groups distribution
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div style={{ height: Math.max(400, sortedData.length * 36 + 20) }} className="w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={sortedData}
                            layout="vertical"
                            margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={230}
                                tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                            <Bar dataKey="count" radius={[0, 3, 3, 0]} isAnimationActive={false} minPointSize={4}>
                                {sortedData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col">
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


