import { FC } from 'react';
import { Calendar } from 'lucide-react';
import AcademicYearSelect from '@/components/common/AcademicYearSelect';

interface FacultyOverviewProps {
    selectedYear: string;
    onYearChange: (year: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
}

const FacultyOverview: FC<FacultyOverviewProps> = ({ selectedYear, onYearChange, onRefresh, isLoading }) => {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Metrics and analytics for <span className="font-semibold text-gray-900">Academic Year {selectedYear}</span>.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Academic Year:
                    </span>
                    <AcademicYearSelect
                        value={selectedYear}
                        onValueChange={onYearChange}
                        className="w-[180px] bg-white border-gray-300 rounded-none focus:ring-gray-400"
                    />
                </div>
                {/* Refresh button can be added here if needed, or kept simple */}
            </div>
        </div>
    );
};

export default FacultyOverview;
