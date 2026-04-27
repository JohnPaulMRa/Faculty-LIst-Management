import { Head, router } from '@inertiajs/react';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { FC } from 'react';
import { toast } from 'sonner';

import FacultyFormE2 from '@/components/faculty/facultyE2/FacultyFormE2';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { getMissingE2Fields } from '@/lib/validationE2';
import { facultyprofile } from '@/routes';
import { update } from '@/routes/faculty';
import type { PublicFaculty } from '@/types/faculty';
import { IMPORT_GROUPS } from '@/types/faculty/constants';


interface EditProps {
    faculty: PublicFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    referenceData: any;
    isSubmitted?: boolean;
}

const EditPublicFaculty: FC<EditProps> = ({ faculty, referenceData, isSubmitted = false }) => {
    // Helper to normalize data
    const getInitialFormData = useCallback((fac: PublicFaculty, ref: any) => {
        const disciplines = ref?.disciplines as { code: string, desc: string }[];
        const getDesc = (code?: any) => disciplines?.find(item => String(item.code) === String(code))?.desc || '';

        return {
            ...fac,
            discipline_load_1_desc: (fac as any).discipline_load_1_desc || getDesc(fac.discipline_load_1),
            discipline_load_2_desc: (fac as any).discipline_load_2_desc || getDesc(fac.discipline_load_2),
            discipline_bachelors_desc: (fac as any).discipline_bachelors_desc || getDesc(fac.discipline_bachelors),
            discipline_masters_desc: (fac as any).discipline_masters_desc || getDesc(fac.discipline_masters),
            discipline_doctorate_desc: (fac as any).discipline_doctorate_desc || getDesc(fac.discipline_doctorate),
        };
    }, []);

    const [formData, setFormData] = useState<Partial<PublicFaculty>>(() => getInitialFormData(faculty, referenceData));
    const [processing, setProcessing] = useState(false);

    // Update state when faculty or referenceData changes (Update during render pattern)
    const [prevFacultyId, setPrevFacultyId] = useState(faculty.id);
    const [prevRef, setPrevRef] = useState(referenceData);

    if (faculty.id !== prevFacultyId || referenceData !== prevRef) {
        setPrevFacultyId(faculty.id);
        setPrevRef(referenceData);
        setFormData(getInitialFormData(faculty, referenceData));
    }

    const selectedGroup = IMPORT_GROUPS.find(g =>
        g.value === formData.import_group ||
        g.value === `GROUP ${formData.import_group}` ||
        g.value.replace('GROUP ', '') === formData.import_group
    );
    const groupLabel = (selectedGroup ? selectedGroup.label : (formData.import_group || 'Form E-2 Entry')).replace(/^GROUP\s+/, '');
    const groupRemarks = selectedGroup?.remarks;

    const handleChange = (field: keyof PublicFaculty | string, value: string, desc?: string) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            // If it's a discipline field, also update its description field for the UI
            if (desc !== undefined) {
                (newData as any)[`${field}_desc`] = desc;
            }
            return newData;
        });
    };

    const handleSave = () => {
        const missingFields = getMissingE2Fields(formData);

        if (missingFields.length > 0) {
            const displayLimit = 10;
            const displayedFields = missingFields.slice(0, displayLimit);
            const remainingCount = missingFields.length - displayLimit;

            let msg = `Missing Required Details (CHED Compliance):\n\n• ${displayedFields.join('\n• ')}`;
            if (remainingCount > 0) {
                msg += `\n• ...and ${remainingCount} other required fields`;
            }
            msg += `\n\nOnly fields applicable to the faculty's degree and workload are required.`;

            toast.warning(msg);
            return;
        }

        setProcessing(true);

        router.put(update({ id: faculty.id }).url, formData, {
            onSuccess: () => {
                toast.success("Faculty updated successfully!");
                router.visit(facultyprofile().url);
            },
            onError: (errors) => {
                let msg = "Failed to update faculty.";
                if (Object.keys(errors).length > 0) {
                    msg += "\n" + Object.values(errors).join("\n");
                }
                toast.error(msg);
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
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-wider">
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
                        onClick={isSubmitted ? handleBack : handleSave}
                        disabled={processing}
                        className={isSubmitted ? "bg-[#003468] hover:bg-[#002a54] text-white" : "bg-green-800 hover:bg-green-600 text-white"}
                    >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (isSubmitted ? <ArrowLeft className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />)}
                        {isSubmitted ? 'Return to List' : 'Save Changes'}
                    </Button>
                </div>

                <FacultyFormE2
                    formData={formData}
                    onChange={handleChange}
                    referenceData={referenceData}
                    onCancel={handleBack}
                    hideHeader={true}
                    readOnly={isSubmitted}
                />
            </div>
        </AppLayout>
    );
};

export default EditPublicFaculty;
