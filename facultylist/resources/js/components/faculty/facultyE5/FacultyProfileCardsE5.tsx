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

type FacultyProfileCardsProps = {
    formData: any;
    handleChange?: (field: string, value: any) => void;
    readOnly?: boolean;
    referenceData: any;
};

export const FacultyProfileCardsE5: FC<FacultyProfileCardsProps> = ({ formData, handleChange, readOnly = false, referenceData }) => {
    
    // Helper to get description for codes
    const getDesc = (list: { code: string, desc: string }[], code?: string) => {
        return list.find(item => item.code === code)?.desc || '';
    };

    // Helper to lookup code from value (handles case where value is description)
    const lookupCode = (list: { code: string, desc: string }[], value?: string) => {
        if (!value || !list) return '';
        // If value is a known code, return it
        if (list.some(item => item.code === value)) return value;
        // If value is a known description (loose match), return code
        const found = list.find(item => item.desc.trim().toLowerCase() === value.trim().toLowerCase());
        return found ? found.code : '';
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
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

            {/* Faculty Details Card */}
            <div className={cardClass}>
                
                <div className="flex flex-col gap-3">
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                        <Input 
                            value={formData.name || ''} 
                            onChange={(e) => onErrorSafeChange('name', e.target.value)}
                            className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none"
                            readOnly={readOnly}
                            disabled={readOnly}
                        />
                    </div>
                    

                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Full-Time/Part-Time </label>
                        <div className="flex gap-2">
                             <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.fullTimePartTime, formData.fullTimeCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.fullTimeCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('fullTimeCode', val)}
                            >
                                <SelectTrigger className="flex-1 h-auto whitespace-normal text-left disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none py-2">
                                    <span>
                                        {formData.fullTimeCode ? getDesc(referenceData.fullTimePartTime, formData.fullTimeCode) : <span className="text-muted-foreground">Select Status</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.fullTimePartTime.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code} className="whitespace-normal">
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Gender </label>
                        <div className="flex gap-2">
                            <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.gender, formData.genderCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.genderCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('genderCode', val)}
                            >
                                <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.genderCode ? getDesc(referenceData.gender, formData.genderCode) : <span className="text-muted-foreground">Select Gender</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.gender.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Primary Teaching Discipline</label>
                        <DisciplineSelector 
                            value={formData.disciplineCode}
                            onChange={(code, desc) => onErrorSafeChange('disciplineCode', code)}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
                            referenceData={referenceData}
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
                            <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.highestDegree, formData.degree)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.degree} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('degree', val)}
                            >
                                <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.degree ? getDesc(referenceData.highestDegree, formData.degree) : <span className="text-muted-foreground">Select Degree</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.highestDegree.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            referenceData={referenceData}
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
                            referenceData={referenceData}
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
                            referenceData={referenceData}
                        />
                    </div>
                </div>
            </div>

            {/* Employment & Teaching Details Card */}
            <div className={`${cardClass} lg:col-span-2 mt-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    {/* Row 1 */}
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Professional License</label>
                        <div className="flex gap-2">
                            <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.professionalLicense, formData.licenseCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.licenseCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('licenseCode', val)}
                            >
                                <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.licenseCode ? getDesc(referenceData.professionalLicense, formData.licenseCode) : <span className="text-muted-foreground">Select License</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.professionalLicense.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Row 2 */}
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Faculty Rank</label>
                        <div className="flex gap-2">
                            <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.facultyRank, formData.rankCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.rankCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('rankCode', val)}
                            >
                                <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.rankCode ? getDesc(referenceData.facultyRank, formData.rankCode) : <span className="text-muted-foreground">Select Rank</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.facultyRank.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Teaching Load</label>
                        <div className="flex gap-2">
                             <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.teachingLoad, formData.loadCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.loadCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('loadCode', val)}
                            >
                                <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.loadCode ? getDesc(referenceData.teachingLoad, formData.loadCode) : <span className="text-muted-foreground">Select Load</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.teachingLoad.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Annual Salary</label>
                        <div className="flex gap-2">
                            <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.annualSalary, formData.salaryCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.salaryCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('salaryCode', val)}
                            >
                                <SelectTrigger className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.salaryCode ? getDesc(referenceData.annualSalary, formData.salaryCode) : <span className="text-muted-foreground">Select Salary</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.annualSalary.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-3">
                        <label className="text-xs font-semibold text-gray-600">Tenure of Employment</label>
                        <div className="flex gap-2">
                            <Input 
                                readOnly 
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none" 
                                value={lookupCode(referenceData.tenure, formData.tenureCode)} 
                                placeholder="Code"
                            />

                            <Select 
                                value={formData.tenureCode} 
                                disabled={readOnly}
                                onValueChange={(val) => onErrorSafeChange('tenureCode', val)}
                            >
                                <SelectTrigger className="flex-2 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none">
                                    <span className="truncate">
                                        {formData.tenureCode ? getDesc(referenceData.tenure, formData.tenureCode) : <span className="text-muted-foreground">Select Tenure</span>}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {referenceData.tenure.map((item: any) => (
                                        <SelectItem key={item.code} value={item.code}>
                                            {item.desc}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-3">
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
