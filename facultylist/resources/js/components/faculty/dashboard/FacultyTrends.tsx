import { Briefcase, Users } from 'lucide-react';
import type { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    schoolType?: string;
}

const YEAR_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#db2777'];

const FacultyTrends: FC<FacultyTrendsProps> = ({ trends, schoolType }) => {
    const isPublic = schoolType?.toLowerCase().trim() === 'public';
    // Transform data for Recharts: X-axis = Employment Types (series names), Bars = Years
    const chartData = trends.series.map((series) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataPoint: any = { name: series.name };
        trends.years.forEach((year, index) => {
            dataPoint[year] = series.data[index];
        });
        return dataPoint;
    });

    return (
        <Card className="rounded-4px border border-gray-300 shadow-none bg-white">
            <CardHeader className="border-b border-gray-100 p-5">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    {isPublic ? (
                        <>
                            <Users className="h-4 w-4 text-gray-500" />
                            Groups
                        </>
                    ) : (
                        <>
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            Employment
                        </>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%" debounce={100} style={{ outline: 'none' }}>
                        <BarChart
                            data={chartData}
                            barCategoryGap="30%"
                            style={{ outline: 'none' }}
                            tabIndex={-1}
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
                                tick={{ fontSize: 11, fill: '#000000' }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '0px', borderColor: '#e5e7eb', boxShadow: 'none' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                cursor={{ fill: '#f9fafb' }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="square"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingBottom: '20px' }}
                            />
                            {trends.years.map((year, index) => (
                                <Bar
                                    key={year}
                                    dataKey={year}
                                    fill={YEAR_COLORS[index % YEAR_COLORS.length]}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={30}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default FacultyTrends;
