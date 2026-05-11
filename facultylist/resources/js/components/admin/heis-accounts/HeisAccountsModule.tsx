import { router } from '@inertiajs/react';
import { Search, Plus, Building, Users } from 'lucide-react';
import { useState } from 'react';
import AlertDialogModal from '@/components/common/AlertDialogModal';
import { useAlertDialog } from '@/components/faculty/hooks/useAlertDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Hei } from '@/types/hei';
import AddHEIsModal from './AddHEIsModal';
import CreateFacultyAccountModal from './CreateFacultyAccountModal';
import { HeisTable } from './HeisTable';
import { UserAccountsTable } from './UserAccountsTable';



interface UserAccount {
    id: number;
    name: string;
    email: string;
    role: string;
    hei_id: number;
    hei_type?: string;
}

interface HeisAccountsModuleProps {
    heis: Hei[];
    accounts: UserAccount[];
}

export default function HeisAccountsModule({ heis = [], accounts = [] }: HeisAccountsModuleProps) {
    const [activeTab, setActiveTab] = useState<'heis' | 'accounts'>('heis');
    const [searchQuery, setSearchQuery] = useState("");
    const [isHeiModalOpen, setIsHeiModalOpen] = useState(false);
    const [selectedHei, setSelectedHei] = useState<Hei | null>(null);
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
    const { alertDialog, showConfirm, closeDialog } = useAlertDialog();

    const handleEditHei = (hei: Hei) => {
        setSelectedHei(hei);
        setIsHeiModalOpen(true);
    };

    const handleDeleteHei = (hei: Hei) => {
        showConfirm(
            `Are you sure you want to delete ${hei.name}?`,
            () => router.delete(route('admin.heis.destroy', hei.id)),
            "Confirm HEI Deletion",
            "error"
        );
    };

    const closeHeiModal = (open: boolean) => {
        setIsHeiModalOpen(open);
        if (!open) setSelectedHei(null);
    };

    const handleEditAccount = (account: UserAccount) => {
        setSelectedAccount(account);
        setIsCreateAccountModalOpen(true);
    };

    const handleDeleteAccount = (account: UserAccount) => {
        showConfirm(
            `Are you sure you want to delete the account for ${account.name}?`,
            () => router.delete(route('admin.users.destroy', account.id)),
            "Confirm Account Deletion",
            "error"
        );
    };

    const closeAccountModal = (open: boolean) => {
        setIsCreateAccountModalOpen(open);
        if (!open) setSelectedAccount(null);
    };

    const filteredHeis = heis.filter(hei => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            hei.name.toLowerCase().includes(searchLower) ||
            (hei.hei_code && hei.hei_code.toLowerCase().includes(searchLower))
        );
    });

    const enrichedAccounts = accounts.map(account => {
        const hei = heis.find(h => h.id === account.hei_id);
        return {
            ...account,
            hei_type: account.role.toLowerCase() === 'admin' ? 'SYSTEM' : (hei?.type || 'N/A')
        };
    });

    const filteredAccounts = enrichedAccounts.filter(account => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            account.name.toLowerCase().includes(searchLower) ||
            account.email.toLowerCase().includes(searchLower) ||
            account.role.toLowerCase().includes(searchLower) ||
            account.hei_type?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="flex flex-col w-full h-full ">
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">HEIs & Accounts</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage Higher Education Institutions and user accounts.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Search HEIs or accounts..."
                                className="pl-11 h-12 w-full rounded-2xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedHei(null);
                                setIsHeiModalOpen(true);
                            }}
                            className="w-full md:w-auto bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 rounded-xl h-10 gap-2 shrink-0 shadow-sm"
                        >
                            <Plus className="h-4 w-4" /> Add HEIs
                        </Button>
                        <Button
                            onClick={() => {
                                setSelectedAccount(null);
                                setIsCreateAccountModalOpen(true);
                            }}
                            className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800 rounded-xl h-10 gap-2 shrink-0 shadow-sm"
                        >
                            <Plus className="h-4 w-4" /> Create Account
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100/50 p-1 rounded-2xl mb-8 w-max border border-slate-200/50">
                    <button
                        onClick={() => setActiveTab('heis')}
                        className={`flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200 ${
                            activeTab === 'heis' 
                                ? 'bg-white text-blue-600 shadow-md shadow-blue-900/5 ring-1 ring-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                    >
                        <Building className="h-4 w-4" />
                        Institutions
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200 ${
                            activeTab === 'accounts' 
                                ? 'bg-white text-blue-600 shadow-md shadow-blue-900/5 ring-1 ring-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        User Accounts
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'heis' && (
                        <HeisTable 
                            heis={filteredHeis} 
                            searchQuery={searchQuery} 
                            onClearSearch={() => setSearchQuery('')} 
                            onEdit={handleEditHei}
                            onDelete={handleDeleteHei}
                        />
                    )}

                    {activeTab === 'accounts' && (
                        <UserAccountsTable 
                            accounts={filteredAccounts} 
                            searchQuery={searchQuery} 
                            onClearSearch={() => setSearchQuery('')} 
                            onEdit={handleEditAccount}
                            onDelete={handleDeleteAccount}
                        />
                    )}
                </div>
            </div>

            <AlertDialogModal
                open={alertDialog.open}
                message={alertDialog.message}
                type={alertDialog.type}
                title={alertDialog.title}
                onClose={closeDialog}
                onConfirm={alertDialog.onConfirm}
                confirmLabel="Delete"
            />

            <AddHEIsModal
                isOpen={isHeiModalOpen}
                onOpenChange={closeHeiModal}
                hei={selectedHei}
            />

            <CreateFacultyAccountModal
                isOpen={isCreateAccountModalOpen}
                onOpenChange={closeAccountModal}
                heis={heis}
                account={selectedAccount}
            />
        </div>
    );
}
