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
            case 'publication': return <FileText className="h-4 w-4" />;
            case 'degree': return <GraduationCap className="h-4 w-4" />;
            case 'report': return <FileText className="h-4 w-4" />;
            case 'discipline': return <Database className="h-4 w-4" />;
            default: return <User className="h-4 w-4" />;
        }
    };

    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden h-full flex flex-col">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100">
                        <Database className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                            Discipline Updates
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-0.5">
                            Latest activity in faculty discipline records
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="divide-y divide-gray-100/50">
                    {updates.length > 0 ? (
                        updates.map((update) => (
                            <div key={update.id} className="flex items-start gap-3 p-4 hover:bg-gray-50/50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-purple-500">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shrink-0 border border-purple-100 shadow-xs group-hover:scale-110 transition-transform duration-300">
                                    {getIcon(update.type)}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-gray-900 truncate pr-2 group-hover:text-purple-700 transition-colors uppercase tracking-tight">{update.user}</p>
                                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 border border-gray-100 whitespace-nowrap">{update.time}</span>
                                    </div>
                                    <p className="text-[11px] font-medium text-gray-500 mt-1 line-clamp-1 italic">
                                        {update.action}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
                            <Database className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No recent discipline updates found.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

