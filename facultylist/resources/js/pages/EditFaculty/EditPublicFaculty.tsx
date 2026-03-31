import { Head, router } from '@inertiajs/react';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { FC } from 'react';

import FacultyFormE2 from '@/components/faculty/facultyE2/FacultyFormE2';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { facultyprofile } from '@/routes';
import { update } from '@/routes/faculty';
import type { PublicFaculty } from '@/types/faculty';
import { IMPORT_GROUPS } from '@/types/faculty/constants';

interface EditProps {
    faculty: PublicFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    referenceData: any;
}

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

const EditPublicFaculty: FC<EditProps> = ({ faculty, referenceData }) => {
    const [formData, setFormData] = useState<Partial<PublicFaculty>>(faculty);
    const [processing, setProcessing] = useState(false);

    const selectedGroup = IMPORT_GROUPS.find(g =>
        g.value === formData.import_group ||
        g.value === `GROUP ${formData.import_group}` ||
        g.value.replace('GROUP ', '') === formData.import_group
    );
    const groupLabel = (selectedGroup ? selectedGroup.label : (formData.import_group || 'Form E-2 Entry')).replace(/^GROUP\s+/, '');
    const groupRemarks = selectedGroup?.remarks;

    const handleChange = (field: keyof PublicFaculty, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const missingFields: string[] = [];
        
        Object.entries(E2_FIELD_LABELS).forEach(([key, label]) => {
            const value = (formData as Record<string, unknown>)[key];
            if (value === undefined || value === null || value.toString().trim() === '') {
                missingFields.push(label);
            }
        });

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

        setProcessing(true);

        router.put(update({ id: faculty.id }).url, formData, {
            onSuccess: () => {
                router.visit(facultyprofile().url);
            },
            onError: (errors) => {
                let msg = "Failed to update faculty.";
                if (Object.keys(errors).length > 0) {
                    msg += "\n" + Object.values(errors).join("\n");
                }
                alert(msg);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleBack = () => {
        router.visit(facultyprofile().url);
    };

    const breadcrumbs = [
        { title: 'Edit Faculty', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Faculty - ${faculty.name}`} />

            <div className="flex flex-1 flex-col gap-5 w-full py-18 px-2 md:px-20 max-w-8xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex flex-col mt-1">
                            <p className="text-2xl font-bold text-gray-00 dark:text-gray-100 tracking-wider">
                                {groupLabel}
                            </p>
                            {groupRemarks && (
                                <p className="text-gray-400 text-[15px] italic mt-0.5 max-w-2px leading-tight">
                                    {groupRemarks}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={processing}
                        className="bg-green-800 hover:bg-green-600 text-white"
                    >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <FacultyFormE2
                    formData={formData}
                    onChange={handleChange}
                    referenceData={referenceData}
                    onCancel={handleBack}
                    hideHeader={true}
                />
            </div>
        </AppLayout>
    );
};

export default EditPublicFaculty;
