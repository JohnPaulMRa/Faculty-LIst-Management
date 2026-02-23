import React from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { destroy } from '@/routes/faculty';
import FacultyListTableE2 from '@/components/faculty/facultyE2/FacultyListTableE2';

interface PublicSchoolViewProps {
    schoolName: string;
    faculty: any[];
}

export function PublicSchoolView({ schoolName, faculty }: PublicSchoolViewProps) {
    return (
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-gray-400 font-normal">Faculty List:</span>
                        {schoolName}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Viewing all faculty members for this public school.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-md border-gray-300">
                    Download Report
                </Button>
            </div>

            <FacultyListTableE2
                facultyList={faculty}
                yearFilter="All Years"
                onFileClick={(f) => console.log('File click', f)}
                onDelete={(id) => {
                    if (confirm('Are you sure you want to delete this faculty member?')) {
                        router.delete(destroy({ id }).url);
                    }
                }}
                onEdit={(f) => console.log('Edit', f)}
            />
        </div>
    );
}
