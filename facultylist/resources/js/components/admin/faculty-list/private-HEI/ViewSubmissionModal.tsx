import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PrivateFacultyProfileView } from './PrivateFacultyProfileView';

interface ViewSubmissionModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    selectedFaculty: any;
    referenceData: any;
}

export function ViewSubmissionModal({ isOpen, onClose, selectedFaculty, referenceData }: ViewSubmissionModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-[1200px] w-full max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-md">
                <DialogHeader className="p-6 pb-2 sticky top-0 bg-white z-10 border-b border-gray-200">
                    <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                        Faculty Profile Details
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 bg-gray-50/50">
                    {selectedFaculty && (
                        <PrivateFacultyProfileView
                            formData={{
                                name: selectedFaculty.name,
                                fullTimeCode: selectedFaculty.fullTimeCode,
                                genderCode: selectedFaculty.genderCode,
                                disciplineCode: selectedFaculty.disciplineCode,
                                degree: selectedFaculty.degree,
                                bachelors: selectedFaculty.bachelors,
                                bachelorsCode: selectedFaculty.bachelorsCode,
                                masters: selectedFaculty.masters,
                                mastersCode: selectedFaculty.mastersCode,
                                doctorate: selectedFaculty.doctorate,
                                doctorateCode: selectedFaculty.doctorateCode,
                                licenseCode: selectedFaculty.licenseCode,
                                tenureCode: selectedFaculty.tenureCode,
                                rankCode: selectedFaculty.rankCode,
                                loadCode: selectedFaculty.loadCode,
                                subjects: selectedFaculty.subjects,
                                salaryCode: selectedFaculty.salaryCode,
                                joined_year: selectedFaculty.joined_year,
                                status: selectedFaculty.status,
                            }}
                            referenceData={referenceData}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
