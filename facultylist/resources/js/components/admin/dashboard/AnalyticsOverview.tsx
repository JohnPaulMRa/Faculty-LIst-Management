import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        <Card className="shadow-none border border-gray-200 rounded-none bg-white">
            <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    Disciplines Groups
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                    Overview of discipline groups
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
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
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
