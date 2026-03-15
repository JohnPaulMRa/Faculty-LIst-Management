import type { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Combobox } from "@/components/ui/combobox";
import DisciplineSelector from './DisciplineSelector';

type FacultyProfileCardsProps = {
    formData: any;
    handleChange?: (field: string, value: any) => void;
    readOnly?: boolean;
    referenceData: any;
};

export const FacultyProfileCardsE5: FC<FacultyProfileCardsProps> = ({ formData, handleChange, readOnly = false, referenceData }) => {

    // Helper to handle change if not readOnly
    const onErrorSafeChange = (field: string, value: any) => {
        if (!readOnly && handleChange) {
            handleChange(field, value);
        }
    };

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

    // Reusable formatter for reference lists
    const mapToOptions = (list: { code: string, desc: string }[]) => {
        return (list || [])
            .filter(item => item && item.desc && item.desc.trim() !== "")
            .map(item => ({ label: item.desc, value: item.code }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

            {/* Faculty Details Card */}
            <div className="bg-white p-5 space-y-3 border">

                <div className="flex flex-col gap-4">
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                        <Input
                            value={formData.name || ''}
                            onChange={(e) => onErrorSafeChange('name', e.target.value)}
                            className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none min-h-[40px]"
                            readOnly={readOnly}
                            disabled={readOnly}
                        />
                    </div>


                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Full-Time/Part-Time </label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.fullTimePartTime, formData.fullTimeCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.fullTimePartTime)}
                                value={formData.fullTimeCode}
                                onChange={(val) => onErrorSafeChange('fullTimeCode', val)}
                                disabled={readOnly}
                                placeholder="Select Status"
                                searchPlaceholder="Search status..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Gender </label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.gender, formData.genderCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.gender)}
                                value={formData.genderCode}
                                onChange={(val) => onErrorSafeChange('genderCode', val)}
                                disabled={readOnly}
                                placeholder="Select Gender"
                                searchPlaceholder="Search gender..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Primary Teaching Discipline</label>
                        <DisciplineSelector
                            value={formData.disciplineCode}
                            onChange={(code, desc) => onErrorSafeChange('disciplineCode', code)}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
                            referenceData={referenceData}
                            showGroup={false}
                        />
                    </div>

                </div>
            </div>

            {/* Educational Credential Earned Card */}
            <div className="bg-white p-5 space-y-3 border">
                <h3 className="font-bold text-gray-900 border-b pb-2">Educational Credential Earned</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    <div className="grid gap-1 col-span-2">
                        <label className="text-sm font-semibold text-gray-600">Highest Degree Attained</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.highestDegree, formData.degree)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.highestDegree)}
                                value={formData.degree}
                                onChange={(val) => onErrorSafeChange('degree', val)}
                                disabled={readOnly}
                                placeholder="Select Degree"
                                searchPlaceholder="Search degree..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>
                    <div className="grid gap-1 col-span-2">
                        <label className="text-sm font-semibold text-gray-600">Specific Discipline of Bachelors Degree</label>
                        <DisciplineSelector
                            value={formData.bachelorsCode}
                            onChange={(code, desc) => {
                                onErrorSafeChange('bachelorsCode', code);
                                onErrorSafeChange('bachelors', desc);
                            }}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
                            referenceData={referenceData}
                            showGroup={false}
                        />
                    </div>
                    <div className="grid gap-1 col-span-2">
                        <label className="text-sm font-semibold text-gray-600">Specific Discipline of Masters Degree</label>
                        <DisciplineSelector
                            value={formData.mastersCode}
                            onChange={(code, desc) => {
                                onErrorSafeChange('mastersCode', code);
                                onErrorSafeChange('masters', desc);
                            }}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
                            referenceData={referenceData}
                            showGroup={false}
                        />
                    </div>
                    <div className="grid gap-1 col-span-2">
                        <label className="text-sm font-semibold text-gray-600">Specific Discipline of Doctorate Degree</label>
                        <DisciplineSelector
                            value={formData.doctorateCode}
                            onChange={(code, desc) => {
                                onErrorSafeChange('doctorateCode', code);
                                onErrorSafeChange('doctorate', desc);
                            }}
                            disabled={readOnly}
                            className="opacity-100 disabled:opacity-100 disabled:bg-white text-gray-900 rounded-none"
                            referenceData={referenceData}
                            showGroup={false}
                        />
                    </div>

                </div>

            </div>

            {/* Employment & Teaching Details Card */}
            <div className={`bg-white p-5 space-y-3 lg:col-span-2 mt-2 border`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {/* Row 1 */}
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Professional License</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.professionalLicense, formData.licenseCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.professionalLicense)}
                                value={formData.licenseCode}
                                onChange={(val) => onErrorSafeChange('licenseCode', val)}
                                disabled={readOnly}
                                placeholder="Select License"
                                searchPlaceholder="Search license..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>
                    {/* Row 2 */}
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Faculty Rank</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.facultyRank, formData.rankCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.facultyRank)}
                                value={formData.rankCode}
                                onChange={(val) => onErrorSafeChange('rankCode', val)}
                                disabled={readOnly}
                                placeholder="Select Rank"
                                searchPlaceholder="Search rank..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Teaching Load</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.teachingLoad, formData.loadCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.teachingLoad)}
                                value={formData.loadCode}
                                onChange={(val) => onErrorSafeChange('loadCode', val)}
                                disabled={readOnly}
                                placeholder="Select Load"
                                searchPlaceholder="Search load..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Annual Salary</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.annualSalary, formData.salaryCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.annualSalary)}
                                value={formData.salaryCode}
                                onChange={(val) => onErrorSafeChange('salaryCode', val)}
                                disabled={readOnly}
                                placeholder="Select Salary"
                                searchPlaceholder="Search salary..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Tenure of Employment</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                className="w-24 shrink-0 bg-gray-50 text-center font-mono focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-none h-auto"
                                value={lookupCode(referenceData.tenure, formData.tenureCode)}
                                placeholder="Code"
                            />

                            <Combobox
                                options={mapToOptions(referenceData.tenure)}
                                value={formData.tenureCode}
                                onChange={(val) => onErrorSafeChange('tenureCode', val)}
                                disabled={readOnly}
                                placeholder="Select Tenure"
                                searchPlaceholder="Search tenure..."
                                className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-none h-auto min-h-[40px] whitespace-normal text-left"
                            />
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <label className="text-sm font-semibold text-gray-600">Subjects Taught</label>
                        <Input
                            value={formData.subjects || ''}
                            onChange={(e) => onErrorSafeChange('subjects', e.target.value)}
                            readOnly={readOnly}
                            className={`focus-visible:ring-0 ${readOnly ? 'cursor-default disabled:opacity-100 disabled:bg-white text-gray-900' : ''} rounded-none min-h-[40px]`}
                            placeholder={readOnly ? '' : 'Enumerate subjects...'}
                            disabled={readOnly}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

