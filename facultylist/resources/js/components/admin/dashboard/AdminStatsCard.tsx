import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Users, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStatsCardProps {
    title: string;
    value: string;
    trend?: string;
    subtext?: string;
}

export default function AdminStatsCard({ title, value, trend, subtext }: AdminStatsCardProps) {
    // Determine icon based on title (simple logic for now)
    const isSchool = title.toLowerCase().includes('school') || title.toLowerCase().includes('hei');
    const Icon: LucideIcon = isSchool ? School : Users;
    const themeColor = isSchool ? 'text-blue-600 bg-blue-50' : 'text-indigo-600 bg-indigo-50';

    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white transition-all hover:shadow-md hover:-translate-y-1 duration-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${themeColor}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
                {trend && (
                    <div className="flex items-center text-[10px] font-bold text-green-600 mt-3 bg-green-50/50 w-fit px-2 py-0.5 rounded-full border border-green-100">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{trend}</span>
                        <span className="text-gray-400 ml-1 font-normal">vs last month</span>
                    </div>
                )}
                {subtext && (
                    <div className="flex items-center text-[10px] font-bold text-slate-600 mt-3 bg-slate-50/50 w-fit px-2 py-0.5 rounded-full border border-slate-200">
                        <span>{subtext}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

