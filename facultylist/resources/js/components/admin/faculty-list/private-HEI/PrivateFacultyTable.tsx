import React, { useState } from 'react';
import { FileText, Eye, Loader2 } from "lucide-react";
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { edit } from '@/routes/faculty';
import { ViewSubmissionModal } from './ViewSubmissionModal';

interface FacultyMember {
    id: string | number;
    name: string;
    sex: string;
    type: string;
    submissionStatus: 'submitted' | 'pending';
    schoolYear: string;
}

interface PrivateFacultyTableProps {
    faculty: FacultyMember[];
    referenceData?: any;
}

export default function PrivateFacultyTable({ faculty, referenceData }: PrivateFacultyTableProps) {
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
    const getStatusBadge = (status: string): string => {
        const styles: Record<string, string> = {
            'submitted': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            'pending': 'bg-amber-100 text-amber-700 border border-amber-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
    };

    // Extract unique sorted years
    const allYears = Array.from(new Set(faculty.map(member => member.schoolYear || 'Unknown Year')))
        .sort((a, b) => b.localeCompare(a));

    const [selectedYear, setSelectedYear] = useState<string>('');
    const activeYear = selectedYear && allYears.includes(selectedYear) ? selectedYear : (allYears[0] || '');

    // Filter faculty based on selected year
    const filteredFaculty = faculty.filter(member => (member.schoolYear || 'Unknown Year') === activeYear);

    return (
        <div className="flex flex-col bg-white shadow-none overflow-hidden rounded-none border border-gray-200">
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

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-white border-b border-gray-300">
                            <th className="px-3 py-2 font-bold text-center w-[5%]">#</th>
                            <th className="px-3 py-2 font-bold w-[20%] text-left">Faculty Name</th>
                            <th className="px-3 py-2 font-bold w-[20%] text-left">Gender</th>
                            <th className="px-3 py-2 font-bold w-[25%] text-center">Full-Time / Part-Time</th>
                            <th className="px-3 py-2 font-bold w-[20%] text-center">Submit Status</th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {filteredFaculty.map((member, index) => (
                            <tr key={member.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 text-center text-black">{index + 1}</td>
                                <td className="px-3 py-2 text-left font-semibold text-gray-900">{member.name}</td>
                                <td className="px-3 py-2 text-left text-black">{member.sex}</td>
                                <td className="px-3 py-2 text-left text-black">
                                    <div
                                        className="truncate max-w-[300px] text-sm"
                                        title={member.type}
                                    >
                                        {member.type}
                                    </div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-none font-bold ${getStatusBadge(member.submissionStatus)}`}>
                                        {member.submissionStatus}
                                    </span>
                                </td>
                                <td className="px-3 py-2 font-bold text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleViewProfile(member)}
                                            disabled={isLoadingId === member.id}
                                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors bg-white hover:bg-blue-50 disabled:opacity-50 px-3 py-1.5 rounded-[4px] border border-blue-200 shadow-sm text-xs font-semibold w-36 justify-center"
                                            title="View Submission"
                                        >
                                            {isLoadingId === member.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                                            View Submission
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredFaculty.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm border border-gray-300 bg-gray-50">
                                    No records found for the selected view.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ViewSubmissionModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                selectedFaculty={selectedFaculty}
                referenceData={referenceData}
            />
        </div>
    );
}
