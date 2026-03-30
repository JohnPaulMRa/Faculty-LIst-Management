import { Save, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { PrivateFaculty } from '@/types/faculty';
import DisciplineSelector from '../DisciplineSelector';
import { FacultyProfileCardsE5 } from './FacultyProfileCardsE5';
import ReferenceTableE5 from './ReferenceTableE5';


type Props = {
    faculty?: PrivateFaculty;
    onSave?: (data: any) => void;
    onCancel?: () => void;
    referenceData: any;
};

const FacultyFormE5: FC<Props> = ({ faculty, onSave, referenceData }) => {
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
    };

    // Auto-calculate status based on form completion
    useEffect(() => {
        const requiredFields = [
            formData.name,
            formData.fullTimeCode,
            formData.genderCode,
            formData.disciplineCode,
            formData.degree,
            formData.licenseCode,
            formData.tenureCode,
            formData.rankCode,
            formData.loadCode,
            formData.salaryCode,
            formData.subjects
        ];

        // Check if all required fields are truthy and not empty strings
        const isComplete = requiredFields.every(field => field && field.trim() !== '');
        const newStatus = isComplete ? 'Updated' : 'Not Updated';

        if (formData.status !== newStatus) {
            setFormData(prev => ({ ...prev, status: newStatus }));
        }
    }, [
        formData.name,
        formData.fullTimeCode,
        formData.genderCode,
        formData.disciplineCode,
        formData.degree,
        formData.licenseCode,
        formData.tenureCode,
        formData.rankCode,
        formData.loadCode,
        formData.salaryCode,
        formData.subjects
    ]);

    const handleSave = () => {
        // If status is manually set (and valid), use it.
        // Otherwise, fallback to auto-calculation logic (or keep as is if we want strict manual control now)
        // Let's defer to user selection if present.

        let finalStatus = formData.status;

        // If no status is selected/set, we can try to auto-calculate or default to "Not Updated"
        if (!finalStatus) {
            // Required fields based on "Form E5" completeness
            const requiredFields = [
                formData.name,
                formData.fullTimeCode,
                formData.genderCode,
                formData.disciplineCode, // Primary Discipline
                // formData.degree, // Not strictly a code, but maybe required
                formData.licenseCode,
                formData.tenureCode,
                formData.rankCode,
                formData.loadCode,
                formData.salaryCode,
                formData.subjects
            ];

            // Check if all required fields are truthy and not empty strings
            const isComplete = requiredFields.every(field => field && field.trim() !== '');
            finalStatus = isComplete ? 'Updated' : 'Not Updated';
        }

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
            rank: getDesc(referenceData?.facultyRank, formData.rankCode) || faculty?.rankCode || '',
            employment: getDesc(referenceData?.fullTimePartTime, formData.fullTimeCode) || (faculty?.form_type === 'E5' ? (faculty as any).employment : '') || '',

            // Sync Degree Strings
            bachelors: getDisciplineDesc(formData.bachelorsCode) || faculty?.bachelors || '',
            masters: getDisciplineDesc(formData.mastersCode) || faculty?.masters || '',
            doctorate: getDisciplineDesc(formData.doctorateCode) || faculty?.doctorate || ''
        };

        onSave?.({
            ...faculty,
            ...syncedData,
            status: finalStatus,
            activeTab
        } as any);
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
                <h2 className="text-lg font-bold uppercase tracking-tight">Faculty Details</h2>
                <div className="flex items-center gap-2">
                    <DialogClose className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-none transition-colors">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </div>
            </div>

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
            <div className="bg-white p-4 border-t border-gray-200 flex justify-end shrink-0">
                <Button
                    size="sm"
                    className="bg-[#003468] hover:bg-[#002a54] text-white h-9 px-6 border-0 rounded-none font-semibold flex items-center gap-2 shadow-sm transition-all"
                    onClick={handleSave}
                >
                    <Save className="h-4 w-4" /> Update
                </Button>
            </div>
        </div>
    );
};

export default FacultyFormE5;
