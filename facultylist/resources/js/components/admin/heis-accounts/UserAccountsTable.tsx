import { Users, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserAccount {
    id: number;
    name: string;
    email: string;
    role: string;
    hei_id: number;
}

interface UserAccountsTableProps {
    accounts: UserAccount[];
    searchQuery: string;
    onClearSearch: () => void;
    onEdit: (account: UserAccount) => void;
    onDelete: (account: UserAccount) => void;
}

export function UserAccountsTable({ accounts, searchQuery, onClearSearch, onEdit, onDelete }: UserAccountsTableProps) {
    return (
        <div className="flex flex-col animate-in fade-in duration-300 bg-white shadow-none overflow-hidden rounded-none border border-gray-300 mt-2">
            <div className="bg-gray-50 flex items-center justify-between px-4 py-3 border-b border-gray-300">
                <div className="text-black text-sm font-bold uppercase tracking-wide">
                    LIST OF USER ACCOUNTS
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm whitespace-nowrap font-sans">
                    <thead>
                        <tr className="bg-blue-500 text-white border-b border-gray-300">
                            <th className="px-3 py-2 font-bold w-[40px] text-center">#</th>
                            <th className="px-3 py-2 font-bold w-[30%] text-left">UserName</th>
                            <th className="px-3 py-2 font-bold w-[30%] text-left">Email</th>
                            <th className="px-3 py-2 font-bold w-[20%] text-left">Role</th>
                            <th className="px-3 py-2 font-bold w-[20%] text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-sm">
                        {accounts.length > 0 ? (
                            accounts.map((account, index) => (
                                <tr
                                    key={account.id}
                                    className="border-b border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-3 py-2 text-center text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-3 py-2 text-left font-semibold text-gray-900">
                                        {account.name}
                                    </td>
                                    <td className="px-3 py-2 text-left text-gray-600">
                                        {account.email}
                                    </td>
                                    <td className="px-3 py-2 text-left text-black">
                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                            {account.role}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold text-center">
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
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm border-b border-gray-300 bg-gray-50">
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
        </div>
    );
}
