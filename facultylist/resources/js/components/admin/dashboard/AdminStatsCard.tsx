import { TrendingUp, ArrowUpRight, Users, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStatsCardProps {
    title: string;
    value: string;
    trend: string;
}

export default function AdminStatsCard({ title, value, trend }: AdminStatsCardProps) {
    // Determine icon based on title (simple logic for now)
    const Icon = title.toLowerCase().includes('school') ? School : Users;

    return (
        <Card className="rounded-none shadow-none border border-gray-200 bg-white transition-all hover:border-gray-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
                <div className="flex items-center text-xs font-medium text-green-600 mt-2 bg-green-50 w-fit px-2 py-1 rounded-none border border-green-100">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>{trend}</span>
                    <span className="text-gray-400 ml-1 font-normal">vs last month</span>
                </div>
            </CardContent>
        </Card>
    );
}
