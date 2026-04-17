import { Users, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


interface UserAccount {
    id: number;
    name: string;
    email: string;
    role: string;
    hei_id: number;
    hei_type?: string;
}

interface UserAccountsTableProps {
    accounts: UserAccount[];
    searchQuery: string;
    onClearSearch: () => void;
    onEdit: (account: UserAccount) => void;
    onDelete: (account: UserAccount) => void;
}

export function UserAccountsTable({ accounts, searchQuery, onClearSearch, onEdit, onDelete }: UserAccountsTableProps) {
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof UserAccount; direction: "asc" | "desc" } | null>({
        key: "name",
        direction: "asc",
    });

    const onSort = (key: keyof UserAccount) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedAccounts = useMemo(() => {
        if (!sortConfig) return accounts;
        return [...accounts].sort((a, b) => {
            const aVal = String(a[sortConfig.key] || '');
            const bVal = String(b[sortConfig.key] || '');
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [accounts, sortConfig]);

    const isAll = entriesPerPage === -1;
    const paginatedAccounts = useMemo(() => {
        if (isAll) return sortedAccounts;
        const start = (currentPage - 1) * entriesPerPage;
        return sortedAccounts.slice(start, start + entriesPerPage);
    }, [sortedAccounts, currentPage, entriesPerPage, isAll]);

    const totalPages = isAll ? 1 : Math.ceil(sortedAccounts.length / entriesPerPage) || 1;
    const startEntry = sortedAccounts.length === 0 ? 0 : (isAll ? 1 : (currentPage - 1) * entriesPerPage + 1);
    const endEntry = isAll ? sortedAccounts.length : Math.min(currentPage * entriesPerPage, sortedAccounts.length);

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
                    className={`h-8 w-8 p-0 rounded-none ${i === currentPage ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : "text-gray-600 border-gray-300 shadow-none"}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };
    return (
        <div className="flex flex-col animate-in fade-in duration-300 bg-white shadow-none overflow-hidden rounded-none border border-gray-200 mt-2">
            <div className="bg-gray-50 flex items-center justify-between px-4 py-3 border-b border-gray-300">
                <div className="flex items-center text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <span>Show</span>
                    <Select
                        value={String(entriesPerPage)}
                        onValueChange={(val) => {
                            setEntriesPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="mx-2 h-7 w-[65px] rounded-none border-gray-300 bg-white shadow-none focus:ring-0">
                            <SelectValue placeholder="25" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="-1">All</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>entries</span>
                </div>
                <div className="text-black text-sm font-bold uppercase tracking-wide">
                    LIST OF USER ACCOUNTS
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-white border-b border-gray-300">
                            <th className="px-4 py-3 font-bold w-[40px] text-center border-r border-blue-400">#</th>
                            <th className="px-4 py-3 font-bold w-[28%] text-left">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-100 transition-colors" onClick={() => onSort("name")}>
                                    UserName <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-4 py-3 font-bold w-[27%] text-left">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-100 transition-colors" onClick={() => onSort("email")}>
                                    Email <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-4 py-3 font-bold w-[10%] text-center">
                                <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-blue-100 transition-colors" onClick={() => onSort("hei_type")}>
                                    HEIs Type <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-4 py-3 font-bold w{20%] text-center">
                                <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-blue-100 transition-colors" onClick={() => onSort("role")}>
                                    Role <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-4 py-3 font-bold w-[10%] text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {paginatedAccounts.length > 0 ? (
                            paginatedAccounts.map((account, index) => (
                                <tr
                                    key={account.id}
                                    className="border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-100">
                                        {startEntry + index}
                                    </td>
                                    <td className="px-4 py-3 text-left font-semibold text-gray-900">
                                        {account.name}
                                    </td>
                                    <td className="px-4 py-3 text-left text-gray-600">
                                        {account.email}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${account.hei_type?.toLowerCase() === 'private'
                                            ? 'bg-blue-100 text-blue-700'
                                            : account.hei_type?.toLowerCase() === 'public'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {account.hei_type || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${account.role.toLowerCase() === 'admin'
                                            ? 'bg-red-500 text-white'
                                            : account.role.toLowerCase() === 'private'
                                                ? 'bg-blue-100 text-blue-700'
                                                : account.role.toLowerCase() === 'public'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {account.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-xl shadow-md border-b-2 border-amber-600 active:border-b-0 active:translate-y-px transition-all"
                                                title="Edit"
                                                onClick={() => onEdit(account)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md border-b-2 border-red-700 active:border-b-0 active:translate-y-px transition-all"
                                                title="Delete"
                                                onClick={() => onDelete(account)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No user accounts found</h3>
                                        <p className="text-sm">We couldn't find any accounts matching "{searchQuery}".</p>
                                        <Button variant="link" onClick={onClearSearch} className="mt-2 text-blue-600">Clear search</Button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mt-1 mb-2 p-1">
                <div>
                    Showing {startEntry} to {endEntry} of {sortedAccounts.length} entries
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className={`h-8 px-3 rounded-none border-gray-300 shadow-none ${currentPage === 1 ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    {renderPageNumbers()}
                    <Button
                        variant="outline"
                        className={`h-8 px-3 rounded-none border-gray-300 shadow-none ${currentPage === totalPages || totalPages === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-50"}`}
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
