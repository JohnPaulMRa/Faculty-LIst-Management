/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { FileText, Loader2 } from "lucide-react";
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
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

    // Note: In the admin view, we only show submitted years anyway.
    const isUnsubmitted = (initialStatus || '').toLowerCase() === 'not updated' || (initialStatus || '').toLowerCase() === 'updated' || !(initialStatus);

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

interface PrivateFacultyTableProps {
    faculty: FacultyMember[];
    referenceData?: any;
    submittedYears: string[];
}

export default function PrivateFacultyTable({ faculty = [], referenceData = {}, submittedYears = [] }: PrivateFacultyTableProps) {
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
            // Fallback or show toast
        } finally {
            setIsLoadingId(null);
        }
    };

    const getGenderLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.gender?.find((g: any) => String(g.code) === String(code));
        return found ? found.desc : code;
    };

    const getRankLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.facultyRank?.find((r: any) => String(r.code) === String(code));
        const label = found ? found.desc : code;
        if (label?.toLowerCase() === 'adjunct or affiliate faculty') {
            return 'Adjunct or Affiliate Faculty...';
        }
        return label;
    };

    const getTenureLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.tenure?.find((t: any) => String(t.code) === String(code));
        const label = found ? found.desc : code;
        return label === 'Permanent' ? 'Tenured' : label;
    };

    const getGroupLabel = (code: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.groupDiscipline?.find((g: any) => String(g.code) === String(code));
        return found ? found.desc : code;
    };

    const getStatusBadgeStyle = (status: string): string => {
        const s = (status || '').trim();
        const lower = s.toLowerCase();

        if (lower === 'updated') return 'bg-green-400 text-white border-green-600 shadow-sm';
        if (lower === 'submitted') return 'bg-green-500 text-white border-green-700 shadow-sm';
        if (lower === 'not updated' || lower === 'not yet completed' || lower === 'no submission' || lower === 'pending') {
            return 'bg-red-400 text-white border-red-600 shadow-sm';
        }

        return 'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm';
    };

    // Filter to only show faculty from officially submitted academic years
    const visibleFaculty = faculty.filter(member => {
        const year = member.schoolYear || member.joined_year;
        return year && submittedYears.includes(year);
    });

    // Group faculty by year
    const groupedFaculty = visibleFaculty.reduce((acc, member) => {
        const year = member.schoolYear || 'Unknown Year';
        if (!acc[year]) acc[year] = [];
        acc[year].push(member);
        return acc;
    }, {} as Record<string, FacultyMember[]>);

    // Sort years newest first
    const sortedYears = Object.keys(groupedFaculty).sort((a, b) => b.localeCompare(a));

    return (
        <div className="flex flex-col gap-8">
            {sortedYears.map(year => (
                <div key={year} className="flex flex-col overflow-hidden">
                    {/* Year Section Header */}
                    <div className="bg-gray-100 px-4 py-2 border-t border-l border-r border-gray-300 font-bold text-gray-700">

                        Academic Year: {year}
                    </div>

                    <div className="overflow-x-auto border border-gray-300">
                        <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                            <thead>
                                <tr className="bg-blue-500 text-white border-b border-gray-300">
                                    <th className="px-3 py-2 font-bold text-center w-[20px]">#</th>
                                    <th className="px-3 py-2 font-bold text-left">FACULTY NAME</th>
                                    <th className="px-3 py-2 font-bold text-center">GENDER</th>
                                    <th className="px-3 py-2 font-bold text-center">GENERIC FACULTY RANK</th>
                                    <th className="px-3 py-2 font-bold text-center">TENURE</th>
                                    <th className="px-3 py-2 font-bold text-center">SUBMITTED FILE</th>
                                    <th className="px-3 py-2 font-bold text-center w-[170px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-sm">
                                {groupedFaculty[year].map((member, index) => {
                                    return (
                                        <tr key={member.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                                            <td className="px-3 py-2 text-center text-black border-r border-gray-100">{index + 1}</td>
                                            <td className="px-3 py-2 text-left font-semibold text-gray-900">{member.name}</td>
                                            <td className="px-3 py-2 text-center text-black">{getGenderLabel(member.gender)}</td>
                                            <td className="px-3 py-2 text-center text-black">{getRankLabel(member.rank)}</td>
                                            <td className="px-3 py-2 text-center text-black">{getTenureLabel(member.is_tenured)}</td>
                                            <td className="px-3 py-2 text-center">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => handleViewProfile(member)}
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
                                })}
                                {groupedFaculty[year].length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                                <FileText className="h-10 w-10 text-gray-300" />
                                                <p>No records found for this academic year.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {sortedYears.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 text-gray-400 py-16">
                    <FileText className="h-10 w-10 text-gray-300" />
                    <p className="text-sm">No faculty records available.</p>
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
