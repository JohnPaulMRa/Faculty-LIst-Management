import { Link } from '@inertiajs/react';
import {
    Trash2,
    Pencil,
    ArrowUpDown
} from 'lucide-react';
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { edit } from '@/routes/faculty';
import type { Faculty } from '@/types/faculty';
import { IMPORT_GROUPS } from '@/types/faculty/constants';

type Props = {
    facultyList: Faculty[];
    yearFilter: string;
    onFileClick: (faculty: Faculty) => void;
    onDelete: (id: string) => void;
    onEdit: (faculty: Faculty) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    referenceData?: any;
};

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

const FacultyListTableE2: FC<Props> = ({ facultyList, yearFilter, onDelete, referenceData }) => {
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
        const s = status?.trim();
        const styles: Record<string, string> = {
            'Updated': 'bg-green-400 text-white border-green-600 shadow-sm',
            'Submitted': 'bg-green-500 text-white border-green-700 shadow-sm',
            'No Submission': 'bg-red-400 text-white border-red-600 shadow-sm',
            'Not Yet Completed': 'bg-red-400 text-white border-red-600 shadow-sm',
        };
        return styles[s] || 'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm';
    };

    const getGender = (code?: string) => {
        if (!code) return 'N/A';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = referenceData?.gender?.find((g: any) => g.code == code);
        return found ? found.desc : code;
    };

    const getTenured = (code?: string) => {
        if (!code) return 'N/A';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = referenceData?.tenured?.find((g: any) => g.code == code);
        return found ? found.desc : code;
    };

    const getGroup = (faculty: Faculty) => {
        if (faculty.form_type !== 'E2') return 'N/A';
        const groupValue = faculty.import_group;
        if (!groupValue) return 'N/A';

        const found = IMPORT_GROUPS.find(g =>
            g.value === groupValue ||
            g.value === `GROUP ${groupValue}` ||
            g.value.replace('GROUP ', '') === groupValue
        );

        const finalValue = found ? found.value : groupValue;
        return finalValue.replace('GROUP ', '');
    };

    const getGenericFacultyRank = (faculty: Faculty) => {
        if (faculty.form_type !== 'E2') return 'N/A';
        const code = faculty.rank;
        if (!code) return 'N/A';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = referenceData?.facultyRank?.find((r: any) => r.code == code);
        const desc = found ? found.desc : code;

        // Shorten long adjunct or affiliate faculty description
        if (desc && desc.toString().toLowerCase().includes("adjunct or affiliate faculty")) {
            return "Adjunct or Affiliate Faculty...";
        }

        return desc || 'N/A';
    };

    const sortedFacultyList = useMemo(() => {
        if (!sortConfig) return facultyList;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return [...facultyList].sort((a: any, b: any) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'joined_year') {
                aValue = a.joined_year || '';
                bValue = b.joined_year || '';
            }

            if (aValue === null || aValue === undefined) aValue = '';
            if (bValue === null || bValue === undefined) bValue = '';

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
         
    }, [facultyList, sortConfig]);

    const totalPages = Math.ceil(sortedFacultyList.length / pageSize);
    const paginated = sortedFacultyList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex flex-col bg-white shadow-none overflow-hidden ">
            {/* SPREADSHEET HEADER */}
            <div className="bg-gray-50 text-black px-4 py-3 text-sm font-bold uppercase tracking-wide border-b border-gray-300">
                FACULTY DATA RECORDS (E2)
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
                            <th className="px-3 py-2 font-bold text-center w-[0%]">#</th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('joined_year')}>
                                    Academic Year <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('name')}>
                                    Faculty Name <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[5%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('name')}>
                                    Gender <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[5%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('group')}>
                                    Group <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('rank')}>
                                    GENERIC FACULTY RANK <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-200" onClick={() => handleSort('name')}>
                                    Tenured <ArrowUpDown className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">Status</th>
                            <th className="px-3 py-2 font-bold text-center w-[1%]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {paginated.length > 0 ? (
                            paginated.map((faculty, index) => (
                                <tr key={faculty.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                                    <td className="px-3 py-2 text-center text-black">{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td className="px-3 py-2 text-center text-black">{faculty.joined_year}</td>
                                    <td className="px-3 py-2 text-center font-semibold text-gray-900">{faculty.name}</td>
                                    <td className="px-3 py-2 text-center text-black">
                                        {faculty.form_type === 'E2' ? getGender(faculty.gender) : 'N/A'}
                                    </td>
                                    <td className="px-3 py-2 text-center text-black font-medium">
                                        {getGroup(faculty)}
                                    </td>
                                    <td className="px-3 py-2 text-center text-black font-medium">
                                        {getGenericFacultyRank(faculty)}
                                    </td>
                                    <td className="px-3 py-2 text-center text-black">
                                        {faculty.form_type === 'E2' ? getTenured(faculty.tenured) : 'N/A'}
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
                                                className="flex items-center justify-center h-8 w-8 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-md border-b-2 border-amber-600 active:border-b-0 active:translate-y-px transition-all"
                                                title="Edit Profile"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(faculty.id)}
                                                className="flex items-center justify-center h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md border-b-2 border-red-700 active:border-b-0 active:translate-y-px transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center text-gray-500 text-sm border border-gray-300 bg-gray-50">
                                    No records found for {yearFilter}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            {facultyList.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-white text-sm text-gray-600 rounded-none">
                    <span>
                        Showing {Math.min((currentPage - 1) * pageSize + 1, facultyList.length)}–{Math.min(currentPage * pageSize, facultyList.length)} of {facultyList.length} entries
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2 py-1.5 border border-gray-300 rounded-none text-sm disabled:opacity-40 hover:bg-gray-100 font-medium"
                        >Previous</button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                            const page = start + i;
                            return page <= totalPages && page > 0 ? (
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

export default FacultyListTableE2;