import { Link } from '@inertiajs/react';
import { Trash2, Eye } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import type { Faculty } from '@/types/faculty';
import { edit } from '@/routes/faculty';

type Props = {
    facultyList: Faculty[];
    yearFilter: string;
    onFileClick: (faculty: Faculty) => void;
    onDelete: (id: string) => void;
    onEdit: (faculty: Faculty) => void;
    referenceData: any;
};

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

const FacultyListTableE5: FC<Props> = ({ facultyList, yearFilter, onFileClick, onDelete, onEdit, referenceData }) => {
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(facultyList.length / pageSize);
    const paginated = facultyList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const getStatusBadge = (status: string): string => {
        const styles: Record<string, string> = {
            'Updated': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            'Not Updated': 'bg-red-100 text-red-700 border border-red-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
    };

    const getGender = (code?: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.gender?.find((g: any) => g.code == code);
        return found ? found.desc : code;
    };

    const getEmploymentStatus = (faculty: Faculty) => {
        if (faculty.fullTimeCode) {
            const found = referenceData?.fullTimePartTime?.find((f: any) => f.code == faculty.fullTimeCode);
            if (found) {
                const desc = found.desc.toLowerCase();
                if (desc.includes('full-time')) return 'Full-Time';
                if (desc.includes('half-time')) return 'Half-Time';
                if (desc.includes('student')) return 'Student Employee';
                if (desc.includes('teaching fellow')) return 'Teaching Fellow';
                if (desc.includes('lecturer')) return 'Lecturer';
                if (desc.includes('part-time')) return 'Part-Time';
                if (desc.includes('not known')) return 'Unknown';
                return found.desc;
            }
        }
        return faculty.employment === 'Plantilla' ? 'Full-Time' : faculty.employment;
    };

    return (
        <div className="flex flex-col border border-gray-300 bg-white shadow-none overflow-hidden rounded-none m-4">
            {/* Show entries control */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-600">Show</span>
                <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-none text-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                    {PAGE_SIZE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="overflow-x-auto">
                {/* SPREADSHEET HEADER */}
                <div className="bg-gray-50 text-black px-4 py-3 text-sm font-bold uppercase tracking-wide border-b border-gray-300">
                    FACULTY DATA RECORDS
                </div>

                <table className="w-full border-collapse text-xl whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-black border-b border-gray-300">
                            <th className="px-3 py-2 font-bold text-center">No.</th>
                            <th className="px-3 py-2 font-bold text-center">Academic Year</th>
                            <th className="px-3 py-2 font-bold text-center">Faculty Name</th>
                            <th className="px-3 py-2 font-bold text-center">Gender</th>
                            <th className="px-3 py-2 font-bold text-center">Full-Time / Part-Time</th>
                            <th className="px-3 py-2 font-bold text-center">Status</th>
                            <th className="px-3 py-2 font-bold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {paginated.length > 0 ? (
                            paginated.map((faculty, index) => (
                                <tr key={faculty.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                                    <td className="px-3 py-2 text-center text-black">{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td className="px-3 py-2 text-center text-black">{faculty.joined_year}</td>
                                    <td className="px-3 py-2 text-center font-medium text-black">{faculty.name}</td>
                                    <td className="px-3 py-2 text-center text-black">{getGender(faculty.genderCode)}</td>
                                    <td className="px-3 py-2 text-center text-black">
                                        {getEmploymentStatus(faculty)}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-none font-bold ${getStatusBadge(faculty.status)}`}>
                                            {faculty.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={edit({ id: faculty.id }).url}
                                                className="flex items-center gap-1 text-white-600 hover:text-blue-500 transition-colors bg-blue-200 px-2 py-1.5 rounded-none border border-blue-200 text-xs font-semibold"
                                                title="Edit Profile"
                                            >
                                                <Eye className="h-3 w-3" /> Edit Profile
                                            </Link>
                                            <button
                                                onClick={() => onDelete(faculty.id)}
                                                className="flex items-center gap-1 text-white-600 hover:text-red-500 transition-colors bg-red-200 px-2 py-1.5 rounded-none border border-red-200 text-xs font-semibold"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-sm border border-gray-300 bg-gray-50">
                                    No records found for {yearFilter}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            {facultyList.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-sm text-gray-600">
                    <span>
                        Showing {Math.min((currentPage - 1) * pageSize + 1, facultyList.length)}–{Math.min(currentPage * pageSize, facultyList.length)} of {facultyList.length} entries
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-none text-sm disabled:opacity-40 hover:bg-gray-100 font-medium"
                        >Previous</button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                            const page = start + i;
                            return page <= totalPages ? (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 border rounded-none text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ) : null;
                        })}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 border border-gray-300 rounded-none text-sm disabled:opacity-40 hover:bg-gray-100 font-medium"
                        >Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyListTableE5;
