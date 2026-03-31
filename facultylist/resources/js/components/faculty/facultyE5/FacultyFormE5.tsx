/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Save, X } from 'lucide-react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import type { PrivateFaculty } from '@/types/faculty';
import { FacultyProfileCardsE5 } from './FacultyProfileCardsE5';
import ReferenceTableE5 from './ReferenceTableE5';


type Props = {
    faculty?: PrivateFaculty;
    onCancel?: () => void;
    hideHeader?: boolean;
    referenceData: any;
    onChange?: (field: string, value: string) => void;
};

const FacultyFormE5: FC<Props> = ({ faculty, referenceData, hideHeader = false, onChange }) => {
    const [activeTab, setActiveTab] = useState('DataEntry');
    // ... (rest of state omitted for brevity, logic remains same)
    const [formData, setFormData] = useState({
        name: faculty?.name || '',
        fullTimeCode: faculty?.fullTimeCode || '',
        genderCode: faculty?.genderCode || '',
        disciplineCode: faculty?.disciplineCode || '',
        degree: faculty?.degree || '',
        bachelors: faculty?.bachelors || '',
        bachelorsCode: faculty?.bachelorsCode || '',
        masters: faculty?.masters || '',
        mastersCode: faculty?.mastersCode || '',
        doctorate: faculty?.doctorate || '',
        doctorateCode: faculty?.doctorateCode || '',
        licenseCode: faculty?.licenseCode || '',
        tenureCode: faculty?.tenureCode || '',
        rankCode: faculty?.rankCode || '',
        loadCode: faculty?.loadCode || '',
        subjects: faculty?.subjects || '',
        salaryCode: faculty?.salaryCode || '',
        joined_year: faculty?.joined_year || '',
        status: faculty?.status || ''
    });

    // Helper to normalize code/description values
    const normalizeCode = (list: { code: string, desc: string }[], value?: string) => {
        if (!value || !list) return value || '';

        // precise match for code
        if (list.some(item => item.code === value)) return value;

        // fallback: try to find by description (case-insensitive, trimmed)
        const found = list.find(item => item.desc.trim().toLowerCase() === value.trim().toLowerCase());

        return found ? found.code : value;
    };

    // Update form data when faculty prop changes
    useEffect(() => {
        if (faculty) {
             
            setFormData({
                name: faculty.name || '',
                fullTimeCode: normalizeCode(referenceData?.fullTimePartTime, faculty.fullTimeCode),
                genderCode: normalizeCode(referenceData?.gender, faculty.genderCode),
                disciplineCode: faculty.disciplineCode || '', // Discipline is distinct, keeping as is
                degree: normalizeCode(referenceData?.highestDegree, faculty.degree),
                bachelors: faculty.bachelors || '',
                bachelorsCode: faculty.bachelorsCode || '', // Discipline codes are complex, skipping simple normalization
                masters: faculty.masters || '',
                mastersCode: faculty.mastersCode || '',
                doctorate: faculty.doctorate || '',
                doctorateCode: faculty.doctorateCode || '',
                licenseCode: normalizeCode(referenceData?.professionalLicense, faculty.licenseCode),
                tenureCode: normalizeCode(referenceData?.tenure, faculty.tenureCode),
                rankCode: normalizeCode(referenceData?.facultyRank, faculty.rankCode),
                loadCode: normalizeCode(referenceData?.teachingLoad, faculty.loadCode),
                subjects: faculty.subjects || '',
                salaryCode: normalizeCode(referenceData?.annualSalary, faculty.salaryCode),
                joined_year: faculty.joined_year || '',
                status: faculty.status || ''
            });
        }
         
    }, [faculty, referenceData]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (onChange) {
            onChange(field, value);
        }
    };

    // Auto-calculate status based on form completion
    useEffect(() => {
        const requiredFields = [
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
            formData.joined_year
        ];

        // Check if all required fields are truthy and not empty strings
        const isComplete = requiredFields.every(field => field !== undefined && field !== null && field.toString().trim() !== '');
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
        formData.joined_year
    ]);

    const validateStatus = () => {
        // Status logic is already handled by useEffect, nothing to do here.
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            {!hideHeader && (
                <div className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
                    <h2 className="text-lg font-bold uppercase tracking-tight">Faculty Details</h2>
                    <div className="flex items-center gap-2">
                        <DialogClose className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-none transition-colors">
                            <X className="h-5 w-5" />
                        </DialogClose>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'Reference' ? (
                    <ReferenceTableE5 referenceData={referenceData} />
                ) : (
                    <div className="h-full overflow-auto p-2 bg-gray-50">
                        <FacultyProfileCardsE5
                            formData={formData}
                            handleChange={handleChange}
                            readOnly={false}
                            referenceData={referenceData}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            {!hideHeader && (
                <div className="bg-white p-4 border-t border-gray-200 flex justify-end shrink-0">
                    <div className="text-xs text-gray-400 italic">
                        Viewing/Editing Faculty Details
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyFormE5;
