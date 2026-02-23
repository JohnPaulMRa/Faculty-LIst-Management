import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DistributionItem {
    name: string;
    count: number;
    children?: DistributionItem[];
}

interface StatusItem {
    name: string;
    value: number;
    color: string;
}

interface AnalyticsOverviewProps {
    distributionData: DistributionItem[];
}

interface StatusOverviewProps {
    statusData: StatusItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 shadow-sm text-xs rounded-none">
                <p className="font-bold text-gray-900">{label}</p>
                <p className="text-gray-600">
                    {payload[0].value} Disciplines
                </p>
            </div>
        );
    }
    return null;
};

export function AnalyticsOverview({ distributionData = [] }: AnalyticsOverviewProps) {
    const [history, setHistory] = useState<{ name: string; data: DistributionItem[] }[]>([{ name: 'All Groups', data: distributionData }]);

    useEffect(() => {
        // Reset to top level if parent data completely changes
        if (history.length <= 1) {
            setHistory([{ name: 'All Groups', data: distributionData }]);
        }
    }, [distributionData]);

    const currentData = history[history.length - 1].data;

    const handleBarClick = (data: any) => {
        const item = data?.payload || data;
        if (item && item.children && item.children.length > 0) {
            setHistory([...history, { name: item.name, data: item.children }]);
        }
    };

    const handleBackClick = () => {
        if (history.length > 1) {
            setHistory(history.slice(0, -1));
        }
    };

    return (
        <Card className="shadow-none border border-gray-200 rounded-none bg-white">
            <CardHeader className="pb-2 border-b border-gray-100 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-gray-500" />
                        Distribution Overview
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">
                        {history.length > 1
                            ? `Showing specific disciplines for ${history[history.length - 1].name}`
                            : "Distribution of disciplines by group"}
                    </CardDescription>
                </div>
                {history.length > 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackClick}
                        className="h-8 text-xs flex items-center gap-1"
                    >
                        <ArrowLeft className="h-3 w-3" /> Back
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-6">
                <div style={{ height: `${Math.max(400, currentData.length * 32)}px` }} className="w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={currentData}
                            layout="vertical"
                            margin={{ top: 0, right: 30, left: 120, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                                width={220}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={15}
                                interval={0}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Bar
                                dataKey="count"
                                fill="#0f172a"
                                radius={[0, 4, 4, 0]}
                                barSize={14}
                                onClick={handleBarClick}
                                cursor={currentData.some(d => d.children && d.children.length > 0) ? "pointer" : "default"}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function StatusOverview({ statusData = [] }: StatusOverviewProps) {
    return (
        <Card className="shadow-none border border-gray-200 rounded-none bg-white h-full">
            <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-gray-500" />
                    Status Overview
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    Current status of all schools
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="square"
                                iconSize={10}
                                wrapperStyle={{ fontSize: '12px', color: '#374151' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
