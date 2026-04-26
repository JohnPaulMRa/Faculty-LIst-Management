/* eslint-disable @typescript-eslint/no-explicit-any */

import { Head, router } from '@inertiajs/react';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { FC } from 'react';

import { FacultyProfileCardsE5 } from '@/components/faculty/facultyE5/FacultyProfileCardsE5';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { getMissingE5Fields, isFormE5Complete } from '@/lib/validationE5';
import { facultyprofile } from '@/routes';
import { update } from '@/routes/faculty';
import type { Faculty } from '@/types/faculty';


interface EditProps {
    faculty: Faculty;
    referenceData: any;
    isSubmitted?: boolean;
}

const Edit: FC<EditProps> = ({ faculty, referenceData, isSubmitted = false }) => {
    // Helper to check if it's E5
    const isE5 = faculty.form_type === 'E5';

    // Helper to normalize code/description values (copied from FormE5)
    const normalizeCode = useCallback((list: { code: string, desc: string }[], value?: string) => {
        if (!value || !list) return value || '';
        if (list.some(item => item.code === value)) return value;
        const found = list.find(item => item.desc.trim().toLowerCase() === value.trim().toLowerCase());
        return found ? found.code : value;
    }, []);

    // Helper to initialize/normalize data
    const getInitialFormData = useCallback((fac: Faculty, ref: any) => {
        const disciplines = ref?.disciplines as { code: string, desc: string }[];
        const getDisciplineDesc = (code?: any) => disciplines?.find(item => String(item.code) === String(code))?.desc || '';

        if (fac.form_type === 'E5') {
            return {
                name: fac.name || '',
                fullTimeCode: normalizeCode(ref?.fullTimePartTime, (fac as any).fullTimeCode || (fac as any).ft_pt_code),
                genderCode: normalizeCode(ref?.gender, (fac as any).genderCode || (fac as any).gender_code),
                disciplineCode: normalizeCode(ref?.disciplines, (fac as any).disciplineCode || (fac as any).discipline_code),
                discipline: (fac as any).discipline || getDisciplineDesc((fac as any).disciplineCode || (fac as any).discipline_code),
                degree: normalizeCode(ref?.highestDegree, (fac as any).degree || (fac as any).highest_degree_code),
                bachelors: (fac as any).bachelors || getDisciplineDesc((fac as any).bachelorsCode || (fac as any).bachelors_code),
                bachelorsCode: normalizeCode(ref?.disciplines, (fac as any).bachelorsCode || (fac as any).bachelors_code),
                masters: (fac as any).masters || getDisciplineDesc((fac as any).mastersCode || (fac as any).masters_code),
                mastersCode: normalizeCode(ref?.disciplines, (fac as any).mastersCode || (fac as any).masters_code),
                doctorate: (fac as any).doctorate || getDisciplineDesc((fac as any).doctorateCode || (fac as any).doctorate_code),
                doctorateCode: normalizeCode(ref?.disciplines, (fac as any).doctorateCode || (fac as any).doctorate_code),
                licenseCode: normalizeCode(ref?.professionalLicense, (fac as any).licenseCode || (fac as any).license_code),
                tenureCode: normalizeCode(ref?.tenure, (fac as any).tenureCode || (fac as any).tenure_code),
                rankCode: normalizeCode(ref?.facultyRank, (fac as any).rankCode || (fac as any).rank_code),
                loadCode: normalizeCode(ref?.teachingLoad, (fac as any).loadCode || (fac as any).teaching_load_code),
                subjects: (fac as any).subjects || '',
                salaryCode: normalizeCode(ref?.annualSalary, (fac as any).salaryCode || (fac as any).salary_range_code),
                joined_year: fac.joined_year || '',
                status: fac.status || ''
            };
        } else {
            return {
                name: fac.name || '',
                fullTimeCode: '',
                genderCode: '',
                disciplineCode: '',
                discipline: '',
                degree: normalizeCode(ref?.highestDegree, fac.degree || (fac as any).highest_degree_code),
                bachelors: '',
                bachelorsCode: '',
                masters: '',
                mastersCode: '',
                doctorate: '',
                doctorateCode: '',
                licenseCode: '',
                tenureCode: '',
                rankCode: normalizeCode(ref?.facultyRank, fac.rank || (fac as any).rank_code),
                loadCode: '',
                subjects: '',
                salaryCode: '',
                joined_year: fac.joined_year || '',
                status: fac.status || ''
            };
        }
    }, [normalizeCode]);

    const [formData, setFormData] = useState(() => getInitialFormData(faculty, referenceData));
    const [processing, setProcessing] = useState(false);

    // Update state when faculty or referenceData changes (Update during render pattern)
    const [prevFaculty, setPrevFaculty] = useState(faculty);
    const [prevRef, setPrevRef] = useState(referenceData);

    if (faculty.id !== prevFaculty.id || referenceData !== prevRef) {
        setPrevFaculty(faculty);
        setPrevRef(referenceData);
        setFormData(getInitialFormData(faculty, referenceData));
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Auto-calculate status (Compute during render instead of effect)
    const isComplete = isFormE5Complete(formData, isE5);
    let currentStatus = formData.status;

    if (!isComplete) {
        currentStatus = 'Not Updated';
    } else if (formData.status !== 'Completed' && formData.status !== 'Submitted') {
        currentStatus = 'Updated';
    }

    const handleSave = () => {
        const missingFields = getMissingE5Fields(formData, isE5);

        if (missingFields.length > 0) {
            alert(`Missing Required Details (CHED Compliance):\n\n• ${missingFields.join('\n• ')}\n\nOnly fields applicable to the faculty's degree and workload are required.`);
            return;
        }

        setProcessing(true);

        // Helper to get description for syncing legacy string fields
        const getDesc = (list: { code: string, desc: string }[], code?: string) => {
            return list?.find(item => item.code === code)?.desc || '';
        };

        // Helper for discipline descriptions (from flat list)
        const getDisciplineDesc = (code?: string) => {
            const disciplines = referenceData?.disciplines as { code: string, desc: string }[];
            return disciplines?.find(item => item.code === code)?.desc || '';
        };

        // Sync legacy string fields
        const syncedData = {
            ...formData,
            status: currentStatus,
            rank: getDesc(referenceData?.facultyRank, formData.rankCode) || (faculty.form_type === 'E2' ? (faculty as any).rank : (faculty.form_type === 'E5' ? (faculty as any).rankCode : '')) || '',
            employment: getDesc(referenceData?.fullTimePartTime, formData.fullTimeCode) || (faculty.form_type === 'E2' ? (faculty as any).employment : '') || '',

            // Sync Degree Strings
            bachelors: formData.bachelors || getDisciplineDesc(formData.bachelorsCode) || (faculty as any).bachelors || '',
            masters: formData.masters || getDisciplineDesc(formData.mastersCode) || (faculty as any).masters || '',
            doctorate: formData.doctorate || getDisciplineDesc(formData.doctorateCode) || (faculty as any).doctorate || ''
        };

        router.put(update({ id: faculty.id }).url, syncedData, {
            onSuccess: () => {
                // Processing handled by onFinish or page visit
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

    const breadcrumbs = [
        { title: 'Edit Faculty', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Faculty - ${faculty.name}`} />

            <div className="flex flex-1 flex-col gap-6 w-full py-18 px-2 md:px-20 max-w-8xl mx-auto">


                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        FACULTY OR TEACHING STAFF IN HIGHER EDUCATION PROGRAMS
                    </h1>
                    <Button
                        onClick={isSubmitted ? () => router.visit(facultyprofile().url) : handleSave}
                        disabled={processing}
                        className={isSubmitted ? "bg-[#003468] hover:bg-[#002a54] text-white" : "bg-green-800 hover:bg-green-600 text-white"}
                    >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (isSubmitted ? <ArrowLeft className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />)}
                        {isSubmitted ? 'Return to List' : 'Save Changes'}
                    </Button>
                </div>

                <FacultyProfileCardsE5
                    formData={formData}
                    handleChange={handleChange}
                    referenceData={referenceData}
                    readOnly={isSubmitted}
                />
            </div>
        </AppLayout>
    );
};

export default Edit;
