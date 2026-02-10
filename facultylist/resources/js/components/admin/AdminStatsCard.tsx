import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStatsCardProps {
    title: string;
    value: string;
    icon: any;
    trend: string;
    color: string;
    bg: string;
}

export default function AdminStatsCard({ title, value, icon: Icon, trend, color, bg }: AdminStatsCardProps) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-full ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="flex items-center text-xs mt-1">
                    <span className={`${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center font-medium mr-2`}>
                        {trend.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
                        {trend}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                </div>
            </CardContent>
        </Card>
    );
}
