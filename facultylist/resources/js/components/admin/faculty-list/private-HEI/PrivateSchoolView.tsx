import React from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { destroy } from '@/routes/faculty';
import FacultyListTableE5 from '@/components/faculty/facultyE5/FacultyListTableE5';

interface PrivateSchoolViewProps {
    schoolName: string;
    faculty: any[];
    referenceData: any;
}

export function PrivateSchoolView({ schoolName, faculty, referenceData }: PrivateSchoolViewProps) {
    return (
        <div className="bg-white p-6 shadow-sm rounded-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-gray-400 font-normal">Faculty List:</span>
                        {schoolName}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Viewing all faculty members for this private school.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-md border-gray-300">
                    Download Report
                </Button>
            </div>

            <FacultyListTableE5
                facultyList={faculty}
                yearFilter="All Years"
                referenceData={referenceData}
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
