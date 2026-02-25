import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, LayoutGrid, X, University, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SchoolNameModal from '@/components/faculty/SchoolNameModal';
import { router } from '@inertiajs/react';
import { useDebounce } from '@/hooks/use-debounce';
import { PrivateSchoolView } from '@/components/admin/faculty-list/private-HEI/PrivateSchoolView';
import { PublicSchoolView } from '@/components/admin/faculty-list/public-HEI/PublicSchoolView';
import CreateFacultyAccountModal from './CreateFacultyAccountModal';
import { AdminFacultySidebar } from './AdminFacultySidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
        <SidebarProvider className="min-h-0 h-full overflow-hidden rounded-xl shadow-sm bg-white">
            <AdminFacultySidebar
                schools={schools}
                selectedSchoolId={selectedSchoolId}
                onSchoolSelect={handleSchoolClick}
                typeFilter={filters.type as string | undefined}
            />

            <SidebarInset className="flex flex-col w-full h-full bg-white overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Management</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Manage schools and faculty members. Select a school from the sidebar to view details.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                onClick={handleAddSchool}
                                variant="outline"
                                className="w-full md:w-auto rounded-md h-10 gap-2 border-gray-300"
                            >
                                <Plus className="h-4 w-4" /> Add School
                            </Button>
                            <Button
                                onClick={() => setIsCreateAccountModalOpen(true)}
                                className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-md h-10 gap-2"
                            >
                                <Plus className="h-4 w-4" /> Create Account
                            </Button>
                        </div>
                    </div>

                    {/* Faculty List Table Section */}
                    {selectedSchoolId ? (
                        schools.find(s => s.id === selectedSchoolId)?.type === 'Private' ? (
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
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 h-[50vh]">
                            <LayoutGrid className="h-16 w-16 text-gray-200 mb-6" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No School Selected</h3>
                            <p className="text-sm max-w-sm">Select a school from the sidebar to view and manage its faculty list.</p>
                        </div>
                    )}
                </div>
            </SidebarInset>

            <SchoolNameModal
                isOpen={isSchoolModalOpen}
                onOpenChange={setIsSchoolModalOpen}
                school={null}
            />

            <CreateFacultyAccountModal
                isOpen={isCreateAccountModalOpen}
                onOpenChange={setIsCreateAccountModalOpen}
                schools={schools}
            />
        </SidebarProvider>
    );
}
