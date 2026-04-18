import { Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface FacultyToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    yearFilter: string;
    availableYears: string[];
    onYearChange: (year: string) => void;
    onCopyData: () => void;
    onSubmit: () => void;
    isLocked?: boolean;
}

export function FacultyToolbar({
    searchQuery,
    onSearchChange,
    yearFilter,
    availableYears,
    onYearChange,
    onCopyData,
    onSubmit,
    isLocked,
}: FacultyToolbarProps) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Name, Degree, or Rank..."
                    className="pl-9 bg-white text-[12px]!"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
                {/* Academic Year Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-gray-600 font-semibold">
                            <Calendar className="h-4 w-4" />
                            Academic Year :{' '}
                            <span className="text-blue-600 ml-1 font-bold">{yearFilter}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {availableYears && availableYears.length > 0 ? (
                            availableYears.map((yearString) => (
                                <DropdownMenuCheckboxItem
                                    key={yearString}
                                    checked={yearFilter === yearString}
                                    onCheckedChange={() => onYearChange(yearString)}
                                >
                                    {yearString}
                                </DropdownMenuCheckboxItem>
                            ))
                        ) : (
                            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground p-2">
                                No data found
                            </DropdownMenuLabel>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    size="sm"
                    onClick={onCopyData}
                    variant="outline"
                    className="text-[#003468] border-[#003468] hover:bg-[#003468]/5 font-medium shadow-sm rounded-md h-9 px-4"
                >
                    Copy Data
                </Button>

                <Button
                    size="sm"
                    onClick={onSubmit}
                    disabled={isLocked}
                    className={isLocked ? "bg-slate-300 text-slate-500 cursor-not-allowed ml-1" : "bg-[#003468] text-white hover:bg-[#002a54] font-medium shadow-sm rounded-md h-9 px-4 ml-1"}
                >
                    {isLocked ? 'Submitted' : 'Submit'}
                </Button>
            </div>
        </div>
    );
}
