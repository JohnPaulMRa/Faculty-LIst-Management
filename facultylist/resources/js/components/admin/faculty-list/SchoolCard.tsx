import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { University, Users } from "lucide-react";

interface SchoolCardProps {
    name: string;
    totalFaculty: number;
    type: 'public' | 'private';
    isActive?: boolean;
    onClick?: () => void;
}

export default function SchoolCard({ name, totalFaculty, type, isActive, onClick }: SchoolCardProps) {
    return (
        <Card
            className={`
                h-full transition-all duration-200 rounded-none shadow-none border 
                ${isActive
                    ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                    : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
                }
            `}
            onClick={onClick}
        >
            <CardHeader className="p-4 pb-2 space-y-0">
                <div className="flex justify-between items-start gap-2">
                    <div className={`p-2 rounded-none ${isActive ? 'bg-gray-200' : 'bg-gray-50'}`}>
                        <University className="h-5 w-5 text-gray-700" />
                    </div>
                    <Badge variant="outline" className={`rounded-none font-normal text-[10px] px-2 py-0.5 border ${type === 'private' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {type}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
                <CardTitle className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px] leading-tight mb-4" title={name}>
                    {name}
                </CardTitle>

                <div className="flex items-center text-xs text-gray-600 font-medium">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    <span>{totalFaculty} Faculty Members</span>
                </div>
            </CardContent>
        </Card>
    );
}
