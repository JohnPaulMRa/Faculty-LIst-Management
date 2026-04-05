/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, GraduationCap, Briefcase } from 'lucide-react';
import React, { type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from "@/components/ui/combobox";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    FT_PT_OPTIONS,
    GENDER_OPTIONS,
    HIGHEST_DEGREE_OPTIONS,
    PROFESSIONAL_LICENSE_OPTIONS,
    TENURE_OPTIONS,
    FACULTY_RANK_OPTIONS,
    TEACHING_LOAD_OPTIONS,
    ANNUAL_SALARY_OPTIONS
} from '@/types/faculty/referenceDataE5';
import DisciplineSelector from '../DisciplineSelector';

type FacultyProfileCardsProps = {

    formData: any;

    handleChange?: (field: string, value: any) => void;
    readOnly?: boolean;

    referenceData: any;
};

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    variant?: 'default' | 'white';
}

// Section Header Component for consistent styling
const SectionHeader: FC<SectionHeaderProps> = ({ icon, title, variant = 'default' }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className={cn(
                "p-2.5 rounded-xl shadow-sm transition-transform duration-200 hover:scale-105",
                variant === 'white'
                    ? "bg-white text-[#003468]"
                    : "bg-linear-to-br from-[#003468] to-[#1a4f8c] text-white"
            )}>
                {React.cloneElement(icon as React.ReactElement<any>, { className: 'h-5 w-5' })}
            </div>
            <div>
                <h3 className={cn(
                    "font-bold uppercase tracking-wider",
                    variant === 'white' ? "text-white text-lg" : "text-[#003468] text-base"
                )}>
                    {title}
                </h3>
            </div>
        </div>
    </div>
);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Faculty Details Card */}
            <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
                <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                    <SectionHeader
                        icon={<User />}
                        title="Personal & Institutional Information"
                        variant="white"
                    />
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <label className="text-base font-semibold text-gray-600">Faculty Name (LN, FN, MI)</label>
                            <Input
                                value={formData.name || ''}
                                onChange={(e) => onErrorSafeChange('name', e.target.value)}
                                className="uppercase focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-md border border-input h-12 px-3 text-[12px]"
                                readOnly={readOnly}
                                disabled={readOnly}
                            />
                        </div>


                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Full-Time/Part-Time </label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white border border-input rounded-md h-12 px-3 text-sm flex items-center"
                                    value={formData.fullTimeCode || ''}
                                    onChange={(e) => onErrorSafeChange('fullTimeCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(FT_PT_OPTIONS)}
                                    value={formData.fullTimeCode}
                                    onChange={(val) => onErrorSafeChange('fullTimeCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select Status"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 text-[12px]"
                                />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Gender </label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white border border-input rounded-md h-12 px-3 text-sm flex items-center"
                                    value={formData.genderCode || ''}
                                    onChange={(e) => onErrorSafeChange('genderCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(GENDER_OPTIONS)}
                                    value={formData.genderCode}
                                    onChange={(val) => onErrorSafeChange('genderCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select Gender"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Primary Teaching Discipline</label>
                            <DisciplineSelector
                                value={formData.disciplineCode}
                                onChange={(code, desc) => {
                                    onErrorSafeChange('disciplineCode', code);
                                    onErrorSafeChange('discipline', desc);
                                }}
                                referenceData={referenceData}
                                placeholder="Select Primary Discipline"
                                showGroup={false}
                                filterCategory="primary"
                            />
                        </div>


                    </div>
                </CardContent>
            </Card>

            {/* Educational Credential Earned Card */}
            <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
                <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                    <SectionHeader
                        icon={<GraduationCap />}
                        title="Educational Credential Earned"
                        variant="white"
                    />
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8.5">
                        <div className="grid gap-1 col-span-2">
                            <label className="text-base font-bold text-gray-600">Highest Degree Attained</label>
                            <div className="flex gap-3">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white border border-input rounded-md h-12 px-3 text-[12px] flex items-center"
                                    value={formData.degree || ''}
                                    onChange={(e) => onErrorSafeChange('degree', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(HIGHEST_DEGREE_OPTIONS)}
                                    value={formData.degree}
                                    onChange={(val) => onErrorSafeChange('degree', val)}
                                    disabled={readOnly}
                                    placeholder="Select Degree"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="grid gap-1 col-span-2">
                            <label className="text-base font-bold text-gray-600">Specific Discipline of Bachelors Degree</label>
                            <DisciplineSelector
                                value={formData.bachelorsCode}
                                onChange={(code, desc) => {
                                    onErrorSafeChange('bachelorsCode', code);
                                    onErrorSafeChange('bachelors', desc);
                                }}
                                referenceData={referenceData}
                                placeholder="Select Bachelors Discipline"
                                showGroup={false}
                                filterCategory="bachelors"
                            />
                        </div>
                        <div className="grid gap-1 col-span-2">
                            <label className="text-base font-bold text-gray-600">Specific Discipline of Masters Degree</label>
                            <DisciplineSelector
                                value={formData.mastersCode}
                                onChange={(code, desc) => {
                                    onErrorSafeChange('mastersCode', code);
                                    onErrorSafeChange('masters', desc);
                                }}
                                referenceData={referenceData}
                                placeholder="Select Masters Discipline"
                                showGroup={false}
                                filterCategory="masters"
                            />
                        </div>
                        <div className="grid gap-1 col-span-2">
                            <label className="text-base font-bold text-gray-600">Specific Discipline of Doctorate Degree</label>
                            <DisciplineSelector
                                value={formData.doctorateCode}
                                onChange={(code, desc) => {
                                    onErrorSafeChange('doctorateCode', code);
                                    onErrorSafeChange('doctorate', desc);
                                }}
                                referenceData={referenceData}
                                placeholder="Select Doctorate Discipline"
                                showGroup={false}
                                filterCategory="doctorate"
                            />
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* Employment & Teaching Details Card */}
            <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white lg:col-span-2 mt-4">
                <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                    <SectionHeader
                        icon={<Briefcase />}
                        title="Employment & Teaching Details"
                        variant="white"
                    />
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Row 1 */}
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Professional License</label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white border border-input rounded-md h-12 px-3 text-[12px] flex items-center"
                                    value={formData.licenseCode || ''}
                                    onChange={(e) => onErrorSafeChange('licenseCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(PROFESSIONAL_LICENSE_OPTIONS)}
                                    value={formData.licenseCode}
                                    onChange={(val) => onErrorSafeChange('licenseCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select License"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900"
                                />
                            </div>
                        </div>
                        {/* Row 2 */}
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Faculty Rank</label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white border border-input rounded-md h-12 px-3 text-[12px] flex items-center"
                                    value={formData.rankCode || ''}
                                    onChange={(e) => onErrorSafeChange('rankCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(FACULTY_RANK_OPTIONS)}
                                    value={formData.rankCode}
                                    onChange={(val) => onErrorSafeChange('rankCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select Rank"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Teaching Load</label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-md h-12 text-[12px]"
                                    value={formData.loadCode || ''}
                                    onChange={(e) => onErrorSafeChange('loadCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(TEACHING_LOAD_OPTIONS)}
                                    value={formData.loadCode}
                                    onChange={(val) => onErrorSafeChange('loadCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select Load"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-md h-12"
                                />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Annual Salary</label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-md h-12 text-[12px]"
                                    value={formData.salaryCode || ''}
                                    onChange={(e) => onErrorSafeChange('salaryCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(ANNUAL_SALARY_OPTIONS)}
                                    value={formData.salaryCode}
                                    onChange={(val) => onErrorSafeChange('salaryCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select Salary"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white text-sm disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-md h-12"
                                />
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Tenure of Employment</label>
                            <div className="flex gap-2">
                                <Input
                                    className="w-32 shrink-0 bg-gray-50 text-center font-bold focus-visible:ring-0 disabled:opacity-100 disabled:bg-white rounded-md h-12 text-[12px]"
                                    value={formData.tenureCode || ''}
                                    onChange={(e) => onErrorSafeChange('tenureCode', e.target.value)}
                                    placeholder="Code"
                                    disabled={readOnly}
                                />

                                <Combobox
                                    options={mapToOptions(TENURE_OPTIONS)}
                                    value={formData.tenureCode}
                                    onChange={(val) => onErrorSafeChange('tenureCode', val)}
                                    disabled={readOnly}
                                    placeholder="Select Tenure"
                                    className="flex-1 disabled:opacity-100 disabled:bg-white disabled:cursor-default disabled:border-gray-200 text-gray-900 rounded-md h-12"
                                />
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <label className="text-base font-bold text-gray-600">Subjects Taught</label>
                            <Input
                                value={formData.subjects || ''}
                                onChange={(e) => onErrorSafeChange('subjects', e.target.value)}
                                readOnly={readOnly}
                                className={`focus-visible:ring-0 ${readOnly ? 'cursor-default disabled:opacity-100 disabled:bg-white text-gray-900' : ''} rounded-md h-12 px-3 text-[15px]`}
                                placeholder={readOnly ? '' : 'Enumerate subjects...'}
                                disabled={readOnly}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

