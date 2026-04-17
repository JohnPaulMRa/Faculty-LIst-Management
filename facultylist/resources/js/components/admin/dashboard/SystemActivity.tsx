import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ActivityItem {
    user: string;
    action: string;
    time: string;
}

interface SystemActivityProps {
    activities: ActivityItem[];
}

export default function SystemActivity({ activities }: SystemActivityProps) {
    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 shadow-sm border border-slate-100">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                            System Logs
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-0.5">
                            Recent technical activities and audit logs
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 overflow-auto">
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 my-2">
                    {activities.map((activity, index) => (
                        <div key={index} className="ml-6 relative group cursor-default">
                            {/* Timeline Node */}
                            <div className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-slate-500 transition-colors z-10 shadow-xs"></div>

                            <div className="flex flex-col bg-slate-50/50 p-3 rounded-xl border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all duration-300 group-hover:shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 mb-1 font-mono uppercase tracking-widest">{activity.time}</span>
                                <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    {activity.action}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

