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
        <Card className="col-span-3 shadow-sm border border-gray-100 bg-gray-50/50">
            <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>
                    Recent system logs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {activities.map((activity, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <Settings className="h-4 w-4 text-slate-500" />
                            </div>
                            
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900 text-sm">{activity.user}</div>
                                    <time className="font-caveat font-medium text-indigo-500 text-xs">{activity.time}</time>
                                </div>
                                <div className="text-slate-500 text-xs">{activity.action}</div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
