import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, LayoutGrid, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SchoolCard from './SchoolCard';
import AdminFacultyTable from './AdminFacultyTable';
import { router } from '@inertiajs/react';
import { useDebounce } from '@/hooks/use-debounce';

interface School {
    id: number;
    name: string;
    faculty: number;
    type: 'public' | 'private';
    status: string;
}

interface FacultyMember {
    id: string | number;
    name: string;
    sex: string;
    type: string;
    submissionStatus: 'submitted' | 'pending';
    schoolYear: string;
}

interface AdminFacultyListModuleProps {
    schools: School[];
    faculty: FacultyMember[];
    filters: { school_id?: string; search?: string };
}

export default function AdminFacultyListModule({ schools = [], faculty = [], filters = {} }: AdminFacultyListModuleProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const selectedSchoolId = filters.school_id ? parseInt(filters.school_id) : null;

    const activeSchoolTitle = schools.find(s => s.id === selectedSchoolId)?.name;

    const handleSearch = useCallback((value: string) => {
        router.get(
            route('admin.faculty-list'),
            { ...filters, search: value },
            { preserveState: true, preserveScroll: true, only: ['schools', 'faculty', 'filters'] }
        );
    }, [filters]);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) {
            handleSearch(debouncedSearch);
        }
    }, [debouncedSearch, handleSearch, filters.search]);

    const handleSchoolClick = (schoolId: number) => {
        router.get(
            route('admin.faculty-list'),
            { ...filters, school_id: schoolId },
            { preserveState: true, preserveScroll: true, only: ['faculty', 'filters'] }
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        handleSearch("");
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Header / Search Area */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage schools and faculty members. Select a school to view details.
                    </p>
                </div>

                <div className="bg-white p-6 border border-gray-200 shadow-none rounded-none">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search schools or faculty..."
                                className="pl-9 pr-9 bg-gray-50 border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-gray-400 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" className="rounded-none border-gray-300 gap-2 h-10 hidden md:flex">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-none h-10 gap-2">
                                <Plus className="h-4 w-4" />
                                Add School
                            </Button>
                        </div>
                    </div>

                    {/* School Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {schools.map((school) => (
                            <div key={school.id} onClick={() => handleSchoolClick(school.id)} className="cursor-pointer group">
                                <SchoolCard
                                    name={school.name}
                                    totalFaculty={school.faculty}
                                    type={school.type}
                                    isActive={selectedSchoolId === school.id}
                                />
                            </div>
                        ))}
                    </div>

                    {schools.length === 0 && (
                        <div className="py-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-none">
                            <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No schools found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Faculty List Table Section */}
            {selectedSchoolId ? (
                <div className="bg-white p-6 border border-gray-200 shadow-none rounded-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-gray-400 font-normal">Faculty List:</span>
                                {activeSchoolTitle}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Viewing all faculty members for this school.</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-none border-gray-300">
                            Download Report
                        </Button>
                    </div>

                    <AdminFacultyTable faculty={faculty} />
                </div>
            ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 p-12 text-center text-gray-500 rounded-none flex flex-col items-center justify-center">
                    <LayoutGrid className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No School Selected</h3>
                    <p className="text-sm">Select a school from the grid above to view its faculty list.</p>
                </div>
            )}
        </div>
    );
}
