/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { FC } from 'react';
import { Input } from '@/components/ui/input';
import type { PublicFaculty } from '@/types/faculty';

// --- TYPES / INTERFACES ---

interface FacultyProfileCardsE2Props {
    formData: Partial<PublicFaculty>;
    handleChange?: (field: keyof PublicFaculty, value: any) => void;
    readOnly?: boolean;
}

// --- MAIN COMPONENT ---

export const FacultyProfileCardsE2: FC<FacultyProfileCardsE2Props> = ({ 
    formData, 
    handleChange, 
    readOnly = false 
}) => {
    // --- DERIVED ---

    const cardClass = cn(
        "space-y-3",
        !readOnly && "bg-white p-4 border border-gray-200 shadow-sm"
    );
    
    // --- HANDLERS ---

    const handleFieldChange = (field: keyof PublicFaculty, value: any) => {
        if (!readOnly && handleChange) {
            handleChange(field, value);
        }
    };

    // --- JSX COMPONENTS ---

    const facultyDetailsCard = (
        <div className={cardClass}>
            <h3 className="font-bold text-gray-900 border-b pb-2">Faculty Details (E2)</h3>
            <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-tight">Faculty Name</label>
                    <Input 
                        value={formData.name || ''} 
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-9 text-sm"
                        readOnly={readOnly}
                        disabled={readOnly}
                        placeholder="Last name, first name, middle initial"
                    />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-tight">Generic Faculty Rank (Code)</label>
                    <Input 
                        value={formData.rank || ''} 
                        onChange={(e) => handleFieldChange('rank', e.target.value)}
                        className="focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-9 text-sm"
                        readOnly={readOnly}
                        disabled={readOnly}
                        placeholder="Code"
                    />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-tight">Home Department</label>
                    <Input 
                        value={formData.department || ''} 
                        onChange={(e) => handleFieldChange('department', e.target.value)}
                        className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-9 text-sm"
                        readOnly={readOnly}
                        disabled={readOnly}
                    />
                </div>
            </div>
        </div>
    );

    const educationCard = (
        <div className={cardClass}>
            <h3 className="font-bold text-gray-900 border-b pb-2">Education</h3>
            <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-tight">Highest Degree Attained (Code)</label>
                    <Input 
                        value={formData.degree || ''} 
                        onChange={(e) => handleFieldChange('degree', e.target.value)}
                        className="focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-9 text-sm"
                        readOnly={readOnly}
                        disabled={readOnly}
                        placeholder="Code"
                    />
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ---

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
            {facultyDetailsCard}
            {educationCard}
        </div>
    );
};

// --- HELPER FUNCTIONS ---

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
