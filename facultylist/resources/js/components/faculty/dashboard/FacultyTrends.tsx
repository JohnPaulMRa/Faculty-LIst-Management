import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Briefcase } from 'lucide-react';

interface TrendSeries {
    name: string;
    color: string;
    data: number[];
}

interface FacultyTrendsProps {
    trends: {
        years: string[];
        series: TrendSeries[];
    };
}

const YEAR_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#db2777'];

const FacultyTrends: FC<FacultyTrendsProps> = ({ trends }) => {
    // Transform data for Recharts: X-axis = Employment Types (series names), Lines = Years
    const chartData = trends.series.map((series) => {
        const dataPoint: any = { name: series.name };
        trends.years.forEach((year, index) => {
            dataPoint[year] = series.data[index];
        });
        return dataPoint;
    });

    return (
        <Card className="rounded-none border border-gray-200 shadow-none bg-white">
            <CardHeader className="border-b border-gray-100 p-5">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    Employment Trends
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                padding={{ left: 20, right: 20 }}
                                interval={0}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '0px', borderColor: '#e5e7eb', boxShadow: 'none' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="square"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingBottom: '20px' }}
                            />
                            {trends.years.map((year, index) => (
                                <Line
                                    key={year}
                                    type="linear"
                                    dataKey={year}
                                    stroke={YEAR_COLORS[index % YEAR_COLORS.length]}
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: YEAR_COLORS[index % YEAR_COLORS.length] }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default FacultyTrends;
