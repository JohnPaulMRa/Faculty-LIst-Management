import { FC, useState, useEffect } from 'react';
import { Faculty } from '@/types/faculty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import ReferenceTableE5 from './ReferenceTableE5';
import { FacultyProfileCardsE5 } from './FacultyProfileCardsE5';
import DisciplineSelector from './DisciplineSelector';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


type Props = {
    faculty?: Faculty;
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
        salaryCode: faculty?.salaryCode || ''
    });

    // Update form data when faculty prop changes
    useEffect(() => {
        if (faculty) {
            setFormData({
                name: faculty.name || '',
                fullTimeCode: faculty.fullTimeCode || '',
                genderCode: faculty.genderCode || '',
                disciplineCode: faculty.disciplineCode || '',
                degree: faculty.degree || '',
                bachelors: faculty.bachelors || '',
                bachelorsCode: faculty.bachelorsCode || '',
                masters: faculty.masters || '',
                mastersCode: faculty.mastersCode || '',
                doctorate: faculty.doctorate || '',
                doctorateCode: faculty.doctorateCode || '',
                licenseCode: faculty.licenseCode || '',
                tenureCode: faculty.tenureCode || '',
                rankCode: faculty.rankCode || '',
                loadCode: faculty.loadCode || '',
                subjects: faculty.subjects || '',
                salaryCode: faculty.salaryCode || ''
            });
        }
    }, [faculty]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
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

        // Automatically set status based on completeness
        const newStatus = isComplete ? 'Updated' : 'Not Updated';

        onSave?.({ 
            ...faculty, 
            ...formData,
            status: newStatus,
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
                    <div className="h-full overflow-auto p-4 bg-gray-50">
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
                    className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-none font-semibold flex items-center gap-2 shadow-sm transition-all"
                    onClick={handleSave}
                >
                    <Save className="h-4 w-4" /> Update
                </Button>
            </div>
        </div>
    );
};

export default FacultyFormE5;
