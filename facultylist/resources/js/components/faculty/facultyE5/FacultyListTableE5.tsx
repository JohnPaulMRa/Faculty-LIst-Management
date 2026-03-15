import { Link } from '@inertiajs/react';
import { Trash2, Eye, ArrowUpDown } from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo } from 'react';
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
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const getStatusBadge = (status: string): string => {
        const styles: Record<string, string> = {
            'Updated': 'bg-green-400 text-white border-green-600 shadow-sm',
            'Not Updated': 'bg-red-400 text-white border-red-600 shadow-sm',
        };
        return styles[status] || 'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm';
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
                return found.desc;
            }
        }
        if (faculty.employment) {
            return faculty.employment === 'Plantilla' ? 'Full-Time' : faculty.employment;
        }

        return '';
    };

    const sortedFacultyList = useMemo(() => {
        if (!sortConfig) return facultyList;

        return [...facultyList].sort((a: any, b: any) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'joined_year') {
                aValue = a.joined_year || '';
                bValue = b.joined_year || '';
            } else if (sortConfig.key === 'gender') {
                aValue = getGender(a.genderCode);
                bValue = getGender(b.genderCode);
            } else if (sortConfig.key === 'employment') {
                aValue = getEmploymentStatus(a);
                bValue = getEmploymentStatus(b);
            }

            if (aValue === null || aValue === undefined) aValue = '';
            if (bValue === null || bValue === undefined) bValue = '';

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [facultyList, sortConfig, referenceData]);

    const totalPages = Math.ceil(sortedFacultyList.length / pageSize);
    const paginated = sortedFacultyList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex flex-col bg-white shadow-none overflow-hidden rounded-none">
            {/* SPREADSHEET HEADER */}
            <div className="bg-gray-50 text-black px-4 py-3 text-sm font-bold uppercase tracking-wide border-b border-gray-300">
                FACULTY DATA RECORDS
            </div>

            {/* Show entries control */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-white">
                <span className="text-sm text-gray-600">Show</span>
                <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-none text-xs px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                    {PAGE_SIZE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <span className="text-xs text-gray-600">entries</span>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-white border-b border-gray-300">
                            <th className="px-3 py-2 font-bold text-center w-[5%]">#</th>
                            <th className="px-3 py-2 font-bold w-[15%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('joined_year')}>
                                    Academic Year <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold w-[10%]">
                                <div className="flex items-center justify-start gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('name')}>
                                    Faculty Name <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold w-[10%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('gender')}>
                                    Gender <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold w-[20%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('employment')}>
                                    Full-Time / Part-Time <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold w-[15%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('status')}>
                                    Status <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {paginated.length > 0 ? (
                            paginated.map((faculty, index) => (
                                <tr key={faculty.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                                    <td className="px-3 py-2 text-center text-black">{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td className="px-3 py-2 text-center text-black">{faculty.joined_year}</td>
                                    <td className="px-3 py-2 text-left font-semibold text-gray-900">{faculty.name}</td>
                                    <td className="px-3 py-2 text-center text-black">{getGender(faculty.genderCode)}</td>
                                    <td className="px-3 py-2 text-left text-black">
                                        <div
                                            className="truncate max-w-[420px] text-sm"
                                            title={getEmploymentStatus(faculty)}
                                        >
                                            {getEmploymentStatus(faculty)}
                                        </div>
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
                                                className="flex items-center gap-1 black-[#ffffff] hover:text-white transition-colors bg-[#ffbb00]/50 hover:bg-[#ffbb00] px-2 py-1.5 rounded-sm border border-[#ffbb00]/30 shadow-sm text-xs font-semibold"
                                                title="Edit Profile"
                                            >
                                                <Eye className="h-2 w-2" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => onDelete(faculty.id)}
                                                className="flex items-center gap-1 text-red-700 hover:text-white transition-colors bg-red-50 hover:bg-red-600 px-2 py-1.5 rounded-sm border border-red-200 shadow-sm text-xs font-semibold"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-2 w-2" /> Delete
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
                <div className="flex items-center justify-between px-2 py-0 border-t border-gray-200 bg-white text-sm text-gray-600 rounded-none">
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
                            className="px-2 py-1.5 border border-gray-300 rounded-none text-sm disabled:opacity-40 hover:bg-gray-100 font-medium"
                        >Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyListTableE5;
