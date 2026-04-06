/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';
import { Search, X, University, Users, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { PrivateSchoolView } from '@/components/admin/faculty-list/private-HEI/PrivateSchoolView';
import { PublicSchoolView } from '@/components/admin/faculty-list/public-HEI/PublicSchoolView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

interface School {
    id: number;
    name: string;
    hei_code: string | null;
    faculty: number;
    type: 'Public' | 'Private'; // Ensure case matches backend
    academic_year?: string;
    status: string;
}

interface FacultyMember {
    id: string | number;
    name: string;
    sex: string;
    type: string;
    submissionStatus: 'submitted' | 'pending';
    schoolYear: string;
    [key: string]: any; // Allow for extra fields from backend
}

interface AdminFacultyListModuleProps {
    schools: School[];
    faculty: FacultyMember[];
    filters: { hei_id?: string; search?: string; type?: string };
    referenceData?: any;
    submittedYears?: string[];
}

export default function AdminFacultyListModule({
    schools = [],
    faculty = [],
    filters = {},
    referenceData = {},
    submittedYears = []
}: AdminFacultyListModuleProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const selectedSchoolId = filters.hei_id ? parseInt(filters.hei_id) : null;

    const activeSchoolTitle = schools.find(s => s.id === selectedSchoolId)?.name;

    // Filter schools based on sidebar type and search query
    const filteredSchools = schools.filter(school => {
        // Filter by Type (Private/Public) if a type is selected in the global sidebar
        if (filters.type && school.type !== filters.type) {
            return false;
        }

        // Filter by Search
        if (!debouncedSearch) return true;
        const searchLower = debouncedSearch.toLowerCase();
        return (
            school.name.toLowerCase().includes(searchLower) ||
            (school.hei_code && school.hei_code.toLowerCase().includes(searchLower))
        );
    });

    const handleSearch = useCallback((value: string) => {
        router.get(
            route('admin.faculty-list'),
            { ...filters, search: value },
            { preserveState: true, preserveScroll: true, only: ['schools', 'faculty', 'filters', 'submittedYears'] }
        );
    }, [filters]);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) {
            handleSearch(debouncedSearch);
        }
    }, [debouncedSearch, handleSearch, filters.search]);

    const handleSchoolClick = (schoolId: number) => {
        const isSelected = selectedSchoolId === schoolId;

        const newFilters = { ...filters };
        if (isSelected) {
            delete newFilters.hei_id;
        } else {
            newFilters.hei_id = schoolId.toString();
        }

        router.get(
            route('admin.faculty-list'),
            newFilters,
            { preserveState: true, preserveScroll: true, only: ['faculty', 'filters', 'submittedYears'] }
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        handleSearch("");
    };

    return (
        <div className="flex flex-col w-full h-full bg-white overflow-hidden relative rounded-xl shadow-sm border border-gray-100">
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Management</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage schools and faculty members. {selectedSchoolId ? "Viewing faculty for the selected school." : "Select a school to view details."}
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        {!selectedSchoolId && (
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search schools..."
                                    className="pl-9 h-10 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button onClick={clearSearch} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                {selectedSchoolId ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <Button
                            variant="secondary"
                            onClick={() => handleSchoolClick(selectedSchoolId)}
                            className="bg-blue-500 hover:bg-blue-400 text-white border-0 h-9 px-4 rounded-md flex items-center gap-2 mb-5 shadow-sm font-medium transition-colors w-fit"
                        >
                            <ArrowLeft className="h-4 w-4 text-white" />
                            Back to Schools
                        </Button>
                        {schools.find(s => s.id === selectedSchoolId)?.type === 'Private' ? (
                            <PrivateSchoolView
                                schoolName={activeSchoolTitle || ''}
                                faculty={faculty as any}
                                referenceData={referenceData}
                                submittedYears={submittedYears}
                            />
                        ) : (
                            <PublicSchoolView
                                schoolName={activeSchoolTitle || ''}
                                faculty={faculty as any}
                                referenceData={referenceData}
                                submittedYears={submittedYears}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col animate-in fade-in duration-300 bg-white shadow-none overflow-hidden rounded-none border border-gray-300 mt-2">
                        {/* SPREADSHEET HEADER */}
                        <div className="bg-gray-50 flex items-center justify-between px-4 py-3 border-b border-gray-300">
                            <div className="text-black text-sm font-bold uppercase tracking-wide">
                                LIST OF {filters.type ? `${filters.type.toUpperCase()} (HEIs)` : 'HIGHER EDUCATION INSTITUTIONS (HEIs)'}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                                <thead>
                                    <tr className="bg-blue-500 text-white border-b border-gray-300">
                                        <th className="px-3 py-2 font-bold w-[40px] text-left">#</th>
                                        <th className="px-3 py-2 font-bold w-[25%] text-left">HEI Code</th>
                                        <th className="px-3 py-2 font-bold w-[30%] text-left">List of HEIs</th>
                                        <th className="px-3 py-2 font-bold w-[20%] text-left">Academic Year</th>
                                        <th className="px-3 py-2 font-bold w-[20%] text-center">Total Faculty</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm">
                                    {filteredSchools.length > 0 ? (
                                        filteredSchools.map((school, index) => (
                                            <tr
                                                key={school.id}
                                                className="border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => handleSchoolClick(school.id)}
                                            >
                                                <td className="px-3 py-2 text-left text-gray-500 border-r border-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                                    {school.hei_code || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                                    <div>{school.name}</div>
                                                </td>
                                                <td className="px-3 py-2 text-left text-black">
                                                    {school.academic_year || 'N/A'}
                                                </td>

                                                <td className="px-3 py-2 font-bold text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-black">
                                                        <span>{school.faculty}</span>
                                                        <Users className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <University className="h-12 w-12 text-gray-300 mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No schools found</h3>
                                                    <p className="text-sm">We couldn't find any schools matching "{searchQuery}".</p>
                                                    <Button variant="link" onClick={clearSearch} className="mt-2 text-blue-600">Clear search</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
