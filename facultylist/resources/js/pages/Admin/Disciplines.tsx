import { Head } from '@inertiajs/react';
import AdminDisciplineModule from '@/components/admin/disciplines/AdminDisciplineModule';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Disciplines({ disciplines, programs, filters }: any) {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Disciplines', href: '/admin/disciplines' }]}>
            <Head title="Disciplines" />

            <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                <AdminDisciplineModule 
                    disciplines={disciplines} 
                    serverPrograms={programs}
                    serverFilters={filters}
                />
            </div>
        </AppSidebarLayout>
    );
}
