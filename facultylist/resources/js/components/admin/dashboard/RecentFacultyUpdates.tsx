import { User, FileText, GraduationCap, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface UpdateItem {
    id: string | number;
    user: string;
    action: string;
    type: string;
    time: string;
}

interface RecentFacultyUpdatesProps {
    updates: UpdateItem[];
}

export default function RecentFacultyUpdates({ updates = [] }: RecentFacultyUpdatesProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'publication': return <FileText className="h-3 w-3" />;
            case 'degree': return <GraduationCap className="h-3 w-3" />;
            case 'report': return <FileText className="h-3 w-3" />;
            case 'discipline': return <Database className="h-3 w-3" />;
            default: return <User className="h-3 w-3" />;
        }
    };

    return (
        <Card className="col-span-1 shadow-none border border-gray-200 rounded-none bg-white h-full">
            <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    Discipline Updates
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    Latest changes on Disciplines
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                    {updates.length > 0 ? (
                        updates.map((update) => (
                            <div key={update.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
                                <div className="h-8 w-8 rounded-none bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
                                    {getIcon(update.type)}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-gray-900 truncate pr-2">{update.user}</p>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{update.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                                        {update.action}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No recent discipline updates.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
