import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FacultyList() {
    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Faculty List', href: '/admin/faculty-list' }]}>
            <Head title="Faculty List" />

            <div className="flex flex-1 flex-col gap-6 w-full p-4 md:px-8 text-[#1b1b18] dark:text-[#EDEDEC]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Faculty List</h1>
                        <p className="text-muted-foreground text-sm">Manage all faculty members.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Faculty</CardTitle>
                        <CardDescription>List of all registered faculty members.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Faculty list content will go here.</p>
                    </CardContent>
                </Card>
            </div>
        </AppSidebarLayout>
    );
}
