/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PublicFaculty } from '@/types/faculty';
import { isFormE2Complete } from '@/lib/validationE2';
import { FacultyProfileCardsE2 } from './FacultyProfileCardsE2';

// --- TYPES / INTERFACES ---

interface FacultyFormE2Props {
    faculty?: PublicFaculty;
    formData?: Partial<PublicFaculty>;
    onChange?: (field: keyof PublicFaculty, value: string) => void;
    onCancel?: () => void;
    onSave?: (data: Partial<PublicFaculty>) => void;
    referenceData?: any;
    hideHeader?: boolean;
}

// --- MAIN COMPONENT ---

const FacultyFormE2: FC<FacultyFormE2Props> = ({
    faculty,
    hideHeader = false,
    formData: externalFormData,
    onChange: externalOnChange,
    referenceData
}) => {
    // --- HOOKS ---

    const [internalFormData, setInternalFormData] = useState<Partial<PublicFaculty>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (faculty && !externalFormData) {
            setInternalFormData(faculty);
        }
    }, [faculty, externalFormData]);

    const formData = externalFormData || internalFormData;

    // --- HANDLERS ---

    const handleChange = (field: keyof PublicFaculty, value: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }

        if (externalOnChange) {
            externalOnChange(field, value);
        } else {
            setInternalFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Auto-calculate status (Validation/Logic)
    useEffect(() => {
        const isComplete = isFormE2Complete(formData);
        let newStatus = formData.status;

        if (!isComplete) {
            newStatus = 'Not Yet Completed';
        } else if (formData.status !== 'Completed' && formData.status !== 'Submitted') {
            newStatus = 'Updated';
        }

        if (formData.status !== newStatus) {
            handleChange('status', newStatus || 'Not Yet Completed');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    // --- MAIN RENDER ---

    if (hideHeader) {
        return (
            <div className="w-full bg-gray-50/50 p-2">
                <FacultyProfileCardsE2
                    formData={formData}
                    handleChange={handleChange}
                    readOnly={false}
                    referenceData={referenceData}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[90vh] md:h-[85vh] w-full bg-gray-50 overflow-hidden rounded-md">
            {/* Header (Vessel) */}
            <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
                <div>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        FORM E-2
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
                            Tertiary Faculty Profile
                        </Badge>
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <DialogClose className="h-9 w-9 flex items-center justify-center hover:bg-white/10 rounded-md transition-all duration-200">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </div>
            </div>

            {/* Content (Cards) */}
            <ScrollArea className="flex-1 px-8 py-6">
                <div className="max-w-7xl mx-auto pb-8">
                    <FacultyProfileCardsE2
                        formData={formData}
                        handleChange={handleChange}
                        readOnly={false}
                        referenceData={referenceData}
                    />
                </div>
            </ScrollArea>
        </div>
    );
};

export default FacultyFormE2;