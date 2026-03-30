import { Calendar } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FacultyOverviewProps {
    selectedYear: string;
    onYearChange: (year: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
    availableYears?: string[];
}

const FacultyOverview: FC<FacultyOverviewProps> = ({ selectedYear, onYearChange, availableYears = [] }) => {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Metrics and analytics for <span className="font-semibold text-gray-900">Academic Year {selectedYear}</span>.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-gray-600 font-semibold">
                            <Calendar className="h-4 w-4" />
                            Academic Year : <span className="text-blue-600 ml-1 font-bold">{selectedYear === 'All Years' ? 'All' : selectedYear}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Select Academic Year</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={selectedYear === 'All Years'}
                            onCheckedChange={() => onYearChange('All Years')}
                        >
                            All Years
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {availableYears.length > 0 ? (
                            availableYears.map((year) => (
                                <DropdownMenuCheckboxItem
                                    key={year}
                                    checked={selectedYear === year}
                                    onCheckedChange={() => onYearChange(year)}
                                >
                                    {year}
                                </DropdownMenuCheckboxItem>
                            ))
                        ) : (
                            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground p-2">No data found</DropdownMenuLabel>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default FacultyOverview;
