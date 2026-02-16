import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, GraduationCap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardStats {
    totalFaculty: number;
    gender: { male: number; female: number };
    status: { updated: number; notUpdated: number };
}

interface FacultyStatsProps {
    stats: DashboardStats;
}

const FacultyStats: FC<FacultyStatsProps> = ({ stats }) => {
    const genderData = [
        { name: 'Male', value: stats.gender.male, color: '#2563eb' }, // blue-600
        { name: 'Female', value: stats.gender.female, color: '#db2777' }, // pink-600
    ];

    const statusData = [
        { name: 'Updated', value: stats.status.updated, color: '#16a34a' }, // green-600
        { name: 'Pending', value: stats.status.notUpdated, color: '#d97706' }, // amber-600
    ];

    // Calculate percentages for Total Faculty card (optional visual)
    const total = stats.totalFaculty || 1;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Faculty Card */}
            {/* Total Faculty Card */}
            <Card className="rounded-none border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2 pt-6 px-6">
                    <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Faculty</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 px-6">
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-none">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl font-extrabold text-gray-900 leading-none">{stats.totalFaculty}</span>
                            <span className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">Active Members</span>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Gender Distribution Pie Chart */}
            <Card className="rounded-none border border-gray-200 shadow-none bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[140px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '0px', borderColor: '#e5e7eb', boxShadow: 'none' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend
                                verticalAlign="middle"
                                align="right"
                                layout="vertical"
                                iconType="square"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '11px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Status Distribution Pie Chart */}
            <Card className="rounded-none border border-gray-200 shadow-none bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Profile Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[140px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '0px', borderColor: '#e5e7eb', boxShadow: 'none' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend
                                verticalAlign="middle"
                                align="right"
                                layout="vertical"
                                iconType="square"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '11px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyStats;
