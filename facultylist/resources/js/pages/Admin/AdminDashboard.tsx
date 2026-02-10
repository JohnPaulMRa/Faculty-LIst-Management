import { Head } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    Users2, 
    Briefcase,
    GraduationCap,
    TrendingUp,
    FileText,
    FileDown,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import AdminStatsCard from '@/components/admin/AdminStatsCard';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';

export default function AdminDashboard() {
    const stats = [
        { title: "Total Faculty", value: "128", icon: Users2, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Tenured", value: "85", icon: Briefcase, trend: "+5%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Master's Degree", value: "92", icon: GraduationCap, trend: "+8%", color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Pending Reviews", value: "12", icon: FileText, trend: "-2%", color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const recentActivities = [
        { user: "Dr. Sarah Johnson", action: "Updated profile details", time: "2 mins ago" },
        { user: "Prof. Michael Chen", action: "Submitted annual report", time: "1 hour ago" },
        { user: "System", action: "Automated backup completed", time: "5 hours ago" },
        { user: "Dr. Emily Davis", action: "Added new publication", time: "1 day ago" },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />
            
            <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
                        <p className="text-muted-foreground text-sm">Welcome back, Admin. Here's what's happening today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="shadow-sm">
                            <FileDown className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                        <Button className="bg-[#003468] hover:bg-[#002a54] text-white shadow-md">
                            <Users className="mr-2 h-4 w-4" /> Add New User
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <AdminStatsCard key={index} {...stat} />
                    ))}
                </div>

                {/* Main Content Areas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Faculty Updates (4 columns) */}
                    <Card className="col-span-4 shadow-sm border border-gray-100">
                        <CardHeader>
                            <CardTitle>Recent Faculty Updates</CardTitle>
                            <CardDescription>
                                Latest changes made by faculty members.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Simulated List Items */}
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center group">
                                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                            FM
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-gray-900">Faculty Member {i}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Updated academic rank details
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-gray-400">
                                            {i * 2} mins ago
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Activity (3 columns) */}
                    <AdminRecentActivity activities={recentActivities} />
                </div>
            </div>
        </AppLayout>
    );
}
