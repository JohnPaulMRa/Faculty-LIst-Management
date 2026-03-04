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
                group relative bg-white transition-all duration-300 rounded-2xl border-gray-400 shadow-[0_2px_12px_-3px_rgba(6,81,237,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full
                ${isActive
                    ? 'ring-2 ring-blue-600 shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
                    : ''
                }
            `}
            onClick={onClick}
        >
            <div className="p-6 flex flex-col h-full gap-5">
                {/* Header: Icon and Type Badge */}
                <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                        <University className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className={`rounded-full px-5 py-2 text-sm font-medium border-0 ${type?.toLowerCase() === 'private' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {type}
                    </Badge>
                </div>

                {/* Body: School Name and Code */}
                <div className="flex-1 mt-2">
                    <h3 className="text-2xl font-semibold text-slate-900 line-clamp-2 leading-snug mb-1" title={name}>
                        {name}
                    </h3>
                    {code && (
                        <p className="text-md text-slate-500 font-medium h-5">
                            Code: {code}
                        </p>
                    )}
                </div>

                {/* Footer: Faculty Count (Main Focal Point) */}
                <div className="pt-4 mt-auto border-t border-gray-500">
                    <p className="text-lg text-slate-500 font-medium mb-1 uppercase tracking-wider">Total Faculty</p>
                    <div className="flex items-end gap-2 text-slate-900">
                        <span className="text-3xl font-bold leading-none tracking-tight">{totalFaculty}</span>
                        <Users className="h-5 w-5 text-slate-400 mb-1" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
