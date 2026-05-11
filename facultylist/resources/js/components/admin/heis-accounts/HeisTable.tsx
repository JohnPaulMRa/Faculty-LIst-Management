import { University, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Hei } from '@/types/hei';

interface HeisTableProps {
    heis: Hei[];
    searchQuery: string;
    onClearSearch: () => void;
    onEdit: (hei: Hei) => void;
    onDelete: (hei: Hei) => void;
}

export function HeisTable({ heis, searchQuery, onClearSearch, onEdit, onDelete }: HeisTableProps) {
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Hei; direction: "asc" | "desc" } | null>({
        key: "name",
        direction: "asc",
    });

    const onSort = (key: keyof Hei) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedHeis = useMemo(() => {
        if (!sortConfig) return heis;
        return [...heis].sort((a, b) => {
            const aVal = String(a[sortConfig.key] || '');
            const bVal = String(b[sortConfig.key] || '');
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [heis, sortConfig]);

    const isAll = entriesPerPage === -1;
    const paginatedHeis = useMemo(() => {
        if (isAll) return sortedHeis;
        const start = (currentPage - 1) * entriesPerPage;
        return sortedHeis.slice(start, start + entriesPerPage);
    }, [sortedHeis, currentPage, entriesPerPage, isAll]);

    const totalPages = isAll ? 1 : Math.ceil(sortedHeis.length / entriesPerPage) || 1;
    const startEntry = sortedHeis.length === 0 ? 0 : (isAll ? 1 : (currentPage - 1) * entriesPerPage + 1);
    const endEntry = isAll ? sortedHeis.length : Math.min(currentPage * entriesPerPage, sortedHeis.length);

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
                    className={`h-10 w-10 p-0 rounded-xl font-bold transition-all ${i === currentPage ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-105" : "text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50"}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };
    return (
        <div className="flex flex-col bg-white shadow-xl shadow-blue-900/5 overflow-hidden rounded-none border border-blue-100/50 mt-4 animate-in fade-in duration-500">
            <div className="bg-white flex items-center justify-between px-6 py-4 text-slate-900 border-b border-slate-100 shadow-sm">
                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-900">
                    <span>Show</span>
                    <Select
                        value={String(entriesPerPage)}
                        onValueChange={(val) => {
                            setEntriesPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="mx-3 h-10 w-[80px] rounded-xl border-slate-200 bg-slate-50 shadow-none focus:ring-2 focus:ring-blue-600/10 text-slate-900 font-bold">
                            <SelectValue placeholder="25" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="-1">All</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>entries</span>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-900">
                    LIST OF HIGHER EDUCATION INSTITUTIONS (HEIs)
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white uppercase text-[11px] font-bold tracking-widest">
                            <th className="px-3 py-3 font-bold w-[40px] text-center border-r border-white/10">#</th>
                            <th className="px-3 py-3 font-bold w-[10%] text-left">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("hei_code")}>
                                    HEI Code <ArrowUpDown className="h-3 w-3 opacity-70" />
                                </div>
                            </th>
                            <th className="px-3 py-3 font-bold w-[15%] text-left">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("name")}>
                                    List of HEIs <ArrowUpDown className="h-3 w-3 opacity-70" />
                                </div>
                            </th>
                            <th className="px-3 py-3 font-bold w-[15%] text-left">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("address")}>
                                    Address <ArrowUpDown className="h-3 w-3 opacity-70" />
                                </div>
                            </th>
                            <th className="px-3 py-3 font-bold w-[15%] text-center">Contact Number</th>
                            <th className="px-3 py-3 font-bold w-[15%] text-center">Email</th>
                            <th className="px-3 py-3 font-bold w-[10%] text-center">
                                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-white/80 transition-colors" onClick={() => onSort("type")}>
                                    HEIs Type <ArrowUpDown className="h-3 w-3 opacity-70" />
                                </div>
                            </th>
                            <th className="px-3 py-3 font-bold w-[5%] text-center">Status</th>
                            <th className="px-3 py-3 font-bold w-[10%] text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {paginatedHeis.length > 0 ? (
                            paginatedHeis.map((hei, index) => (
                                <tr
                                    key={hei.id}
                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-3 py-2 text-center text-gray-500 border-r border-gray-100">
                                        {startEntry + index}
                                    </td>
                                    <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                        {hei.hei_code || <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                        <div>{hei.name}</div>

                                    </td>
                                    <td className="px-3 py-2 text-left text-gray-600">
                                        {hei.address || <span className="text-gray-400">N/A</span>}
                                    </td>
                                    <td className="px-3 py-2 text-center text-gray-600">
                                        {hei.contact_number || <span className="text-gray-400">N/A</span>}
                                    </td>
                                    <td className="px-3 py-2 text-center text-gray-600">
                                        {hei.email || <span className="text-gray-400">N/A</span>}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${hei.type?.toLowerCase() === 'private'
                                            ? 'bg-blue-100 text-blue-700'
                                            : hei.type?.toLowerCase() === 'public'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {hei.type}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${hei.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {hei.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-md border-b-2 border-amber-600 active:border-b-0 active:translate-y-px transition-all"
                                                            onClick={(e) => { e.stopPropagation(); onEdit(hei); }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Edit Institution</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md border-b-2 border-red-700 active:border-b-0 active:translate-y-px transition-all"
                                                            onClick={(e) => { e.stopPropagation(); onDelete(hei); }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-red-600 border-red-700 text-white">
                                                        <p>Delete Institution</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <University className="h-12 w-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No HEIs found</h3>
                                        <p className="text-sm">We couldn't find any HEIs matching "{searchQuery}".</p>
                                        <Button variant="link" onClick={onClearSearch} className="mt-2 text-blue-600">Clear search</Button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-600 px-6 py-4 bg-white border-t border-slate-100">
                <div className="font-medium">
                    Showing <span className="text-blue-600 font-bold">{startEntry}</span> to <span className="text-blue-600 font-bold">{endEntry}</span> of <span className="text-slate-900 font-bold">{sortedHeis.length}</span> entries
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className={`h-10 px-4 rounded-xl border-slate-200 font-bold transition-all ${currentPage === 1 ? "opacity-30" : "text-slate-600 hover:bg-slate-50"}`}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1.5">
                        {renderPageNumbers()}
                    </div>
                    <Button
                        variant="outline"
                        className={`h-10 px-4 rounded-xl border-slate-200 font-bold transition-all ${currentPage === totalPages || totalPages === 0 ? "opacity-30" : "text-slate-600 hover:bg-slate-50"}`}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
