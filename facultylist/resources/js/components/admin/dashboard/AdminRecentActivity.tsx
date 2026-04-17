import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ActivityItem {
    user: string;
    action: string;
    time: string;
}

interface AdminRecentActivityProps {
    activities: ActivityItem[];
}

export default function AdminRecentActivity({ activities }: AdminRecentActivityProps) {
    return (
        <Card className="col-span-3 rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 shadow-sm border border-slate-100">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                            System Activity
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-1.5">
                            Real-time audit logs and recent administrative actions
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                    {activities.map((activity, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white bg-slate-50 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                                <Settings className="h-4 w-4" />
                            </div>
                            
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-slate-100 bg-white shadow-xs group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-bold text-slate-900 text-sm tracking-tight">{activity.user}</div>
                                    <time className="font-mono font-black text-indigo-500 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100/50">{activity.time}</time>
                                </div>
                                <div className="text-slate-500 text-xs leading-relaxed italic">{activity.action}</div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

