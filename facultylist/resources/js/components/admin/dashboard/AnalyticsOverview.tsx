import { BarChart3, PieChart as PieChartIcon, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    privateDistributionData: DistributionItem[];
    publicDistributionData: DistributionItem[];
}

interface StatusOverviewProps {
    statusData: StatusItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function AnalyticsOverview({ privateDistributionData = [], publicDistributionData = [] }: AnalyticsOverviewProps) {
    const [activeTab, setActiveTab] = useState<string>('private');
    const [history, setHistory] = useState<{ name: string; data: DistributionItem[] }[]>([{ name: 'All Groups', data: privateDistributionData }]);

    const activeDistributionData = activeTab === 'private' ? privateDistributionData : publicDistributionData;

    useEffect(() => {
        // Reset to top level if parent data completely changes or tab changes
         
        setHistory([{ name: 'All Groups', data: activeDistributionData }]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, privateDistributionData, publicDistributionData]);

    const currentData = history[history.length - 1].data || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                <div className="flex items-center gap-4">
                    {history.length <= 1 && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="private">Private</TabsTrigger>
                                <TabsTrigger value="public">Public</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
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
                </div>
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
                                radius={[0, 4, 4, 0]}
                                barSize={14}
                                onClick={handleBarClick}
                                cursor={currentData.some(d => d.children && d.children.length > 0) ? "pointer" : "default"}
                            >
                                {currentData.map((entry, index) => {
                                    const maxCount = Math.max(...currentData.map(d => d.count), 1);
                                    const ratio = entry.count / maxCount;

                                    // RdYlGn Palette (Red -> Orange -> Yellow -> Green -> Dark Green)
                                    const palette = [
                                        [215, 48, 39],   // Red (0)
                                        [244, 109, 67],  // Orange (1)
                                        [253, 174, 97],  // Light Orange (2)
                                        [254, 224, 139], // Yellow (3)
                                        [217, 239, 139], // Light Yellow-Green (4)
                                        [166, 217, 106], // Light Green (5)
                                        [102, 189, 99],  // Green (6)
                                        [26, 152, 80]    // Dark Green (7)
                                    ];

                                    const numSegments = palette.length - 1;
                                    const scaled = ratio * numSegments;
                                    const segment = Math.min(Math.floor(scaled), numSegments - 1);
                                    const t = scaled - segment;

                                    const c1 = palette[segment];
                                    const c2 = palette[segment + 1];

                                    // Linear interpolation between the two colors
                                    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
                                    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
                                    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);

                                    return <Cell key={`cell-${index}`} fill={`rgb(${r}, ${g}, ${b})`} />;
                                })}
                            </Bar>
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
