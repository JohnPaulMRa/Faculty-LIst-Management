import { Link } from '@inertiajs/react';
import { ClipboardList, School, Users, Calendar, ArrowRight } from 'lucide-react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Submission {
    id: number;
    hei_id: number;
    hei_name: string;
    academic_year: string;
    total_faculty: number;
    type: string;
    submitted_by: string;
    time: string;
    date: string;
}

interface SubmittedHeisListProps {
    recentSubmissions: Submission[];
}

export const SubmittedHeisList: FC<SubmittedHeisListProps> = ({ recentSubmissions = [] }) => {
    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                                Submitted HEIs
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-0.5">
                                Recently received faculty institutional submissions
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="divide-y divide-gray-100/50 overflow-y-auto max-h-[420px]">
                    {recentSubmissions.length > 0 ? (
                        recentSubmissions.map((submission) => (
                            <div key={submission.id} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-blue-500">
                                {/* Icon/Avatar Area */}
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-300 group-hover:scale-105 ${submission.type === 'Public'
                                        ? 'bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-100'
                                        : 'bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-100'
                                    }`}>
                                    <School className="h-6 w-6" />
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-black truncate transition-colors ${submission.type === 'Public' ? 'text-purple-700' : 'text-blue-700'
                                            }`}>
                                            {submission.hei_name}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-0.5 border border-gray-100">
                                            {submission.time}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                                                AY {submission.academic_year}
                                            </span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-3 w-3 text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-600">
                                                {submission.total_faculty} Faculty
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-2.5">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 uppercase font-black border-2 ${submission.type === 'Public'
                                                    ? 'border-purple-200 text-purple-600 bg-white'
                                                    : 'border-blue-200 text-blue-600 bg-white'
                                                }`}>
                                                {submission.type === 'Public' ? 'PUBLIC HEI' : 'PRIVATE HEI'}
                                            </Badge>
                                            <span className="text-[10px] text-gray-400 italic">
                                                by {submission.submitted_by}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Action */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                    <ArrowRight className="h-4 w-4 text-gray-300" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <ClipboardList className="h-10 w-10 text-gray-200 mb-3" />
                            <p className="text-gray-400 italic text-sm font-medium">No recent submissions found.</p>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
};

export default SubmittedHeisList;
