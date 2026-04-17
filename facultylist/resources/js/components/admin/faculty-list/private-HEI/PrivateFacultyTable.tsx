import { router } from '@inertiajs/react';
import axios from 'axios';
import { FileText, Loader2, ArrowUpDown } from "lucide-react";
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { PrivateViewSubmissionModal } from './PrivateViewSubmissionModal';


const FacultyStatusSelect = ({ initialStatus, memberId }: { initialStatus: string, memberId: string | number }) => {
    const [status, setStatus] = useState(() => {
        const lower = (initialStatus || '').toLowerCase();
        if (lower === 'completed') return 'completed';
        if (lower === 'submitted') return 'submitted';
        if (lower === 'no_submission' || lower === 'no submission' || lower === 'no_submition') return 'no_submission';
        return 'pending';
    });
    const [isUpdating, setIsUpdating] = useState(false);

    // Sync state with props when server data changes
    React.useEffect(() => {
        const lower = (initialStatus || '').toLowerCase();
        if (lower === 'completed') setStatus('completed');
        else if (lower === 'submitted') setStatus('submitted');
        else if (lower === 'no_submission' || lower === 'no submission' || lower === 'no_submition') setStatus('no_submission');
        else setStatus('pending');
    }, [initialStatus]);


    const getStatusConfig = (val: string) => {
        if (val === 'submitted') return {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
            label: "Submitted",
            dbValue: "Submitted"
        };
        if (val === 'completed') return {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
            label: "Completed",
            dbValue: "Completed"
        };
        if (val === 'no_submission') return {
            bg: "bg-rose-50",
            text: "text-rose-700",
            border: "border-rose-200",
            label: "No Submission",
            dbValue: "No Submission"
        };
        return {
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
            label: "Not yet Completed",
            dbValue: "Not yet Completed"
        };
    };

    const handleStatusChange = (newVal: string) => {
        const config = getStatusConfig(newVal);
        setIsUpdating(true);
        setStatus(newVal);

        router.put(`/faculty/${memberId}`, {
            status: config.dbValue
        }, {
            onFinish: () => setIsUpdating(false),
            preserveScroll: true,
            preserveState: true
        });
    };

    const config = getStatusConfig(status);

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className={cn(
                "h-7 w-[180px] px-2.5 border shadow-sm transition-all rounded-md flex items-center justify-between gap-2 mx-auto",
                isUpdating ? "opacity-70 cursor-not-allowed grayscale-[0.2]" : "hover:bg-gray-50",
                config.bg, config.text, config.border
            )}>
                <div className="flex items-center gap-2 truncate justify-center w-full">
                    {isUpdating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                            {getStatusConfig(status).label}
                        </span>
                    )}
                </div>
            </SelectTrigger>
            <SelectContent className="min-w-[180px] p-1">
                <SelectItem value="completed" className="text-[11px] font-semibold text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700 rounded-sm">
                    <span>Completed</span>
                </SelectItem>
                <SelectItem value="pending" className="text-[11px] font-semibold text-amber-700 focus:bg-amber-50 focus:text-amber-700 rounded-sm">
                    <span>Not yet Completed</span>
                </SelectItem>
                <SelectItem value="no_submission" className="text-[11px] font-semibold text-rose-700 focus:bg-rose-50 focus:text-rose-700 rounded-sm">
                    <span>No Submission</span>
                </SelectItem>
            </SelectContent>
        </Select>
    );
};

interface FacultyMember {
    id: string | number;
    name: string;
    gender: string;
    group: string;
    rank: string;
    is_tenured: string;
    submissionStatus: 'submitted' | 'pending';
    status?: string;
    schoolYear: string;
    joined_year?: string;
}

interface ReferenceOption {
    code: string;
    desc: string;
}

interface ReferenceData {
    gender?: ReferenceOption[];
    facultyRank?: ReferenceOption[];
    tenure?: ReferenceOption[];
}

