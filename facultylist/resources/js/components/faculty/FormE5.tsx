import { FC, useState, useEffect } from 'react';
import { Faculty } from '@/types/faculty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import ReferenceTableE5 from './ReferenceTableE5';
import { FacultyProfileCards } from './FacultyProfileCards';
import DisciplineSelector from './DisciplineSelector';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    fullTimePartTime, 
    gender, 
    highestDegree, 
    professionalLicense, 
    tenure, 
    facultyRank, 
    teachingLoad, 
    annualSalary 
} from '@/constants/facultyDataE5';

type Props = {
    faculty?: Faculty;
    onSave?: (data: any) => void;
    onCancel?: () => void;
};

const FormE5: FC<Props> = ({ faculty, onSave }) => {
    const [activeTab, setActiveTab] = useState('DataEntry');
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
        // Check if all required fields are filled
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

        const isComplete = requiredFields.every(field => field && field.trim() !== '');

        // If complete, update to 'Completed'. 
        // If not complete, revert/set to 'Not Yet Completed' to reflect "Not Updated" state.
        const newStatus = isComplete ? 'Completed' : 'Not Yet Completed';

        onSave?.({ 
            ...faculty, 
            ...formData,
            status: newStatus,
            activeTab // Save the active sheet context if needed
        } as any); 
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
                <h2 className="text-lg font-bold uppercase tracking-tight">Faculty Details</h2>
                <div className="flex items-center gap-2">
                    <DialogClose className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </div>
            </div>



            <div className="flex-1 overflow-hidden relative">
                 {activeTab === 'Reference' ? (
                    <ReferenceTableE5 />
                ) : (
                    <div className="h-full overflow-auto p-4 bg-gray-50">
                        <FacultyProfileCards 
                            formData={formData} 
                            handleChange={handleChange} 
                            readOnly={false}
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

export default FormE5;
