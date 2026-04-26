/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';
import { Pencil, Trash2, ArrowUpDown, CheckCircle2, AlertCircle } from "lucide-react";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeProgramName } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export interface Program {
    id: string;
    code: string;
    name: string;
    major: string;
    disciplineGroup: string;
    specificMajor: string;
    specificGroup: string;
    program?: string;
    programLevel: string;
    originalData: any;
}

interface DisciplineTableProps {
    programs: Program[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onSort: (key: string) => void;
    sortConfig: { key: string, direction: 'asc' | 'desc' } | null;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    serverPagination?: any; // Laravel Paginator object
    serverFilters?: any;
    disciplines?: any[]; // Full hierarchy for duplicate check
}

export default function DisciplineTable({
    programs,
    onEdit,
    onDelete,
    onSort,
    sortConfig,
    searchQuery,
    onSearchQueryChange,
    serverPagination,
    serverFilters,
    disciplines = []
}: DisciplineTableProps) {
    const [entriesPerPage, setEntriesPerPage] = useState(50);
    const [localPage, setLocalPage] = useState(1);

    // If we have serverPagination and we are NOT in preview mode, use server-side
    const isPreviewMode = !!programs.find(p => p.originalData?._importStatus);
    const isServerSide = !!serverPagination && !isPreviewMode;

    // Reset local page if search changes (for local mode)
    useEffect(() => {
        setLocalPage(1);
    }, [searchQuery, entriesPerPage]);

    // Sync with serverPagination per_page
    useEffect(() => {
        if (isServerSide && serverPagination?.per_page) {
            const spPpe = Number(serverPagination.per_page);
            setEntriesPerPage(spPpe === 9999 ? -1 : spPpe);
        }
    }, [serverPagination, isServerSide]);

    const handlePageChange = (page: number) => {
        if (isServerSide) {
            router.get(window.location.pathname, {
                ...serverFilters,
                page: page,
                entries: entriesPerPage === -1 ? 'all' : entriesPerPage,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        } else {
            setLocalPage(page);
        }
    };

    const handleEntriesChange = (val: string) => {
        const num = Number(val);
        setEntriesPerPage(num);
        setLocalPage(1);
        if (isServerSide) {
            router.get(window.location.pathname, {
                ...serverFilters,
                page: 1,
                entries: num === -1 ? 'all' : num,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }
    };

    // --- Duplicate Detection Logic ---
    // A specific discipline is considered duplicate only when the combination
    // of specific discipline name AND program appears more than once.
    const duplicateMap = useMemo(() => {
        const counts = new Map<string, number>();
        programs.forEach(p => {
            const specificDiscipline = (p.name || '').toLowerCase().trim();
            const programName = normalizeProgramName(p.program || '').toLowerCase().trim();
            if (!specificDiscipline) return;

            // Only track duplicates for rows that have NO program
            if (!programName) {
                const key = `${specificDiscipline}|`;
                counts.set(key, (counts.get(key) || 0) + 1);
            }
        });
        return counts;
    }, [programs]);

    const existingSystemCodes = useMemo(() => {
        const codes = new Set<string>();
        // disciplines is a flat array of discipline records; extract codes directly
        disciplines.forEach((d: any) => {
            if (d.code) codes.add(String(d.code).toLowerCase().trim());
        });
        return codes;
    }, [disciplines]);
    // ---------------------------------

    const isAll = entriesPerPage === -1;

    // Meta data from server OR local
    const currentPage = isServerSide ? serverPagination.current_page : localPage;
    const totalPages = isServerSide
        ? serverPagination.last_page
        : (isAll ? 1 : (Math.ceil(programs.length / entriesPerPage) || 1));

    const startEntry = isServerSide
        ? serverPagination.from
        : (programs.length === 0 ? 0 : (isAll ? 1 : (localPage - 1) * entriesPerPage + 1));

    const endEntry = isServerSide
        ? serverPagination.to
        : (isAll ? programs.length : Math.min(localPage * entriesPerPage, programs.length));

    const paginatedPrograms = useMemo(() => {
        if (isServerSide) return programs; // Already paginated by server
        if (isAll) return programs;
        const start = (localPage - 1) * entriesPerPage;
        const end = start + entriesPerPage;
        return programs.slice(start, end);
    }, [programs, localPage, entriesPerPage, isAll, isServerSide]);

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
                    className={`h-10 w-10 p-0 rounded-xl font-bold transition-all ${i === currentPage ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-105' : 'text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 mb-2">
                <div className="flex items-center text-sm font-bold text-slate-600 uppercase tracking-tight">
                    <span>Show</span>
                    <Select
                        value={String(entriesPerPage)}
                        onValueChange={handleEntriesChange}
                    >
                        <SelectTrigger className="mx-3 h-10 w-[80px] rounded-xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-600/10 font-bold">
                            <SelectValue placeholder="50" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="-1">All</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>entries</span>
                </div>

                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search by code, group, major, or specific..."
                        className="pl-11 bg-white border-slate-200 hover:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 rounded-xl h-11 text-sm font-medium transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white shadow-xl shadow-blue-900/5 overflow-x-auto rounded-none border border-blue-100/50 custom-scrollbar">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-linear-to-r from-[#003468] to-[#1a4f8c] hover:bg-[#003468] border-b-0">
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest w-20 text-center h-12 border-r border-white/10">#</TableHead>
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest h-12 w-[8%]">
                                <div
                                    className={`flex items-center gap-2 cursor-pointer transition-colors ${sortConfig?.key === 'code' ? 'text-blue-200' : 'hover:text-blue-100'}`}
                                    onClick={() => onSort('code')}
                                >
                                    Code <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'code' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest h-12 w-[20%]">
                                <div
                                    className={`flex items-center gap-2 cursor-pointer transition-colors ${sortConfig?.key === 'disciplineGroup' ? 'text-blue-200' : 'hover:text-blue-100'}`}
                                    onClick={() => onSort('disciplineGroup')}
                                >
                                    Discipline Group <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'disciplineGroup' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest h-12 w-[20%]">
                                <div
                                    className={`flex items-center gap-2 cursor-pointer transition-colors ${sortConfig?.key === 'specificMajor' ? 'text-blue-200' : 'hover:text-blue-100'}`}
                                    onClick={() => onSort('specificMajor')}
                                >
                                    Major Discipline <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'specificMajor' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest h-12 w-[18%]">
                                <div
                                    className={`flex items-center gap-2 cursor-pointer transition-colors ${sortConfig?.key === 'name' ? 'text-blue-200' : 'hover:text-blue-100'}`}
                                    onClick={() => onSort('name')}
                                >
                                    Specific Discipline <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'name' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest h-12 w-[20%]">
                                <div
                                    className={`flex items-center gap-2 cursor-pointer transition-colors ${sortConfig?.key === 'program' ? 'text-blue-200' : 'hover:text-blue-100'}`}
                                    onClick={() => onSort('program')}
                                >
                                    Program <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'program' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-[11px] tracking-widest text-right h-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPrograms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                    No programs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedPrograms.map((program, index) => (
                                <DisciplineTableRow
                                    key={program.id}
                                    program={program}
                                    index={index}
                                    startEntry={startEntry}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    isDuplicateInList={
                                        (duplicateMap.get(
                                            `${(program.name || '').toLowerCase().trim()}|${normalizeProgramName(program.program || '').toLowerCase().trim()}`
                                        ) || 0) > 1
                                    }
                                    existsInSystem={existingSystemCodes.has(program.code.toLowerCase().trim())}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600 px-6 py-4 bg-white border-t border-slate-100 rounded-b-2xl">
                <div className="font-medium">
                    Showing <span className="text-blue-600 font-bold">{startEntry}</span> to <span className="text-blue-600 font-bold">{endEntry}</span> of <span className="text-slate-900 font-bold">{isServerSide ? serverPagination.total : programs.length}</span> entries
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className={`h-10 px-4 rounded-xl border-slate-200 font-bold transition-all ${currentPage === 1 ? 'opacity-30' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1.5">
                        {renderPageNumbers()}
                    </div>
                    <Button
                        variant="outline"
                        className={`h-10 px-4 rounded-xl border-slate-200 font-bold transition-all ${currentPage === totalPages || totalPages === 0 ? 'opacity-30' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface DisciplineTableRowProps {
    program: Program;
    index: number;
    startEntry: number;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    isDuplicateInList?: boolean;
    existsInSystem?: boolean;
}

const DisciplineTableRow = memo(({
    program,
    index,
    startEntry,
    onEdit,
    onDelete,
    isDuplicateInList,
    existsInSystem
}: DisciplineTableRowProps) => {
    const importStatus = program.originalData?._importStatus;
    const isImportRow = !!importStatus;

    return (
        <TableRow
            className={`border-b border-gray-100 transition-colors
                ${importStatus === 'success' ? 'bg-green-50/50' : ''}
                ${importStatus === 'error' ? 'bg-red-50/50' : ''}
                ${isDuplicateInList && !isImportRow ? 'bg-amber-50/70' : ''}
                ${isDuplicateInList && isImportRow ? 'bg-amber-100/50' : ''}
                ${!isImportRow && !isDuplicateInList ? 'even:bg-gray-50 hover:bg-blue-50/50' : ''}
                hover:bg-blue-50/70 transition-colors
            `}
        >
            <TableCell className="text-center font-medium text-gray-500 text-lg py-2">{startEntry + index}</TableCell>
            <TableCell className="font-medium text-gray-700 text-lg py-2">
                <div className="flex items-center gap-2">
                    {program.code}
                    {importStatus === 'error' && (
                        <span title={program.originalData?._importError}>
                            <AlertCircle className="h-3.5 w-3.5 text-red-500 hover:text-red-700" />
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-gray-700 text-lg font-semibold py-2">{program.disciplineGroup || ''}</TableCell>
            <TableCell className="text-gray-700 text-lg font-semibold py-2">{program.specificMajor || ''}</TableCell>
            <TableCell className="text-gray-700 text-lg font-semibold py-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        {program.name && program.name !== program.code ? program.name : ''}
                        {isDuplicateInList && !program.program && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wider border border-amber-200">
                                <AlertCircle className="h-2.5 w-2.5" /> Duplicate
                            </span>
                        )}
                        {isImportRow && existsInSystem && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider border border-blue-200">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Exists in DB
                            </span>
                        )}
                    </div>
                    {((isDuplicateInList && !program.program) || (isImportRow && existsInSystem)) && (
                        <p className="text-[9px] text-amber-600 font-medium">
                            {isImportRow && existsInSystem
                                ? "This discipline is already registered in the system."
                                : "This specific discipline is repeated in your list."}
                        </p>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-gray-900 text-lg font-semibold py-2">
                {program.program || ''}
            </TableCell>
            <TableCell className="text-right py-2 pr-4">
                {isImportRow ? (
                    <div className="flex items-center justify-center">
                        {importStatus === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-semibold">
                                Ready
                            </span>
                        )}
                        {importStatus === 'success' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200 text-green-800 text-[10px] font-semibold">
                                <CheckCircle2 className="h-2.5 w-2.5" /> OK
                            </span>
                        )}
                        {importStatus === 'error' && (
                            <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-200 text-red-700 text-[10px] font-semibold cursor-help"
                                title={program.originalData?._importError}
                            >
                                <AlertCircle className="h-2.5 w-2.5" /> Error
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(program.originalData)}
                            className="h-8 w-8 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-md border-b-2 border-amber-600 active:border-b-0 active:translate-y-px transition-all"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(program.id)}
                            className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md border-b-2 border-red-700 active:border-b-0 active:translate-y-px transition-all"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
}, (prevProps, nextProps) => {
    // Custom deep comparison to prevent re-rendering when callbacks change completely from parent
    return prevProps.program.id === nextProps.program.id &&
        prevProps.program.originalData?._importStatus === nextProps.program.originalData?._importStatus &&
        prevProps.isDuplicateInList === nextProps.isDuplicateInList &&
        prevProps.existsInSystem === nextProps.existsInSystem &&
        prevProps.index === nextProps.index &&
        prevProps.startEntry === nextProps.startEntry;
});

DisciplineTableRow.displayName = "DisciplineTableRow";
