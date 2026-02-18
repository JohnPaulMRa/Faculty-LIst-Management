import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Building2 } from 'lucide-react';

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
        <Card className="h-full shadow-none border border-gray-200 rounded-none bg-white flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Schools
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Overview of registered schools
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                        View All <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="divide-y divide-gray-100">
                    {schools.map((school) => (
                        <div key={school.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {school.name}
                                </h4>
                                <p className="text-xs text-cool-gray-500 mt-0.5">
                                    {school.faculty} Faculty Members
                                </p>
                            </div>
                            <div className={`text-[10px] px-2 py-0.5 rounded-full border ${school.status === 'Active'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                {school.status}
                            </div>
                        </div>
                    ))}
                </div>
                {schools.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-gray-400 text-xs italic">
                        No schools found
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SchoolList;
