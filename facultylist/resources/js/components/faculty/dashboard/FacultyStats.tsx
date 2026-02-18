import { FC, useState } from 'react';
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
    const [hoveredGender, setHoveredGender] = useState<any>(null);
    const [hoveredStatus, setHoveredStatus] = useState<any>(null);

    const genderData = [
        { name: 'Male', value: stats.gender.male, color: '#3b82f6', depthColor: '#1d4ed8' }, // blue-500, blue-700
        { name: 'Female', value: stats.gender.female, color: '#ec4899', depthColor: '#be185d' }, // pink-500, pink-700
    ];

    const statusData = [
        { name: 'Updated', value: stats.status.updated, color: '#10b981', depthColor: '#047857' }, // emerald-500, emerald-700
        { name: 'Pending', value: stats.status.notUpdated, color: '#f59e0b', depthColor: '#b45309' }, // amber-500, amber-700
    ];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <foreignObject x={x - 30} y={y - 20} width={60} height={40} style={{ overflow: 'visible' }}>
                <div style={{ transform: 'rotateX(-50deg)', textAlign: 'center', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="text-lg font-black text-white drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {`${(percent * 100).toFixed(0)}% `}
                    </span>
                </div>
            </foreignObject>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Faculty - Donut Chart Style */}
            <Card className="rounded-none border border-gray-200 shadow-none bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Faculty</CardTitle>
                </CardHeader>
                <CardContent className="h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[{ name: 'Total', value: stats.totalFaculty, color: '#3b82f6' }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={0}
                                cornerRadius={4}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill="#3b82f6" />
                            </Pie>

                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Total Content */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-24 h-24 flex flex-col items-center justify-center border border-gray-100 transition-all duration-200 pointer-events-none">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-black text-gray-800">{stats.totalFaculty}</span>
                    </div>
                </CardContent>
            </Card>


            {/* Gender Distribution Pie Chart */}
            <Card className="rounded-none border border-gray-200 shadow-none bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                cornerRadius={4}
                                dataKey="value"
                                stroke="none"
                                onMouseEnter={(_, index) => setHoveredGender(genderData[index])}
                                onMouseLeave={() => setHoveredGender(null)}
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell - ${index} `} fill={entry.color} />
                                ))}
                            </Pie>

                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Total/Hover Content */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-24 h-24 flex flex-col items-center justify-center border border-gray-100 transition-all duration-200 pointer-events-none">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            {hoveredGender ? hoveredGender.name : 'Total'}
                        </span>
                        <span className="text-2xl font-black text-gray-800">
                            {hoveredGender ? hoveredGender.value : (stats.gender.male + stats.gender.female)}
                        </span>
                    </div>

                    {/* Legend Overlay */}
                    <div className="absolute top-4 right-2 flex flex-col gap-2">
                        {genderData.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs font-semibold text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Status Distribution Pie Chart */}
            <Card className="rounded-none border border-gray-200 shadow-none bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Profile Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                cornerRadius={4}
                                dataKey="value"
                                stroke="none"
                                onMouseEnter={(_, index) => setHoveredStatus(statusData[index])}
                                onMouseLeave={() => setHoveredStatus(null)}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell - ${index} `} fill={entry.color} />
                                ))}
                            </Pie>

                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Total/Hover Content */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg w-24 h-24 flex flex-col items-center justify-center border border-gray-100 transition-all duration-200 pointer-events-none">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            {hoveredStatus ? hoveredStatus.name : 'Total'}
                        </span>
                        <span className="text-2xl font-black text-gray-800">
                            {hoveredStatus ? hoveredStatus.value : (stats.status.updated + stats.status.notUpdated)}
                        </span>
                    </div>

                    {/* Legend Overlay */}
                    <div className="absolute top-4 right-2 flex flex-col gap-2">
                        {statusData.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs font-semibold text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyStats;