interface PrivateFacultyTableProps {
    faculty: FacultyMember[];
    referenceData?: ReferenceData;
    submittedYears: string[];
}

interface SingleYearPrivateTableProps {
    faculty: FacultyMember[];
    schoolYear: string;
    referenceData: ReferenceData;
    onViewSubmission: (member: FacultyMember) => void;
    isLoadingId: string | number | null;
}

const SingleYearPrivateTable = ({ faculty, schoolYear, referenceData, onViewSubmission, isLoadingId }: SingleYearPrivateTableProps) => {
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof FacultyMember; direction: "asc" | "desc" } | null>({
        key: "name",
        direction: "asc",
    });

    const onSort = (key: keyof FacultyMember) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getGenderLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.gender?.find((g: ReferenceOption) => String(g.code) === String(code));
        return found ? found.desc : code;
    };

    const getRankLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.facultyRank?.find((r: ReferenceOption) => String(r.code) === String(code));
        const label = found ? found.desc : code;
        if (label?.toLowerCase() === 'adjunct or affiliate faculty') {
            return 'Adjunct or Affiliate Faculty...';
        }
        return label;
    };

    const getTenureLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.tenure?.find((t: ReferenceOption) => String(t.code) === String(code));
        const label = found ? found.desc : code;
        return label === 'Permanent' ? 'Tenured' : label;
    };

    const sortedFaculty = useMemo(() => {
        if (!sortConfig) return faculty;
        return [...faculty].sort((a, b) => {
            const aVal = String(a[sortConfig.key] || '');
            const bVal = String(b[sortConfig.key] || '');
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [faculty, sortConfig]);

    const isAll = entriesPerPage === -1;
    const paginatedFaculty = useMemo(() => {
        if (isAll) return sortedFaculty;
        const start = (currentPage - 1) * entriesPerPage;
        return sortedFaculty.slice(start, start + entriesPerPage);
    }, [sortedFaculty, currentPage, entriesPerPage, isAll]);

    const totalPages = isAll ? 1 : Math.ceil(sortedFaculty.length / entriesPerPage) || 1;
    const startEntry = sortedFaculty.length === 0 ? 0 : (isAll ? 1 : (currentPage - 1) * entriesPerPage + 1);
    const endEntry = isAll ? sortedFaculty.length : Math.min(currentPage * entriesPerPage, sortedFaculty.length);

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
                    className={`h-8 w-8 p-0 rounded-none ${i === currentPage ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : "text-gray-600 border-gray-300 shadow-none font-bold"}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div className="flex flex-col gap-4 mt-2 mb-8">
            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 border border-gray-300 px-4 py-3">
                <div className="flex items-center text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <span>Show</span>
                    <Select
                        value={String(entriesPerPage)}
                        onValueChange={(val) => {
                            setEntriesPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="mx-2 h-7 w-[65px] rounded-none border-gray-300 bg-white shadow-none focus:ring-0 text-[11px] font-bold">
                            <SelectValue placeholder="25" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="-1" className="text-[11px] font-bold">All</SelectItem>
                            <SelectItem value="25" className="text-[11px] font-bold">25</SelectItem>
                            <SelectItem value="50" className="text-[11px] font-bold">50</SelectItem>
                            <SelectItem value="100" className="text-[11px] font-bold">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>entries</span>
                </div>
                <div className="text-black text-sm font-bold uppercase tracking-wide">
                    LIST OF PRIVATE FACULTY ({schoolYear})
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-300 bg-white">
                <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-white border-b border-gray-300">
                            <th className="px-3 py-2 font-bold text-center w-[20px] border-r border-blue-400">#</th>
                            <th className="px-3 py-2 font-bold text-left">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-100 transition-colors" onClick={() => onSort("schoolYear")}>
                                    ACADEMIC YEAR <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-left">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-blue-100 transition-colors" onClick={() => onSort("name")}>
                                    FACULTY NAME <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center">GENDER</th>
                            <th className="px-3 py-2 font-bold text-center">GENERIC FACULTY RANK</th>
                            <th className="px-3 py-2 font-bold text-center">TENURE</th>
                            <th className="px-3 py-2 font-bold text-center text-blue-100 italic">SUBMITTED FILE</th>
                            <th className="px-3 py-2 font-bold text-center w-[170px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {paginatedFaculty.length > 0 ? (
                            paginatedFaculty.map((member, index) => {
                                return (
                                    <tr key={member.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100">{startEntry + index}</td>
                                        <td className="px-3 py-2 text-left font-bold text-blue-700">{member.schoolYear}</td>
                                        <td className="px-3 py-2 text-left font-semibold text-gray-900">{member.name}</td>
                                        <td className="px-3 py-2 text-center text-black">{getGenderLabel(member.gender)}</td>
                                        <td className="px-3 py-2 text-center text-black">{getRankLabel(member.rank)}</td>
                                        <td className="px-3 py-2 text-center text-black">{getTenureLabel(member.is_tenured)}</td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => onViewSubmission(member)}
                                                    disabled={isLoadingId === member.id}
                                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 px-3 h-7 rounded-full shadow-sm border-b-2 border-blue-800 active:border-b-0 active:translate-y-px transition-all text-[10px] font-bold w-auto"
                                                    title="View Submission"
                                                >
                                                    {isLoadingId === member.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                                                    <span className="whitespace-nowrap uppercase">View Submission</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <FacultyStatusSelect initialStatus={member.status || ''} memberId={member.id} />
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <FileText className="h-10 w-10 text-gray-300" />
                                        <p>No records found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mt-1 mb-2 p-1">
                <div>
                    Showing {startEntry} to {endEntry} of {sortedFaculty.length} entries
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className={`h-8 px-3 rounded-none border-gray-300 shadow-none ${currentPage === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    {renderPageNumbers()}
                    <Button
                        variant="outline"
                        className={`h-8 px-3 rounded-none border-gray-300 shadow-none ${currentPage === totalPages || totalPages === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function PrivateFacultyTable({ faculty = [], referenceData = {}, submittedYears = [] }: PrivateFacultyTableProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingId, setIsLoadingId] = useState<string | number | null>(null);

    const handleViewProfile = async (member: FacultyMember) => {
        setIsLoadingId(member.id);
        try {
            const response = await axios.get(`/admin/faculty/${member.id}`);
            setSelectedFaculty(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch faculty details", error);
        } finally {
            setIsLoadingId(null);
        }
    };

    // Filter to only show faculty from officially submitted academic years
    const visibleFaculty = useMemo(() => {
        return faculty.filter(member => {
            const year = member.schoolYear || member.joined_year;
            return year && submittedYears.includes(year);
        });
    }, [faculty, submittedYears]);

    // Group faculty by academic year
    const groupedFaculty = useMemo(() => {
        const groups: Record<string, FacultyMember[]> = {};
        visibleFaculty.forEach(member => {
            const year = member.schoolYear || member.joined_year || 'Unknown';
            if (!groups[year]) groups[year] = [];
            groups[year].push(member);
        });
        // Sort years descending
        return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
    }, [visibleFaculty]);

    return (
        <div className="flex flex-col gap-4 mt-2">
            {groupedFaculty.length > 0 ? (
                groupedFaculty.map(([year, members]) => (
                    <SingleYearPrivateTable
                        key={year}
                        faculty={members}
                        schoolYear={year}
                        referenceData={referenceData}
                        onViewSubmission={handleViewProfile}
                        isLoadingId={isLoadingId}
                    />
                ))
            ) : (
                <div className="overflow-x-auto border border-gray-300 bg-white p-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                        <FileText className="h-10 w-10 text-gray-300" />
                        <p>No records found.</p>
                    </div>
                </div>
            )}

            <PrivateViewSubmissionModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                selectedFaculty={selectedFaculty}
                referenceData={referenceData}
            />
        </div>
    );
}

