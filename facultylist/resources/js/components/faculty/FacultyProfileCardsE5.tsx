import { FC } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DisciplineSelector from './DisciplineSelector';
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

type FacultyProfileCardsProps = {
    formData: any;
    handleChange?: (field: string, value: any) => void;
    readOnly?: boolean;
};

export const FacultyProfileCardsE5: FC<FacultyProfileCardsProps> = ({ formData, handleChange, readOnly = false }) => {
    
    // Helper to get description for codes
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
        : "bg-white p-4 border border-gray-200 shadow-sm space-y-3";

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">

            {/* Faculty Details Card */}
            <div className={cardClass}>
                
                <div className="flex flex-col gap-3">
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                        <Input 
                            value={formData.name || ''} 
                            onChange={(e) => onErrorSafeChange('name', e.target.value)}
                            className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none"
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
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
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
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
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
                        />
                    </div>
                </div>
            </div>

            {/* Employment & Teaching Details Card */}
            <div className={`${cardClass} lg:col-span-2`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold text-gray-600">Professional License</label>
                        <div className="flex gap-2">
                            <Select 
                                value={formData.licenseCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('licenseCode', val)}
                            >
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                                <SelectTrigger className="w-24 shrink-0 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
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
                                className="flex-1 bg-gray-50 text-gray-600 cursor-default focus-visible:ring-0 rounded-none" 
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
                            className={`focus-visible:ring-0 ${readOnly ? 'cursor-default disabled:opacity-100 disabled:bg-white text-gray-900' : ''} rounded-none`}
                            placeholder={readOnly ? '' : 'Enumerate subjects...'}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
