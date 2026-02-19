import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AdminDisciplineModule from '@/components/admin/disciplines/AdminDisciplineModule';

export default function Disciplines({ disciplines }: any) {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Disciplines', href: '/admin/disciplines' }]}>
            <Head title="Disciplines" />

            <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                <AdminDisciplineModule disciplines={disciplines} />
            </div>
        </AppSidebarLayout>
    );
}
