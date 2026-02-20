import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, LayoutGrid, X, University, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SchoolCard from './SchoolCard';
import AdminFacultyTable from './AdminFacultyTable';
import SchoolNameModal from '@/components/faculty/SchoolNameModal';
import { router } from '@inertiajs/react';
import { useDebounce } from '@/hooks/use-debounce';
import FacultyListTableE5 from '@/components/faculty/facultyE5/FacultyListTableE5';
import CreateFacultyAccountModal from './CreateFacultyAccountModal';

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
    filters: { school_id?: string; search?: string };
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
        <div className="flex flex-col gap-8 w-full">
            {/* Header / Search Area */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Management</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage schools and faculty members. Select a school to view details.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateAccountModalOpen(true)}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-md h-10 gap-2"
                    >
                        Create Faculty  Account
                    </Button>
                </div>

                <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search schools or faculty..."
                                className="pl-9 pr-9 bg-gray-50 border-gray-300 rounded-md focus-visible:ring-1 focus-visible:ring-gray-400 h-10"
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
                            <Button variant="outline" className="rounded-md border-gray-300 gap-2 h-10 hidden md:flex">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button
                                onClick={handleAddSchool}
                                className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-md h-10 gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add School
                            </Button>
                        </div>
                    </div>

                    {/* School List Table */}
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">School Name</th>
                                    <th scope="col" className="px-6 py-3">Code</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3 text-right">Faculty Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schools.map((school) => (
                                    <tr
                                        key={school.id}
                                        onClick={() => handleSchoolClick(school.id)}
                                        className={`cursor-pointer hover:bg-gray-50 transition-colors border-b last:border-0 ${selectedSchoolId === school.id ? 'bg-blue-50/50' : 'bg-white'
                                            }`}
                                    >
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3 font-medium text-gray-900">
                                                <div className={`p-2 rounded-md shrink-0 ${selectedSchoolId === school.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <University className="h-4 w-4" />
                                                </div>
                                                <span>{school.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            {school.code ? (
                                                <span className="font-mono text-xs px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
                                                    {school.code}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${school.type?.toLowerCase() === 'private'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                {school.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-500">
                                                <Users className="h-4 w-4" />
                                                <span>{school.faculty}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {schools.length === 0 && (
                        <div className="py-12 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                            <LayoutGrid className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No schools found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Faculty List Table Section */}
            {selectedSchoolId ? (
                <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-gray-400 font-normal">Faculty List:</span>
                                {activeSchoolTitle}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Viewing all faculty members for this school.</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-md border-gray-300">
                            Download Report
                        </Button>
                    </div>

                    {schools.find(s => s.id === selectedSchoolId)?.type === 'Private' ? (
                        <FacultyListTableE5
                            facultyList={faculty as any} // Cast to any or Faculty[] if types align
                            yearFilter="All Years"
                            referenceData={referenceData}
                            onFileClick={(f) => console.log('File click', f)}
                            onDelete={(id) => {
                                if (confirm('Are you sure you want to delete this faculty member?')) {
                                    router.delete(route('admin.faculty.destroy', id)); // Ensure this route exists or update to correct one
                                }
                            }}
                            // For edit, we might need to redirect to admin edit page or similar
                            onEdit={(f) => console.log('Edit', f)}
                        />
                    ) : (
                        <AdminFacultyTable faculty={faculty} />
                    )}
                </div>
            ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 p-12 text-center text-gray-500 rounded-xl flex flex-col items-center justify-center">
                    <LayoutGrid className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No School Selected</h3>
                    <p className="text-sm">Select a school from the grid above to view its faculty list.</p>
                </div>
            )}

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
        </div>
    );
}
