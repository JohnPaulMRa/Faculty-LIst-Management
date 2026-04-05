/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, Trash2, ArrowUpDown, CheckCircle2, AlertCircle } from "lucide-react";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    id: string; // Composite key or specific code
    code: string;
    name: string;
    major: string;
    disciplineGroup: string;
    specificMajor: string;
    specificGroup: string;
    programLevel: string;
    originalData: any; // Keep reference for editing
}

interface DisciplineTableProps {
    programs: Program[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onSort: (key: string) => void;
    sortConfig: { key: string, direction: 'asc' | 'desc' } | null;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
}

export default function DisciplineTable({ programs, onEdit, onDelete, onSort, sortConfig, searchQuery, onSearchQueryChange }: DisciplineTableProps) {
    const [entriesPerPage, setEntriesPerPage] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 if search/filter changes the length
    useEffect(() => {
        setCurrentPage(1);
    }, [programs.length, entriesPerPage]);

    const isAll = entriesPerPage === -1;
    const totalPages = isAll ? 1 : (Math.ceil(programs.length / entriesPerPage) || 1);
    const paginatedPrograms = useMemo(() => {
        if (isAll) return programs;
        const start = (currentPage - 1) * entriesPerPage;
        const end = start + entriesPerPage;
        return programs.slice(start, end);
    }, [programs, currentPage, entriesPerPage, isAll]);

    const startEntry = programs.length === 0 ? 0 : (isAll ? 1 : (currentPage - 1) * entriesPerPage + 1);
    const endEntry = isAll ? programs.length : Math.min(currentPage * entriesPerPage, programs.length);

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
                    className={`h-8 w-8 p-0 rounded-none ${i === currentPage ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : 'text-gray-600 border-gray-300'}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center text-sm text-gray-600">
                    <span>Show</span>
                    <Select
                        value={String(entriesPerPage)}
                        onValueChange={(val) => setEntriesPerPage(Number(val))}
                    >
                        <SelectTrigger className="mx-2 h-7 w-[65px] rounded-none border-gray-300">
                            <SelectValue placeholder="50" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="-1">All</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>entries</span>
                </div>

                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by code, group, major, or specific..."
                        className="pl-9 bg-gray-50 border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-gray-400 h-9"
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-gray-200 rounded-none overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-blue-600 hover:bg-blue-600 border-b-0">
                            <TableHead className="font-bold text-white uppercase text-xs tracking-wider w-20 text-center h-10">#</TableHead>
                            <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[20%]">
                                <div
                                    className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'code' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                    onClick={() => onSort('code')}
                                >
                                    Code <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'code' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[25%]">
                                <div
                                    className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'disciplineGroup' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                    onClick={() => onSort('disciplineGroup')}
                                >
                                    Discipline Group <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'disciplineGroup' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[25%]">
                                <div
                                    className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'specificMajor' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                    onClick={() => onSort('specificMajor')}
                                >
                                    Major Discipline <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'specificMajor' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-xs tracking-wider h-10 w-[20%]">
                                <div
                                    className={`flex items-center gap-1 cursor-pointer transition-colors ${sortConfig?.key === 'name' ? 'text-blue-100' : 'hover:text-gray-200'}`}
                                    onClick={() => onSort('name')}
                                >
                                    Specific Discipline <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === 'name' ? 'opacity-100' : 'opacity-70'}`} />
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-white uppercase text-xs tracking-wider text-center h-10">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPrograms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    No programs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedPrograms.map((program, index) => {
                                const importStatus = program.originalData?._importStatus;
                                const isImportRow = !!importStatus;
                                return (
                                <TableRow
                                    key={program.id}
                                    className={`border-b border-gray-100 transition-colors
                                        ${importStatus === 'success' ? 'bg-green-50/50' : ''}
                                        ${importStatus === 'error' ? 'bg-red-50/50' : ''}
                                        ${!isImportRow ? 'even:bg-gray-50 hover:bg-blue-50/50' : ''}
                                    `}
                                >
                                    <TableCell className="text-center font-medium text-gray-500 text-xs py-2">{startEntry + index}</TableCell>
                                    <TableCell className="font-medium text-gray-700 text-xs py-2">
                                        <div className="flex items-center gap-2">
                                            {program.code}
                                            {importStatus === 'error' && (
                                                <span title={program.originalData?._importError}>
                                                    <AlertCircle className="h-3.5 w-3.5 text-red-500 hover:text-red-700" />
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-700 text-xs font-semibold py-2">{program.disciplineGroup || '—'}</TableCell>
                                    <TableCell className="text-gray-700 text-xs font-semibold py-2">{program.specificMajor || '—'}</TableCell>
                                    <TableCell className="text-gray-700 text-xs font-semibold py-2">
                                        {program.name || '—'}
                                    </TableCell>
                                    <TableCell className="text-center py-2">
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
                                            <div className="flex items-center justify-center gap-2">
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
                                                    onClick={() => onDelete(program.code)}
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
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mt-2 mb-2">
                <div>
                    Showing {startEntry} to {endEntry} of {programs.length} entries
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className={`h-8 px-3 rounded-none border-gray-300 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    {renderPageNumbers()}
                    <Button
                        variant="outline"
                        className={`h-8 px-3 rounded-none border-gray-300 ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
