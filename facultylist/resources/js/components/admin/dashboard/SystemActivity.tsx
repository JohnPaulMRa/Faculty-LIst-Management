import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';

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
        <Card className="col-span-1 shadow-none border border-gray-200 rounded-none bg-white h-full">
            <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    System Logs
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    Recent technical activities
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="relative border-l border-gray-200 ml-2 space-y-6 my-2">
                    {activities.map((activity, index) => (
                        <div key={index} className="ml-6 relative">
                            {/* Timeline Node */}
                            <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-none bg-white border border-gray-400"></div>

                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 mb-0.5 font-mono">{activity.time}</span>
                                <p className="text-xs font-bold text-gray-900">{activity.user}</p>
                                <p className="text-xs text-gray-600 mt-0.5">
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
