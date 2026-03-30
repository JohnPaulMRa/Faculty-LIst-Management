import { Head } from '@inertiajs/react';
import HeisAccountsModule from '@/components/admin/heis-accounts/HeisAccountsModule';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeisAccounts({ heis, accounts }: any) {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'HEIs & Accounts', href: '/admin/heis-accounts' }]}>
            <Head title="HEIs & Accounts" />

            <div className="flex flex-1 flex-col w-full text-[#1b1b18] dark:text-[#EDEDEC] p-4 lg:p-6 bg-zinc-50 dark:bg-zinc-900">
                <HeisAccountsModule heis={heis} accounts={accounts} />
            </div>
        </AppSidebarLayout>
    );
}
