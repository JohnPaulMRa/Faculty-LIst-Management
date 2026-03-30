/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import PrivateFacultyTable from './PrivateFacultyTable';

interface PrivateSchoolViewProps {
    schoolName: string;
    faculty: any[];
    referenceData: any;
}

export function PrivateSchoolView({ schoolName, faculty, referenceData }: PrivateSchoolViewProps) {
    return (
        <div className="bg-white p-6 rounded-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-gray-400 font-normal">Faculty List:</span>
                        {schoolName}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Viewing all faculty members for this private school.</p>
                </div>

            </div>

            <PrivateFacultyTable faculty={faculty} referenceData={referenceData} />
        </div>
    );
}
