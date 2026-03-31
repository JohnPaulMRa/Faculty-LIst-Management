/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Head, router } from '@inertiajs/react';
import { Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { FacultyProfileCardsE5 } from '@/components/faculty/facultyE5/FacultyProfileCardsE5';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { facultyprofile } from '@/routes';
import { update } from '@/routes/faculty';
import type { Faculty } from '@/types/faculty';

interface EditProps {
    faculty: Faculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    referenceData: any;
}

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

const Edit: FC<EditProps> = ({ faculty, referenceData }) => {
    // Helper to check if it's E5
    const isE5 = faculty.form_type === 'E5';

    const [formData, setFormData] = useState({
        name: faculty.name || '',
        fullTimeCode: faculty.form_type === 'E5' ? (faculty as any).fullTimeCode || '' : '',
        genderCode: faculty.form_type === 'E5' ? (faculty as any).genderCode || '' : '',
        disciplineCode: faculty.form_type === 'E5' ? (faculty as any).disciplineCode || '' : '',
        degree: faculty.form_type === 'E5' ? (faculty as any).degree : (faculty as any).degree || '',
        bachelors: faculty.form_type === 'E5' ? (faculty as any).bachelors || '' : '',
        bachelorsCode: faculty.form_type === 'E5' ? (faculty as any).bachelorsCode || '' : '',
        masters: faculty.form_type === 'E5' ? (faculty as any).masters || '' : '',
        mastersCode: faculty.form_type === 'E5' ? (faculty as any).mastersCode || '' : '',
        doctorate: faculty.form_type === 'E5' ? (faculty as any).doctorate || '' : '',
        doctorateCode: faculty.form_type === 'E5' ? (faculty as any).doctorateCode || '' : '',
        licenseCode: faculty.form_type === 'E5' ? (faculty as any).licenseCode || '' : '',
        tenureCode: faculty.form_type === 'E5' ? (faculty as any).tenureCode || '' : '',
        rankCode: faculty.form_type === 'E5' ? (faculty as any).rankCode || '' : '',
        loadCode: faculty.form_type === 'E5' ? (faculty as any).loadCode || '' : '',
        subjects: faculty.form_type === 'E5' ? (faculty as any).subjects || '' : '',
        salaryCode: faculty.form_type === 'E5' ? (faculty as any).salaryCode || '' : '',
        joined_year: faculty.joined_year || '',
        status: faculty.status || ''
    });

    const [processing, setProcessing] = useState(false);

    // Helper to normalize code/description values (copied from FormE5)
    const normalizeCode = (list: { code: string, desc: string }[], value?: string) => {
        if (!value || !list) return value || '';
        if (list.some(item => item.code === value)) return value;
        const found = list.find(item => item.desc.trim().toLowerCase() === value.trim().toLowerCase());
        return found ? found.code : value;
    };

    // Initialize/Normalize data
    useEffect(() => {
        if (faculty) {
            if (faculty.form_type === 'E5') {
                 
                setFormData({
                    name: faculty.name || '',
                    fullTimeCode: normalizeCode(referenceData?.fullTimePartTime, (faculty as any).fullTimeCode),
                    genderCode: normalizeCode(referenceData?.gender, (faculty as any).genderCode),
                    disciplineCode: (faculty as any).disciplineCode || '',
                    degree: normalizeCode(referenceData?.highestDegree, (faculty as any).degree),
                    bachelors: (faculty as any).bachelors || '',
                    bachelorsCode: (faculty as any).bachelorsCode || '',
                    masters: (faculty as any).masters || '',
                    mastersCode: (faculty as any).mastersCode || '',
                    doctorate: (faculty as any).doctorate || '',
                    doctorateCode: (faculty as any).doctorateCode || '',
                    licenseCode: normalizeCode(referenceData?.professionalLicense, (faculty as any).licenseCode),
                    tenureCode: normalizeCode(referenceData?.tenure, (faculty as any).tenureCode),
                    rankCode: normalizeCode(referenceData?.facultyRank, (faculty as any).rankCode),
                    loadCode: normalizeCode(referenceData?.teachingLoad, (faculty as any).loadCode),
                    subjects: (faculty as any).subjects || '',
                    salaryCode: normalizeCode(referenceData?.annualSalary, (faculty as any).salaryCode),
                    joined_year: faculty.joined_year || '',
                    status: faculty.status || ''
                });
            } else {
                // Public Faculty (E2) - shared fields only
                 
                setFormData({
                    name: faculty.name || '',
                    fullTimeCode: '',
                    genderCode: '',
                    disciplineCode: '',
                    degree: normalizeCode(referenceData?.highestDegree, faculty.degree),
                    bachelors: '',
                    bachelorsCode: '',
                    masters: '',
                    mastersCode: '',
                    doctorate: '',
                    doctorateCode: '',
                    licenseCode: '',
                    tenureCode: '',
                    rankCode: normalizeCode(referenceData?.facultyRank, faculty.rank),
                    loadCode: '',
                    subjects: '',
                    salaryCode: '',
                    joined_year: faculty.joined_year || '',
                    status: faculty.status || ''
                });
            }
        }
         
    }, [faculty, referenceData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Auto-calculate status
    useEffect(() => {
        const requiredFields = [
            formData.name,
            formData.fullTimeCode,
            formData.degree,
            formData.bachelorsCode,
            formData.mastersCode,
            formData.doctorateCode,
            formData.licenseCode,
            formData.tenureCode,
            formData.rankCode,
            formData.loadCode,
            formData.salaryCode,
            formData.joined_year,
            formData.subjects
        ];

        // E5 specific required fields
        if (isE5) {
            requiredFields.push(formData.genderCode);
            requiredFields.push(formData.disciplineCode);
        }

        const isComplete = requiredFields.every(field => field !== undefined && field !== null && field.toString().trim() !== '');

        // If already 'Completed' (from submission), don't downgrade it unless it's genuinely incomplete
        // Otherwise, mark as 'Updated' if all required fields are present.
        let newStatus = formData.status;

        if (!isComplete) {
            newStatus = 'Not Updated';
        } else if (formData.status !== 'Completed' && formData.status !== 'Submitted') {
            newStatus = 'Updated';
        }

        if (formData.status !== newStatus) {
            setFormData(prev => ({ ...prev, status: newStatus || 'Not Updated' }));
        }
    }, [
        formData.name,
        formData.fullTimeCode,
        formData.genderCode,
        formData.disciplineCode,
        formData.degree,
        formData.bachelorsCode,
        formData.mastersCode,
        formData.doctorateCode,
        formData.licenseCode,
        formData.tenureCode,
        formData.rankCode,
        formData.loadCode,
        formData.salaryCode,
        formData.subjects,
        formData.joined_year,
        faculty.id
    ]);

    const handleSave = () => {
        const missingFields: string[] = [];
        
        Object.entries(E5_FIELD_LABELS).forEach(([key, label]) => {
            // Skill check: Gender and Discipline only for E5 form type
            if (!isE5 && (key === 'genderCode' || key === 'disciplineCode')) return;
            
            const value = (formData as any)[key];
            if (value === undefined || value === null || value.toString().trim() === '') {
                missingFields.push(label);
            }
        });

        if (missingFields.length > 0) {
            alert(`Missing Details:\n\n• ${missingFields.join('\n• ')}\n\nAll fields must be filled out before saving.`);
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
            rank: getDesc(referenceData?.facultyRank, formData.rankCode) || (faculty.form_type === 'E2' ? (faculty as any).rank : (faculty.form_type === 'E5' ? (faculty as any).rankCode : '')) || '',
            employment: getDesc(referenceData?.fullTimePartTime, formData.fullTimeCode) || (faculty.form_type === 'E2' ? (faculty as any).employment : '') || '',

            // Sync Degree Strings
            bachelors: getDisciplineDesc(formData.bachelorsCode) || (faculty as any).bachelors || '',
            masters: getDisciplineDesc(formData.mastersCode) || (faculty as any).masters || '',
            doctorate: getDisciplineDesc(formData.doctorateCode) || (faculty as any).doctorate || ''
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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-00 dark:text-gray-100">
                        FACULTY OR TEACHING STAFF IN HIGHER EDUCATION PROGRAMS
                    </h1>
                    <Button
                        onClick={handleSave}
                        disabled={processing}
                        className="bg-green-800 hover:bg-green-600 text-white"
                    >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <FacultyProfileCardsE5
                    formData={formData}
                    handleChange={handleChange}
                    referenceData={referenceData}
                    readOnly={false}
                />
            </div>
        </AppLayout>
    );
};

export default Edit;
