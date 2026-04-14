import { router } from '@inertiajs/react';
import { Search, Plus, Building, Users } from 'lucide-react';
import { useState } from 'react';
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

    const handleEditHei = (hei: Hei) => {
        setSelectedHei(hei);
        setIsHeiModalOpen(true);
    };

    const handleDeleteHei = (hei: Hei) => {
        if (confirm(`Are you sure you want to delete ${hei.name}?`)) {
            router.delete(route('admin.heis.destroy', hei.id));
        }
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
        if (confirm(`Are you sure you want to delete the account for ${account.name}?`)) {
            router.delete(route('admin.users.destroy', account.id));
        }
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
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search..."
                                className="pl-9 h-10 w-full"
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
                <div className="flex border-b border-gray-200 mb-6 w-full">
                    <button
                        onClick={() => setActiveTab('heis')}
                        className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-medium text-sm w-max transition-colors mr-6 ${activeTab === 'heis' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Building className="h-4 w-4" />
                        Higher Education Institutions
                    </button>
                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-medium text-sm w-max transition-colors ${activeTab === 'accounts' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
