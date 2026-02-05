import { FC } from 'react';
import {
    Dialog,
    DialogContent,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Faculty } from '@/types/faculty';
import { Edit, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import DisciplineSelector from './DisciplineSelector';

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: Faculty | null;
    onEdit?: (faculty: Faculty) => void;
};



// Reusable Component for Cards
type FacultyProfileCardsProps = {
    formData: any;
    handleChange?: (field: string, value: any) => void;
    readOnly?: boolean;
};

export const FacultyProfileCards: FC<FacultyProfileCardsProps> = ({ formData, handleChange, readOnly = false }) => {
    
    // Helper to get description for codes (embedded here or passed as prop, embedding for now as it was in both)
    const getDesc = (list: { code: string, desc: string }[], code?: string) => {
        return list.find(item => item.code === code)?.desc || '';
    };

    // Helper to handle change if not readOnly
    const onErrorSafeChange = (field: string, value: any) => {
        if (!readOnly && handleChange) {
            handleChange(field, value);
        }
    };

    const cardClass = readOnly 
        ? "space-y-3" 
        : "bg-white p-4 rounded-none border border-gray-200 shadow-sm space-y-3";

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">

            {/* Faculty Details Card */}
            <div className={cardClass}>
                <h3 className="font-bold text-gray-900 border-b pb-2">Faculty Details</h3>
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                        <Input 
                            value={formData.name || ''} 
                            onChange={(e) => onErrorSafeChange('name', e.target.value)}
                            className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white"
                            readOnly={readOnly}
                            disabled={readOnly} // Use disabled for consistent styling override if needed, or rely on readOnly
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Full-Time/Part-Time </label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.fullTimeCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('fullTimeCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fullTimePartTime.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(fullTimePartTime, formData.fullTimeCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Gender </label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.genderCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('genderCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gender.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(gender, formData.genderCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Primary Teaching Discipline</label>
                        <DisciplineSelector 
                            value={formData.disciplineCode}
                            onChange={(code, desc) => onErrorSafeChange('disciplineCode', code)}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Educational Credential Earned Card */}
            <div className={cardClass}>
                <h3 className="font-bold text-gray-900 border-b pb-2">Educational Credential Earned</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div className="grid gap-1 col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Highest Degree Attained</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.degree} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('degree', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {highestDegree.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(highestDegree, formData.degree)} 
                            />
                        </div>
                    </div>  
                    <div className="grid gap-1 col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Bachelors Degree</label>
                        <DisciplineSelector 
                            value={formData.bachelorsCode}
                            onChange={(code, desc) => {
                                onErrorSafeChange('bachelorsCode', code);
                                onErrorSafeChange('bachelors', desc);
                            }}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900"
                        />
                    </div>
                    <div className="grid gap-1 col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Masters Degree</label>
                        <DisciplineSelector 
                            value={formData.mastersCode}
                            onChange={(code, desc) => {
                                onErrorSafeChange('mastersCode', code);
                                onErrorSafeChange('masters', desc);
                            }}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900"
                        />
                    </div>
                    <div className="grid gap-1 col-span-2">
                        <label className="text-xs font-semibold text-gray-600">Specific Discipline of Doctorate Degree</label>
                        <DisciplineSelector 
                            value={formData.doctorateCode}
                            onChange={(code, desc) => {
                                onErrorSafeChange('doctorateCode', code);
                                onErrorSafeChange('doctorate', desc);
                            }}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Employment & Teaching Details Card */}
            <div className={`${cardClass} lg:col-span-2`}>
                <h3 className="font-bold text-gray-900 border-b pb-2">Employment & Teaching Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Professional License</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.licenseCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('licenseCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {professionalLicense.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(professionalLicense, formData.licenseCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Tenure of Employment</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.tenureCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('tenureCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tenure.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(tenure, formData.tenureCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Faculty Rank</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.rankCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('rankCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facultyRank.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(facultyRank, formData.rankCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Annual Salary</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.salaryCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('salaryCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {annualSalary.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(annualSalary, formData.salaryCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Teaching Load</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.loadCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('loadCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachingLoad.map((item) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.code} - {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input 
                                readOnly 
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0" 
                                value={getDesc(teachingLoad, formData.loadCode)} 
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Subjects Taught</label>
                        <Input 
                            value={formData.subjects || ''} 
                            onChange={(e) => onErrorSafeChange('subjects', e.target.value)}
                            readOnly={readOnly}
                            className={`focus-visible:ring-0 ${readOnly ? 'cursor-default disabled:opacity-100 disabled:bg-white text-gray-900' : ''}`}
                            placeholder={readOnly ? '' : 'Enumerate subjects...'}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewProfileModalE5: FC<Props> = ({ isOpen, onOpenChange, faculty, onEdit }) => {
    if (!faculty) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[95vw] w-[95vw] max-h-[95vh] flex flex-col p-0 gap-0 border-none outline-none bg-white [&>button]:hidden rounded-none overflow-hidden">
                
                {/* Custom Header with Edit Button */}
                <div className="bg-white text-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-200 shrink-0">
                    <h2 className="text-lg font-bold uppercase tracking-tight">FORM E5</h2>
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => onEdit(faculty)} 
                                className="h-8 gap-2 bg-white text-[#003468] border-[#003468] hover:bg-gray-100 mr-2"
                            >
                                <Edit className="h-4 w-4" /> Edit Profile
                            </Button>
                        )}
                        <DialogClose onClick={() => onOpenChange(false)} className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-none transition-colors">
                            <X className="h-5 w-5" />
                        </DialogClose>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-white">
                    <FacultyProfileCards formData={faculty} readOnly={true} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewProfileModalE5;

