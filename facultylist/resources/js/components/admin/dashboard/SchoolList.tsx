import { Link } from '@inertiajs/react';
import { ChevronRight, Building2, Users, GraduationCap } from 'lucide-react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface School {
    id: number;
    name: string;
    faculty: number;
    status: string;
}

interface SchoolListProps {
    schools?: School[];
}

const SchoolList: FC<SchoolListProps> = ({ schools = [] }) => {
    return (
        <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="p-6 pb-4 border-b border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                                Registered Schools
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 mt-1.5">
                                Institutional overview of active HEIs
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 text-xs font-bold uppercase tracking-tight rounded-xl border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-none" asChild>
                        <Link href="/admin/schools" className="gap-2">
                            Explore All <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="divide-y divide-gray-100/50">
                    {schools.map((school) => (
                        <div
                            key={school.id}
                            className="group flex items-center justify-between p-5 hover:bg-gray-50/50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-110 group-hover:shadow-md group-hover:border-blue-100 transition-all duration-300 ring-2 ring-transparent group-hover:ring-blue-50">
                                    {school.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold leading-none text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                        {school.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {school.faculty} Faculty
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                        <span className="flex items-center gap-1">
                                            <GraduationCap className="h-3 w-3" />
                                            University
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge
                                    variant={school.status === 'Active' ? 'default' : 'secondary'}
                                    className={`${school.status === 'Active'
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
                                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
                                        } shadow-none rounded-lg px-2 py-0.5 text-[10px] font-black border uppercase tracking-tighter`}
                                >
                                    {school.status}
                                </Badge>
                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
                {schools.length === 0 && (
                    <div className="h-60 flex flex-col items-center justify-center text-gray-400 gap-3 opacity-50">
                        <Building2 className="h-10 w-10 text-gray-200" />
                        <span className="text-sm font-medium italic underline decoration-gray-200 underline-offset-4">No institutions currently registered.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


export default SchoolList;
