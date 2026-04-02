import axios from 'axios';
import { FileText, Loader2 } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PublicViewSubmissionModal } from './PublicViewSubmissionModal';

interface FacultyMember {
    id: string | number;
    name: string;
    gender: string;
    group: string;
    rank: string;
    is_tenured: string;
    submissionStatus: 'submitted' | 'pending';
    schoolYear: string;
}

interface PublicFacultyTableProps {
    faculty: FacultyMember[];
    referenceData?: any;
}

export default function PublicFacultyTable({ faculty, referenceData }: PublicFacultyTableProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
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
        // Use tenureE2 for Public HEI
        const found = referenceData?.tenureE2?.find((t: any) => String(t.code) === String(code));
        return found ? found.desc : code;
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

    // Extract unique sorted years
    const allYears = Array.from(new Set(faculty.map(member => member.schoolYear || 'Unknown Year')))
        .sort((a, b) => b.localeCompare(a));

    const activeYear = selectedYear && allYears.includes(selectedYear) ? selectedYear : (allYears[0] || '');

    // Filter faculty based on selected year
    const filteredFaculty = faculty.filter(member => (member.schoolYear || 'Unknown Year') === activeYear);

    return (
        <div className="flex flex-col overflow-hidden mt-2">
            {/* SPREADSHEET HEADER */}
            <div className="bg-gray-50 flex items-center justify-between px-4 py-3 border-b border-gray-300">
                <div className="text-black text-sm font-bold uppercase tracking-wide">
                    FACULTY DATA RECORDS
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Academic Year:</label>
                    <select
                        value={activeYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="text-sm border border-gray-300 rounded-[2px] px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm font-medium w-30"
                    >
                        {allYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-300">
                <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-white border-b border-gray-300">
                            <th className="px-3 py-2 font-bold text-center w-[20px]">#</th>
                            <th className="px-3 py-2 font-bold text-center">Faculty Name</th>
                            <th className="px-3 py-2 font-bold text-center w-[200px]">Gender</th>
                            <th className="px-3 py-2 font-bold text-center w-[240px]">Group</th>
                            <th className="px-3 py-2 font-bold text-center">GENERIC FACULTY RANK</th>
                            <th className="px-3 py-2 font-bold text-center">Tenured</th>
                            <th className="px-3 py-2 font-bold text-center">Submit Status</th>
                            <th className="px-3 py-2 font-bold text-center w-[150px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {filteredFaculty.map((member, index) => {
                            const isSubmitted = member.submissionStatus.toLowerCase() === 'submitted';
                            const statusBadgeClass = isSubmitted
                                ? "text-[10px] uppercase tracking-wide px-2 py-1 rounded-none font-bold bg-green-100/80 text-emerald-800 border border-emerald-300"
                                : `text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-none font-bold ${getStatusBadgeStyle(member.submissionStatus)}`;

                            return (
                                <tr key={member.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                                    <td className="px-3 py-2 text-center text-black border-r border-gray-100">{index + 1}</td>
                                    <td className="px-3 py-2 text-center font-semibold text-gray-900">{member.name}</td>
                                    <td className="px-3 py-2 text-center text-black">{getGenderLabel(member.gender)}</td>
                                    <td className="px-3 py-2 text-center text-black">{getGroupLabel(member.group)}</td>
                                    <td className="px-3 py-2 text-center text-black">{getRankLabel(member.rank)}</td>
                                    <td className="px-3 py-2 text-center text-black">{getTenureLabel(member.is_tenured)}</td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={statusBadgeClass}>
                                            {member.submissionStatus}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewProfile(member)}
                                                disabled={isLoadingId === member.id}
                                                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md border-b-2 border-blue-800 active:border-b-0 active:translate-y-px transition-all text-xs font-semibold flex items-center gap-2"
                                                title="View Submission"
                                            >
                                                {isLoadingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                                                View Submission
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredFaculty.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <FileText className="h-10 w-10 text-gray-300" />
                                        <p>No records found for the selected view.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PublicViewSubmissionModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                selectedFaculty={selectedFaculty}
                referenceData={referenceData}
            />
        </div>
    );
}
