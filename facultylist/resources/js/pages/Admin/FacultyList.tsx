import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AdminFacultyListModule from '@/components/admin/faculty-list/AdminFacultyListModule';

export default function FacultyList({ heis, faculty, filters, referenceData }: any) {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Faculty List', href: '/admin/faculty-list' }]}>
            <Head title="Faculty List" />

            <div className="flex flex-1 flex-col w-full text-[#1b1b18] dark:text-[#EDEDEC]">
                <AdminFacultyListModule schools={heis} faculty={faculty} filters={filters} referenceData={referenceData} />
            </div>
        </AppSidebarLayout>
    );
}
