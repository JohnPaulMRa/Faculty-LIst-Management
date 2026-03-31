/* eslint-disable @typescript-eslint/no-explicit-any */
 
import type { FC} from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Faculty } from '@/types/faculty';
import FacultyFormE2 from './facultyE2/FacultyFormE2';
import FacultyFormE5 from './facultyE5/FacultyFormE5';

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: Faculty | null;
    onSave: (faculty: Faculty) => void;
    referenceData: any;
};

const E2_FIELD_LABELS: Record<string, string> = {
    name: 'Name of Faculty (Last, First, M.I.)',
    rank: 'Generic Faculty Rank',
    college: 'Home College',
    department: 'Home Department',
    is_tenured: 'Is Faculty Member Tenured?',
    salary_grade: 'SSL Salary Grade',
    annual_salary: 'Annual Basic Salary',
    on_leave: 'On Leave Without Pay?',
    fte: 'Full-Time Equivalent (FTE)',
    gender: 'Gender of Faculty',
    degree: 'Highest Degree Attained',
    pursuing_degree: 'Actively Pursuing Next Degree?',
    discipline_load_1: 'Primary Discipline (1)',
    discipline_load_2: 'Primary Discipline (2)',
    discipline_bachelors: 'Bachelors Discipline',
    discipline_masters: 'Masters Discipline',
    discipline_doctorate: 'Doctorate Discipline',
    masters_thesis: 'Masters Degree with Thesis?',
    doctorate_dissertation: 'Doctorate with Dissertation?',
    ug_lab_units: 'Lab Credit Units (UG)',
    ug_lec_units: 'Lecture Credit Units (UG)',
    ug_lab_hours: 'Lab Hours (UG)',
    ug_lec_hours: 'Lecture Hours (UG)',
    ug_lab_contact: 'Lab Contact Hours (UG)',
    ug_lec_contact: 'Lecture Contact Hours (UG)',
    grad_lab_units: 'Lab Units (Grad)',
    grad_lec_units: 'Lecture Units (Grad)',
    grad_lab_contact: 'Lab Contact (Grad)',
    grad_lec_contact: 'Lecture Contact (Grad)',
    load_research: 'OFFICIAL RESEARCH LOAD',
    load_extension: 'OFFICIAL EXTENSION LOAD',
    load_study: 'OFFICIAL STUDY LOAD',
    load_production: 'OFFICIAL LOAD FOR PRODUCTION',
    load_admin: 'OFFICIAL ADMINISTRATIVE LOAD',
    load_others: 'OTHER OFFICIAL LOAD CREDITS'
};

const E5_FIELD_LABELS: Record<string, string> = {
    name: 'Faculty Name (LN, FN, MI)',
    fullTimeCode: 'Full-Time/Part-Time',
    genderCode: 'Gender',
    disciplineCode: 'Primary Teaching Discipline',
    degree: 'Highest Degree Attained',
    bachelorsCode: "Specific Discipline of Bachelors Degree",
    mastersCode: "Specific Discipline of Masters Degree",
    doctorateCode: "Specific Discipline of Doctorate Degree",
    licenseCode: 'Professional License',
    tenureCode: 'Tenure of Employment',
    rankCode: 'Faculty Rank',
    loadCode: 'Teaching Load',
    salaryCode: 'Annual Salary',
    subjects: 'Subjects Taught',
    joined_year: 'Joined Year'
};

const FacultyFileDetailsModal: FC<Props> = ({ isOpen, onOpenChange, faculty, onSave, referenceData }) => {
    const [localFormData, setLocalFormData] = useState<any>(null);

    useEffect(() => {
        if (isOpen && faculty) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalFormData({ ...faculty });
        }
    }, [isOpen, faculty]);

    const handleChange = (field: string, value: any) => {
        setLocalFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!localFormData) return;

        const missingFields: string[] = [];
        const isE5 = localFormData.form_type === 'E5';
        const isE2 = localFormData.form_type === 'E2';

        if (isE2) {
            Object.entries(E2_FIELD_LABELS).forEach(([key, label]) => {
                const value = (localFormData as any)[key];
                if (value === undefined || value === null || value.toString().trim() === '') {
                    missingFields.push(label);
                }
            });
        } else {
            Object.entries(E5_FIELD_LABELS).forEach(([key, label]) => {
                // Skill check: Gender and Discipline only for E5 form type
                if (!isE5 && (key === 'genderCode' || key === 'disciplineCode')) return;
                
                const value = (localFormData as any)[key];
                if (value === undefined || value === null || value.toString().trim() === '') {
                    missingFields.push(label);
                }
            });
        }

        if (missingFields.length > 0) {
            const displayLimit = 10;
            const displayedFields = missingFields.slice(0, displayLimit);
            const remainingCount = missingFields.length - displayLimit;
            
            let msg = `Missing Details:\n\n• ${displayedFields.join('\n• ')}`;
            if (remainingCount > 0) {
                msg += `\n• ...and ${remainingCount} other fields`;
            }
            msg += `\n\nAll fields must be filled out before saving.`;
            
            alert(msg);
            return;
        }

        onSave(localFormData as Faculty);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent 
                className="sm:max-w-[95vw] w-[95vw] max-h-[95vh] flex flex-col p-0 gap-0 border-none outline-none bg-white [&>button]:hidden rounded-none overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="flex justify-end p-0 absolute top-0 right-0 z-50">
                    <DialogTitle className="sr-only">Faculty File Details</DialogTitle>
                    {/* Close button is automatically added by DialogContent usually, but we might need to style it or ensure z-index */}
                </div>

                {faculty && localFormData && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 bg-white relative">
                            {(faculty.form_type === 'E2') ? (
                                <div className="h-full w-full">
                                    <FacultyFormE2
                                        faculty={faculty}
                                        formData={localFormData}
                                        onChange={(field, value) => handleChange(field as string, value)}
                                        referenceData={referenceData}
                                        hideHeader={true}
                                    />
                                </div>
                            ) : (
                                <div className="h-full w-full">
                                    <FacultyFormE5
                                        faculty={faculty}
                                        referenceData={referenceData}
                                        hideHeader={true}
                                        onChange={(field, value) => handleChange(field, value)}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-none">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-[#003468] text-white rounded-md hover:bg-[#002850] transition-colors font-bold"
                            >
                                Save Changes
                            </button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FacultyFileDetailsModal;
