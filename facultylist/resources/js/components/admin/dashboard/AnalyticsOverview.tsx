import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const schoolData = [
    { name: 'Arts & Sci', count: 45 },
    { name: 'Engineering', count: 32 },
    { name: 'Nursing', count: 28 },
    { name: 'Business', count: 23 },
    { name: 'Education', count: 18 },
];

const statusData = [
    { name: 'Active', value: 85, color: '#16a34a' }, // green-600
    { name: 'Pending', value: 12, color: '#d97706' }, // amber-600
    { name: 'Inactive', value: 8, color: '#9ca3af' }, // gray-400
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 shadow-sm text-xs rounded-none">
                <p className="font-bold text-gray-900">{label}</p>
                <p className="text-gray-600">
                    {payload[0].value} Faculty
                </p>
            </div>
        );
    }
    return null;
};

export default function AnalyticsOverview() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart: Faculty by School */}
            <Card className="shadow-none border border-gray-200 rounded-none bg-white">
                <CardHeader className="pb-2 border-b border-gray-100">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-gray-500" />
                        Faculty Distribution
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Number of faculty members per school
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pl-0">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={schoolData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                <Bar dataKey="count" fill="#18181b" radius={[2, 2, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Pie Chart: Status Overview */}
            <Card className="shadow-none border border-gray-200 rounded-none bg-white">
                <CardHeader className="pb-2 border-b border-gray-100">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4 text-gray-500" />
                        Status Overview
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                        Current status of all faculty accounts
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="h-[250px] w-full flex items-center justify-center">
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
        </div>
    );
}
