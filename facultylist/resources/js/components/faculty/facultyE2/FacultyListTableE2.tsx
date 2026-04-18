/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from '@inertiajs/react';
import { Trash2, Pencil, ArrowUpDown } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import type { FC } from 'react';
import { edit } from '@/routes/faculty';
import type { Faculty } from '@/types/faculty';
import { IMPORT_GROUPS } from '@/types/faculty/constants';
import { Combobox } from '@/components/ui/combobox';

// --- TYPES / INTERFACES ---

interface FacultyListTableE2Props {
    facultyList: Faculty[];
    yearFilter: string;
    onFileClick: (faculty: Faculty) => void;
    onDelete: (id: string) => void;
    onEdit: (faculty: Faculty) => void;
    referenceData?: any;
    isLocked?: boolean;
}

// --- SortConfig Interface ---
interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

// --- CONSTANTS ---
const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

// --- MAIN COMPONENT ---
const FacultyListTableE2: FC<FacultyListTableE2Props> = ({
    facultyList,
    yearFilter,
    onFileClick,
    onDelete,
    onEdit,
    referenceData,
    isLocked,
}) => {
    // --- HOOKS ---

    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    // --- DERIVED VARIABLES ---

    const sortedFacultyList = useMemo(() => {
        if (!sortConfig) return facultyList;

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
    const paginatedList = sortedFacultyList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // --- HELPERS / HANDLERS ---

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

    const getStatusBadgeStyle = (status: string): string => {
        const s = (status || '').trim();
        const lower = s.toLowerCase();

        if (lower === 'updated') return 'bg-green-400 text-white border-green-600 shadow-sm';
        if (lower === 'submitted' || lower === 'completed') return 'bg-green-500 text-white border-green-700 shadow-sm';
        if (lower === 'not yet completed') return 'bg-amber-400 text-white border-amber-600 shadow-sm';
        if (lower === 'no submission') return 'bg-red-400 text-white border-red-600 shadow-sm';
        if (lower === 'not updated') return 'bg-red-400 text-white border-red-600 shadow-sm';

        return 'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm';
    };

    const getGenderLabel = (code?: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.gender?.find((g: any) => String(g.code) === String(code));
        return found ? found.desc : code;
    };

    const getTenuredLabel = (code?: string) => {
        if (!code) return 'N/A';
        const found = referenceData?.tenureE2?.find((g: any) => String(g.code) === String(code));
        return found ? found.desc : code;
    };

    const getFacultyGroup = (faculty: Faculty) => {
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

    const getFacultyRankLabel = (faculty: Faculty) => {
        if (faculty.form_type !== 'E2') return 'N/A';
        const code = faculty.rank;
        if (!code) return 'N/A';

        const found = referenceData?.facultyRank?.find((r: any) => String(r.code) === String(code));
        const desc = found ? found.desc : code;

        if (desc && desc.toString().toLowerCase().includes("adjunct or affiliate faculty")) {
            return "Adjunct or Affiliate Faculty...";
        }

        return desc || 'N/A';
    };

    // --- JSX FRAGMENTS ---

    const tableRows = paginatedList.length > 0 ? (
        paginatedList.map((faculty, index) => {
            const rowIndex = (currentPage - 1) * pageSize + index + 1;
            const genderLabel = faculty.form_type === 'E2' ? getGenderLabel(faculty.gender) : 'N/A';
            const groupLabel = getFacultyGroup(faculty);
            const rankLabel = getFacultyRankLabel(faculty);
            const tenuredLabel = faculty.form_type === 'E2' ? getTenuredLabel(faculty.is_tenured) : 'N/A';
            const statusBadgeClass = `text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold shadow-sm ${getStatusBadgeStyle(faculty.status)}`;
            const editUrl = edit({ id: faculty.id }).url;

            return (
                <tr key={faculty.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-center text-black">{rowIndex}</td>
                    <td className="px-3 py-2 text-center text-black">{faculty.joined_year}</td>
                    <td className="px-3 py-2 text-center font-semibold text-gray-900">{faculty.name}</td>
                    <td className="px-3 py-2 text-center text-black">{genderLabel}</td>
                    <td className="px-3 py-2 text-center text-black font-medium">{groupLabel}</td>
                    <td className="px-3 py-2 text-center text-black font-medium">{rankLabel}</td>
                    <td className="px-3 py-2 text-center text-black">{tenuredLabel}</td>
                    <td className="px-3 py-2 text-center">
                        <span className={statusBadgeClass}>
                            {faculty.status}
                        </span>
                    </td>
                    <td className="px-3 py-2 font-bold text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Link
                                href={editUrl}
                                className="flex items-center justify-center h-8 w-8 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-md border-b-2 border-amber-600 active:border-b-0 active:translate-y-px transition-all"
                                title={isLocked ? "View Profile" : "Edit Profile"}
                            >
                                <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                                onClick={() => !isLocked && onDelete(faculty.id)}
                                disabled={isLocked}
                                className={isLocked ? "flex items-center justify-center h-8 w-8 bg-slate-200 text-slate-400 rounded-xl shadow-none cursor-not-allowed" : "flex items-center justify-center h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md border-b-2 border-red-700 active:border-b-0 active:translate-y-px transition-all"}
                                title={isLocked ? "Record Locked" : "Delete"}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan={9} className="px-6 py-8 text-center text-gray-500 text-sm border border-gray-300 bg-gray-50">
                No records found for {yearFilter}.
            </td>
        </tr>
    );

    const paginationControls = facultyList.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white text-sm text-slate-600">
            <span className="font-medium">
                Showing <span className="text-blue-600 font-bold">{Math.min((currentPage - 1) * pageSize + 1, facultyList.length)}</span>–<span className="text-blue-600 font-bold">{Math.min(currentPage * pageSize, facultyList.length)}</span> of <span className="text-slate-900 font-bold">{facultyList.length}</span> entries
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-10 px-4 border border-slate-200 rounded-xl text-sm disabled:opacity-30 hover:bg-slate-50 font-bold transition-all"
                >
                    Previous
                </button>
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        const page = start + i;
                        if (page <= 0 || page > totalPages) return null;

                        const isPageActive = currentPage === page;
                        const pageButtonClass = `h-10 w-10 border rounded-xl text-sm font-bold transition-all ${isPageActive ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-105' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600'}`;

                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={pageButtonClass}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-10 px-4 border border-slate-200 rounded-xl text-sm disabled:opacity-30 hover:bg-slate-50 font-bold transition-all"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // --- MAIN RENDER ---

    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/* SPREADSHEET HEADER & CONTROLS */}
            <div className="bg-white flex items-center justify-between px-6 py-4 text-slate-900 border-b border-slate-100 shadow-sm">
                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-900">
                    <span>Show</span>
                    <div className="w-24 mx-3">
                        <Combobox
                            options={PAGE_SIZE_OPTIONS.map(opt => ({ label: String(opt), value: opt }))}
                            value={pageSize}
                            onChange={(val) => handlePageSizeChange(Number(val))}
                            placeholder=""
                            className="h-10 border-slate-200 bg-slate-50 shadow-none focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl text-slate-900 px-3 font-bold"
                        />
                    </div>
                    <span>entries</span>

                    {isLocked && (
                        <div className="flex items-center gap-2 text-amber-700 font-bold italic text-[11px] tracking-widest bg-amber-50/50 px-4 py-1.5 rounded-xl border border-amber-200/60 ml-6 uppercase">
                            This record has been submitted and is now locked. No further changes can be made.
                        </div>
                    )}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-900">
                    FACULTY DATA RECORDS (E2)
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white uppercase text-[11px] font-bold tracking-widest border-b border-blue-800">
                            <th className="px-3 py-3 font-bold text-center w-[0%] border-r border-white/10">#</th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <button className="flex items-center justify-center w-full gap-1 hover:text-gray-200" onClick={() => handleSort('joined_year')}>
                                    Academic Year <ArrowUpDown className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <button className="flex items-center justify-center w-full gap-1 text-white hover:text-white/80 transition-colors" onClick={() => handleSort('name')}>
                                    Faculty Name <ArrowUpDown className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[5%]">
                                <button className="flex items-center justify-center w-full gap-1 text-white hover:text-white/80 transition-colors" onClick={() => handleSort('name')}>
                                    Gender <ArrowUpDown className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[5%]">
                                <button className="flex items-center justify-center w-full gap-1 text-white hover:text-white/80 transition-colors" onClick={() => handleSort('group')}>
                                    Group <ArrowUpDown className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <button className="flex items-center justify-center w-full gap-1 text-white hover:text-white/80 transition-colors" onClick={() => handleSort('rank')}>
                                    GENERIC FACULTY RANK <ArrowUpDown className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">
                                <button className="flex items-center justify-center w-full gap-1 text-white hover:text-white/80 transition-colors" onClick={() => handleSort('is_tenured')}>
                                    Tenured <ArrowUpDown className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-3 py-2 font-bold text-center w-[10%]">Status</th>
                            <th className="px-3 py-2 font-bold text-center w-[1%]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {tableRows}
                    </tbody>
                </table>
            </div>

            {paginationControls}
        </div>
    );
};

export default FacultyListTableE2;