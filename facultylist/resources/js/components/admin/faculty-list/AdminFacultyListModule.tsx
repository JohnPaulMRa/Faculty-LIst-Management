/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';
import { Search, X, University, Users, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PrivateSchoolView } from '@/components/admin/faculty-list/private-HEI/PrivateSchoolView';
import { PublicSchoolView } from '@/components/admin/faculty-list/public-HEI/PublicSchoolView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof School; direction: "asc" | "desc" } | null>({
        key: "name",
        direction: "asc",
    });

    const onSort = (key: keyof School) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const activeSchoolTitle = schools.find(s => s.id === selectedSchoolId)?.name;

    // Filter schools based on sidebar type and search query
    const filteredSchools = useMemo(() => {
        return schools.filter(school => {
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
    }, [schools, filters.type, debouncedSearch]);

    const sortedSchools = useMemo(() => {
        if (!sortConfig) return filteredSchools;
        return [...filteredSchools].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            // Handle nulls or undefined
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredSchools, sortConfig]);

    const isAll = entriesPerPage === -1;
    const paginatedSchools = useMemo(() => {
        if (isAll) return sortedSchools;
        const start = (currentPage - 1) * entriesPerPage;
        return sortedSchools.slice(start, start + entriesPerPage);
    }, [sortedSchools, currentPage, entriesPerPage, isAll]);

    const totalPages = isAll ? 1 : Math.ceil(sortedSchools.length / entriesPerPage) || 1;
    const startEntry = sortedSchools.length === 0 ? 0 : (isAll ? 1 : (currentPage - 1) * entriesPerPage + 1);
    const endEntry = isAll ? sortedSchools.length : Math.min(currentPage * entriesPerPage, sortedSchools.length);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, entriesPerPage]);

    const renderPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    className={`h-10 w-10 p-0 rounded-xl font-bold transition-all ${i === currentPage ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-105" : "text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50"}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

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
        <div className="flex flex-col w-full h-full bg-white overflow-hidden relative rounded-xl shadow-sm border border-gray-200">
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faculty Management</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage HEIs and faculty members. {selectedSchoolId ? "Viewing faculty for the selected school." : "Select a school to view details."}
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
                    <div className="flex flex-col bg-white shadow-xl shadow-blue-900/5 overflow-hidden rounded-none border border-blue-100/50 mt-4 animate-in fade-in duration-500">
                        <div className="bg-white flex items-center justify-between px-6 py-4 text-slate-900 border-b border-slate-100 shadow-sm">
                            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-900">
                                <span>Show</span>
                                <Select
                                    value={String(entriesPerPage)}
                                    onValueChange={(val) => setEntriesPerPage(Number(val))}
                                >
                                    <SelectTrigger className="mx-3 h-10 w-[80px] rounded-xl border-slate-200 bg-slate-50 shadow-none focus:ring-2 focus:ring-blue-600/10 text-slate-900 font-bold">
                                        <SelectValue placeholder="25" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200">
                                        <SelectItem value="-1">All</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>entries</span>
                            </div>
                            <div className="text-sm font-bold uppercase tracking-widest text-center text-slate-900">
                                LIST OF {filters.type ? `${filters.type.toUpperCase()} (HEIs)` : 'HIGHER EDUCATION INSTITUTIONS (HEIs)'}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white uppercase text-[11px] font-bold tracking-widest">
                                        <th className="px-3 py-3 font-bold w-[40px] text-center border-r border-white/10">#</th>
                                        <th className="px-3 py-3 font-bold w-[25%] text-left">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("hei_code")}>
                                                HEI Code <ArrowUpDown className="h-3 w-3 opacity-70" />
                                            </div>
                                        </th>
                                        <th className="px-3 py-3 font-bold w-[30%] text-left">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("name")}>
                                                List of HEIs <ArrowUpDown className="h-3 w-3 opacity-70" />
                                            </div>
                                        </th>
                                        <th className="px-3 py-3 font-bold w-[20%] text-left">
                                            <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("academic_year")}>
                                                Academic Year <ArrowUpDown className="h-3 w-3 opacity-70" />
                                            </div>
                                        </th>
                                        <th className="px-3 py-3 font-bold w-[20%] text-center">
                                            <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("faculty")}>
                                                Total Faculty <ArrowUpDown className="h-3 w-3 opacity-70" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm">
                                    {paginatedSchools.length > 0 ? (
                                        paginatedSchools.map((school, index) => (
                                            <tr
                                                key={school.id}
                                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => handleSchoolClick(school.id)}
                                            >
                                                <td className="px-3 py-2 text-left text-gray-500 ">
                                                    {startEntry + index}
                                                </td>
                                                <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                                    {school.hei_code || <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                                    <div>{school.name}</div>
                                                </td>
                                                <td className="px-3 py-2 text-left  text-blue-700">
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

                        <div className="flex justify-between items-center text-sm text-slate-600 px-6 py-4 bg-white border-t border-slate-100">
                            <div className="font-medium">
                                Showing <span className="text-blue-600 font-bold">{startEntry}</span> to <span className="text-blue-600 font-bold">{endEntry}</span> of <span className="text-slate-900 font-bold">{sortedSchools.length}</span> entries
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    className={`h-10 px-4 rounded-xl border-slate-200 font-bold transition-all ${currentPage === 1 ? "opacity-30" : "text-slate-600 hover:bg-slate-50"}`}
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1.5">
                                    {renderPageNumbers()}
                                </div>
                                <Button
                                    variant="outline"
                                    className={`h-10 px-4 rounded-xl border-slate-200 font-bold transition-all ${currentPage === totalPages || totalPages === 0 ? "opacity-30" : "text-slate-600 hover:bg-slate-50"}`}
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
