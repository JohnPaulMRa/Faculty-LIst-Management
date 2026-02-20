import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { University, Users } from "lucide-react";

interface SchoolCardProps {
    name: string;
    code: string | null;
    totalFaculty: number;
    type: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function SchoolCard({ name, code, totalFaculty, type, isActive, onClick }: SchoolCardProps) {
    return (
        <Card
            className={`
                transition-all duration-200 rounded-lg shadow-sm border 
                ${isActive
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
            `}
            onClick={onClick}
        >
            <div className="flex items-center p-3 gap-3">
                <div className={`p-2 shrink-0 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                    <University className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0 grid gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-semibold truncate leading-none transition-colors ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                            {name}
                        </h3>
                        {code && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border transition-colors ${isActive ? 'bg-blue-100/50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {code}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <Badge variant="outline" className={`rounded-full font-medium text-[10px] px-2.5 py-0.5 border ${type?.toLowerCase() === 'private' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {type}
                    </Badge>

                    <div className={`flex items-center text-xs font-medium w-[100px] justify-end gap-1.5 transition-colors ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                        <Users className="h-3.5 w-3.5" />
                        <span>{totalFaculty} Faculty</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
