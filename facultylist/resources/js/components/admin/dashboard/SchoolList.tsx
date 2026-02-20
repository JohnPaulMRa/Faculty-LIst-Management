import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Building2, Users, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';

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
        <Card className="h-full shadow-sm border-border/50 bg-background/50 backdrop-blur-sm flex flex-col overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                            Registered Schools
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground ml-1">
                            Overview of all active institutions
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium" asChild>
                        <Link href="/admin/schools">
                            View All <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <div className="divide-y divide-border/50">
                    {schools.map((school) => (
                        <div
                            key={school.id}
                            className="group flex items-center justify-between p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm ring-4 ring-white dark:ring-gray-950 group-hover:scale-110 transition-transform duration-200">
                                    {school.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                                        {school.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {school.faculty} Faculty
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GraduationCap className="h-3 w-3" />
                                            University
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant={school.status === 'Active' ? 'default' : 'secondary'}
                                    className={`${school.status === 'Active'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                        } shadow-none`}
                                >
                                    {school.status}
                                </Badge>
                                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
                {schools.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Building2 className="h-8 w-8 text-muted-foreground/30" />
                        <span className="text-sm">No schools found</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SchoolList;
