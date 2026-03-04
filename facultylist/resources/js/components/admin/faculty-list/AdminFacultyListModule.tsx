import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, LayoutGrid, X, University, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddSchoolModal from './AddSchoolModal';
import { router } from '@inertiajs/react';
import { useDebounce } from '@/hooks/use-debounce';
import { PrivateSchoolView } from '@/components/admin/faculty-list/private-HEI/PrivateSchoolView';
import { PublicSchoolView } from '@/components/admin/faculty-list/public-HEI/PublicSchoolView';
import CreateFacultyAccountModal from './CreateFacultyAccountModal';
import SchoolCard from './SchoolCard';

interface School {
    id: number;
    name: string;
    code: string | null;
    faculty: number;
    type: 'Public' | 'Private'; // Ensure case matches backend
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
    filters: { school_id?: string; search?: string; type?: string };
    referenceData?: any;
}

export default function AdminFacultyListModule({ schools = [], faculty = [], filters = {}, referenceData = {} }: AdminFacultyListModuleProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const selectedSchoolId = filters.school_id ? parseInt(filters.school_id) : null;
    const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);

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
            (school.code && school.code.toLowerCase().includes(searchLower))
        );
    });

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
        const isSelected = selectedSchoolId === schoolId;

        const newFilters = { ...filters };
        if (isSelected) {
            delete newFilters.school_id;
        } else {
            newFilters.school_id = schoolId.toString();
        }

        router.get(
            route('admin.faculty-list'),
            newFilters,
            { preserveState: true, preserveScroll: true, only: ['faculty', 'filters'] }
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        handleSearch("");
    };

    const handleAddSchool = () => {
        setIsSchoolModalOpen(true);
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
                        <Button
                            onClick={handleAddSchool}
                            variant="outline"
                            className="w-full md:w-auto rounded-md h-10 gap-2 border-gray-300 shrink-0"
                        >
                            <Plus className="h-4 w-4" /> Add School
                        </Button>
                        <Button
                            onClick={() => setIsCreateAccountModalOpen(true)}
                            className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-md h-10 gap-2 shrink-0"
                        >
                            <Plus className="h-4 w-4" /> Create Account
                        </Button>
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
                            />
                        ) : (
                            <PublicSchoolView
                                schoolName={activeSchoolTitle || ''}
                                faculty={faculty as any}
                            />
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
                        {filteredSchools.length > 0 ? (
                            filteredSchools.map((school) => (
                                <SchoolCard
                                    key={school.id}
                                    name={school.name}
                                    code={school.code}
                                    totalFaculty={school.faculty}
                                    type={school.type}
                                    onClick={() => handleSchoolClick(school.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                                <University className="h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No schools found</h3>
                                <p className="text-sm">We couldn't find any schools matching "{searchQuery}".</p>
                                <Button variant="link" onClick={clearSearch} className="mt-2">Clear search</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AddSchoolModal
                isOpen={isSchoolModalOpen}
                onOpenChange={setIsSchoolModalOpen}
                school={null}
            />

            <CreateFacultyAccountModal
                isOpen={isCreateAccountModalOpen}
                onOpenChange={setIsCreateAccountModalOpen}
                schools={schools}
            />
        </div>
    );
}
