import { FC, useState } from 'react';
import { Faculty } from '@/types/faculty';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import ReferenceTableE5 from './ReferenceTableE5';
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
    onCancel?: () => void;
    onSave?: (data: any) => void;
};

const FormE5: FC<Props> = ({ faculty, onSave }) => {
    const [activeTab, setActiveTab] = useState('DataEntry');
    const [formData, setFormData] = useState({
        name: faculty?.name || '',
        fullTimeCode: faculty?.fullTimeCode || '',
        genderCode: faculty?.genderCode || '',
        disciplineCode: faculty?.disciplineCode || '',
        degree: faculty?.degree || '', // This maps to 'degree' code in state, but 'degree' string in Faculty type? Wait.
        // Faculty type has `degree: string` which was used for display (e.g. "PhD in Biology").
        // form uses `degree` for highestDegree code? 
        // Let's check: line 159: value={formData.degree} -> highestDegree list.
        // So I should map this carefully. 
        // In Faculty type, 'degree' might store the description or the code.
        // Given 'degree: string', let's assume it stores coverage of "Highest Degree Attained".
        // Use faculty.degree if it looks like a code (3 digits), otherwise safe to leave empty?
        // Or assume local state saves code into `degree` field of Faculty object.
        
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

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave?.({ 
            ...faculty, 
            ...formData,
            activeTab // Save the active sheet context if needed
        } as any); 
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
             {/* Header */}
             <div className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
                <h2 className="text-lg font-bold uppercase tracking-tight">FORM E5</h2>
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">

                            {/* Faculty Details Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Faculty Details</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                                        <Input 
                                            value={formData.name || ''} 
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="uppercase"
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Full-Time/Part-Time </label>
                                        <div className="flex gap-2">
                                            <Select value={formData.fullTimeCode} onValueChange={(val) => handleChange('fullTimeCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.fullTimeCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fullTimePartTime.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={fullTimePartTime.find(i => i.code === formData.fullTimeCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Gender </label>
                                        <div className="flex gap-2">
                                            <Select value={formData.genderCode} onValueChange={(val) => handleChange('genderCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.genderCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gender.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={gender.find(i => i.code === formData.genderCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Primary Teaching Discipline</label>
                                        <DisciplineSelector 
                                            value={formData.disciplineCode}
                                            onChange={(code, desc) => handleChange('disciplineCode', code)}
                                        />
                                    </div>
                            </div>
                        </div>

                        {/* Educational Credential Earned Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Educational Credential Earned</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Highest Degree Attained</label>
                                        <div className="flex gap-2">
                                            <Select value={formData.degree} onValueChange={(val) => handleChange('degree', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.degree || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {highestDegree.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={highestDegree.find(i => i.code === formData.degree)?.desc || ''} 
                                            />
                                        </div>
                                    </div>  
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Bachelors Degree</label>
                                        <DisciplineSelector 
                                            value={formData.bachelorsCode}
                                            onChange={(code, desc) => {
                                                handleChange('bachelorsCode', code);
                                                handleChange('bachelors', desc);
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Masters Degree</label>
                                        <DisciplineSelector 
                                            value={formData.mastersCode}
                                            onChange={(code, desc) => {
                                                handleChange('mastersCode', code);
                                                handleChange('masters', desc);
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-1 col-span-2">
                                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Doctorate Degree</label>
                                        <DisciplineSelector 
                                            value={formData.doctorateCode}
                                            onChange={(code, desc) => {
                                                handleChange('doctorateCode', code);
                                                handleChange('doctorate', desc);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Employment & Teaching Details Card */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 lg:col-span-2">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Employment & Teaching Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Professional License</label>
                                        <div className="flex gap-2">
                                            <Select value={formData.licenseCode} onValueChange={(val) => handleChange('licenseCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.licenseCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {professionalLicense.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={professionalLicense.find(i => i.code === formData.licenseCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Tenure of Employment</label>
                                        <div className="flex gap-2">
                                            <Select value={formData.tenureCode} onValueChange={(val) => handleChange('tenureCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.tenureCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tenure.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={tenure.find(i => i.code === formData.tenureCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Faculty Rank</label>
                                        <div className="flex gap-2">
                                            <Select value={formData.rankCode} onValueChange={(val) => handleChange('rankCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.rankCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {facultyRank.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={facultyRank.find(i => i.code === formData.rankCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Annual Salary</label>
                                        <div className="flex gap-2">
                                            <Select value={formData.salaryCode} onValueChange={(val) => handleChange('salaryCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.salaryCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {annualSalary.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={annualSalary.find(i => i.code === formData.salaryCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Teaching Load</label>
                                        <div className="flex gap-2">
                                            <Select value={formData.loadCode} onValueChange={(val) => handleChange('loadCode', val)}>
                                                <SelectTrigger className="w-24 shrink-0">
                                                    <span className="truncate flex-1 text-center">{formData.loadCode || "Code"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachingLoad.map((item) => (
                                                        <SelectItem key={item.code} value={item.code} textValue={item.code}>
                                                            {item.code} - {item.desc}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                readOnly 
                                                className="flex-1 bg-gray-50 text-gray-600" 
                                                value={teachingLoad.find(i => i.code === formData.loadCode)?.desc || ''} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1">
                                        <label className="text-xs font-semibold text-gray-600">Subjects Taught</label>
                                        <Input 
                                            value={formData.subjects}
                                            onChange={(e) => handleChange('subjects', e.target.value)}
                                            placeholder="Enumerate subjects..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-white p-4 border-t border-gray-200 flex justify-end shrink-0">
                <Button 
                    size="sm" 
                    className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-md font-semibold flex items-center gap-2 shadow-sm transition-all"
                    onClick={handleSave}
                >
                    <Save className="h-4 w-4" /> Update
                </Button>
            </div>
        </div>
    );
};

export default FormE5;
