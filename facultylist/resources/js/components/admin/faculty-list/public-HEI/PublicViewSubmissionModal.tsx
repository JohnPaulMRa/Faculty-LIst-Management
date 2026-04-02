/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PublicFacultyProfileView } from './PublicFacultyProfileView';

interface PublicViewSubmissionModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    selectedFaculty: any;
    referenceData: any;
}

export function PublicViewSubmissionModal({ isOpen, onClose, selectedFaculty, referenceData }: PublicViewSubmissionModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[95vw] sm:max-w-[1600px] w-full max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-[4px] [&>button]:hidden text-gray-900"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-2 sticky top-0 bg-white z-10 border-b border-gray-200">
                    <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                        <span>Faculty Profile Details</span>
                        <button
                            onClick={() => onClose(false)}
                            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-900"
                        >
                            <X className="h-6 w-6 text-gray-900" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 bg-gray-50/50">
                    {selectedFaculty && (
                        <PublicFacultyProfileView
                            formData={{
                                name: selectedFaculty.name,
                                import_group: selectedFaculty.import_group,
                                rank: selectedFaculty.rank,
                                college: selectedFaculty.college,
                                department: selectedFaculty.department,
                                is_tenured: selectedFaculty.is_tenured,
                                salary_grade: selectedFaculty.salary_grade,
                                annual_salary: selectedFaculty.annual_salary,
                                on_leave: selectedFaculty.on_leave,
                                fte: selectedFaculty.fte,
                                gender: selectedFaculty.gender,

                                degree: selectedFaculty.degree,
                                pursuing_degree: selectedFaculty.pursuing_degree,
                                discipline_load_1: selectedFaculty.discipline_load_1,
                                discipline_load_2: selectedFaculty.discipline_load_2,
                                discipline_bachelors: selectedFaculty.discipline_bachelors,
                                discipline_masters: selectedFaculty.discipline_masters,
                                discipline_doctorate: selectedFaculty.discipline_doctorate,
                                masters_thesis: selectedFaculty.masters_thesis,
                                doctorate_dissertation: selectedFaculty.doctorate_dissertation,

                                ug_lab_units: selectedFaculty.ug_lab_units,
                                ug_lec_units: selectedFaculty.ug_lec_units,
                                ug_total_units: selectedFaculty.ug_total_units,
                                ug_lab_hours: selectedFaculty.ug_lab_hours,
                                ug_lec_hours: selectedFaculty.ug_lec_hours,
                                ug_total_hours: selectedFaculty.ug_total_hours,
                                ug_lab_contact: selectedFaculty.ug_lab_contact,
                                ug_lec_contact: selectedFaculty.ug_lec_contact,
                                ug_total_contact: selectedFaculty.ug_total_contact,

                                grad_lab_units: selectedFaculty.grad_lab_units,
                                grad_lec_units: selectedFaculty.grad_lec_units,
                                grad_total_units: selectedFaculty.grad_total_units,
                                grad_lab_contact: selectedFaculty.grad_lab_contact,
                                grad_lec_contact: selectedFaculty.grad_lec_contact,
                                grad_total_contact: selectedFaculty.grad_total_contact,

                                load_research: selectedFaculty.load_research,
                                load_extension: selectedFaculty.load_extension,
                                load_study: selectedFaculty.load_study,
                                load_production: selectedFaculty.load_production,
                                load_admin: selectedFaculty.load_admin,
                                load_others: selectedFaculty.load_others,
                                load_total: selectedFaculty.load_total,

                            }}
                            referenceData={referenceData}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
