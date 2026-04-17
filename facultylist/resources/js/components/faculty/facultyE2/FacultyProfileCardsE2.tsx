/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    User,
    GraduationCap,
    Clock,
    Award,
    ChevronRight
} from 'lucide-react';
import React from 'react';
import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { PublicFaculty } from '@/types/faculty';
import {
    GENERIC_RANK_OPTIONS,
    TENURE_OPTIONS,
    SALARY_GRADE_OPTIONS,
    ANNUAL_SALARY_OPTIONS,
    ON_LEAVE_PAY_OPTIONS,
    FTE_OPTIONS,
    GENDER_OPTIONS,
    HIGHEST_DEGREE_OPTIONS,
    PURSUING_DEGREE_OPTIONS,
    THESIS_OPTIONS,
    DISSERTATION_OPTIONS
} from '@/types/faculty/referenceDataE2';
import DisciplineSelector from '../DisciplineSelector';

// --- TYPES / INTERFACES ---

interface FacultyProfileCardsE2Props {
    formData: Partial<PublicFaculty>;
    handleChange?: (field: keyof PublicFaculty, value: any) => void;
    readOnly?: boolean;
    referenceData?: any;
}

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    badge?: string;
    variant?: 'default' | 'white';
}

interface FormFieldProps {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    className?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    readOnly?: boolean;
    showCodePrefix?: boolean;
}

interface FormComboboxProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string | number }[];
    placeholder?: string;
    required?: boolean;
    error?: string;
    showCodePrefix?: boolean;
}

interface WorkloadGridProps {
    title: string;
    items: Array<{
        label: string;
        value: string;
        onChange?: (value: string) => void;
        highlighted?: boolean;
        hint?: string;
        readOnly?: boolean;
        showCodePrefix?: boolean;
    }>;
}

// --- SUB-COMPONENTS ---

const SectionHeader: FC<SectionHeaderProps> = ({
    icon,
    title,
    badge,
    variant = 'default'
}) => {
    const isWhite = variant === 'white';

    const iconWrapperClass = cn(
        "p-2.5 rounded-xl shadow-sm transition-transform duration-200 hover:scale-105",
        isWhite ? "bg-white text-[#003468]" : "bg-linear-to-br from-[#003468] to-[#1a4f8c] text-white"
    );

    const titleClass = cn(
        "font-bold text-lg tracking-tight",
        isWhite ? "text-white" : "text-[#003468]"
    );

    const badgeTextClass = cn(
        "text-xs",
        isWhite ? "text-blue-100" : "text-gray-500"
    );

    const badgeVariantClass = cn(
        "text-xs border-0",
        isWhite ? "bg-white/20 text-white backdrop-blur-md" : "bg-gray-50 text-gray-600"
    );

    const iconElement = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { className: 'h-5 w-5' })
        : icon;

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={iconWrapperClass}>
                    {iconElement}
                </div>
                <div>
                    <h3 className={titleClass}>{title}</h3>
                    {badge && <p className={badgeTextClass}>{badge}</p>}
                </div>
            </div>
            {badge && (
                <Badge
                    variant="outline"
                    className={badgeVariantClass}
                >
                    {badge}
                </Badge>
            )}
        </div>
    );
};

const FormField: FC<FormFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    className = '',
    required,
    hint,
    error,
    readOnly,
    showCodePrefix = false
}) => {
    const containerClass = cn(
        "flex flex-1 items-center rounded-md border border-gray-300 bg-white transition-all duration-200 overflow-hidden h-12",
        readOnly ? "bg-gray-50/50 border-gray-200" : "focus-within:border-[#003468] focus-within:ring-1 focus-within:ring-[#003468]/20 hover:border-gray-400",
        error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20" : ""
    );

    const inputClass = cn(
        "border-0 focus-visible:ring-0 shadow-none h-full flex-1 px-3 text-lg",
        readOnly && "cursor-not-allowed text-gray-500",
        className
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e.target.value);
    };

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-base font-bold text-gray-600 uppercase tracking-wider">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {hint && <span className="text-[12px] text-gray-400 italic">{hint}</span>}
            </div>
            <div className="flex items-center gap-2">
                {showCodePrefix && (
                    <div className="shrink-0 h-12 w-32 bg-gray-50 border border-input flex items-center justify-center text-lg font-bold text-gray-700 uppercase rounded-md px-3 text-center">
                        CODE
                    </div>
                )}
                <div className={containerClass}>
                    <Input
                        type={type}
                        value={value || ''}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        className={inputClass}
                    />
                </div>
            </div>
            {error && <p className="text-lg text-red-500 mt-1">{error}</p>}
        </div>
    );
};

const FormCombobox: FC<FormComboboxProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    required,
    error,
    showCodePrefix = true
}) => {
    const comboboxClass = cn(
        'border-gray-300 hover:border-gray-400 focus-within:border-[#003468] focus-within:ring-1 focus-within:ring-[#003468]/20 rounded-md shadow-none h-12',
        error ? 'border-red-500 focus-within:ring-red-500/20 focus-within:border-red-500' : ''
    );

    return (
        <div className="space-y-1.5">
            <label className="text-base font-bold text-gray-600 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
                {showCodePrefix && (
                    <Input
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="shrink-0 h-12 w-32 bg-gray-50 border border-input flex items-center justify-center text-[12px] font-bold text-gray-700 uppercase rounded-md px-3 text-center focus-visible:ring-0"
                        placeholder="Code"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <Combobox
                        value={value}
                        onChange={onChange}
                        options={options}
                        placeholder={placeholder}
                        showCodePrefix={false}
                        className={comboboxClass}
                    />
                </div>
            </div>
            {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
        </div>
    );
};

const WorkloadGrid: FC<WorkloadGridProps> = ({
    title,
    items
}) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-[#003468]" />
            <span className="text-sm font-bold text-[#003468] uppercase tracking-wider">{title}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, index) => {
                const containerClass = cn(
                    "flex flex-1 items-center rounded-md border overflow-hidden h-12",
                    item.highlighted ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-300 hover:border-gray-400'
                );

                const inputClass = cn(
                    "border-0 focus-visible:ring-0 shadow-none h-full w-full flex-1 text-center px-3 text-lg",
                    item.highlighted ? 'font-bold text-[#003468] bg-transparent' : 'bg-transparent'
                );

                const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (item.onChange) item.onChange(e.target.value);
                };

                return (
                    <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-base font-bold text-gray-600 uppercase leading-tight">
                                {item.label}
                            </label>
                            {item.hint && <span className="text-[10px] text-gray-400 font-medium">{item.hint}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            {item.showCodePrefix && (
                                <div className="shrink-0 h-12 w-32 bg-gray-50 border border-input flex items-center justify-center text-[12px] font-bold text-gray-700 uppercase rounded-md px-3 text-center">
                                    CODE
                                </div>
                            )}
                            <div className={containerClass}>
                                <Input
                                    value={item.value || ''}
                                    onChange={handleItemChange}
                                    readOnly={item.readOnly}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const FacultyProfileCardsE2: FC<FacultyProfileCardsE2Props> = ({
    formData,
    handleChange,
    readOnly = false,
    referenceData
}) => {
    // --- HELPERS (MATCH E5) ---

    // Helper to handle change if not readOnly
    const onErrorSafeChange = (field: keyof PublicFaculty, value: any) => {
        if (!readOnly && handleChange) {
            handleChange(field, value);
        }
    };

    // Reusable formatter for reference lists
    const mapToOptions = (list: { code: string, desc: string }[]) => {
        return (list || [])
            .filter(item => item && item.desc && item.desc.trim() !== "")
            .map(item => ({ label: item.desc, value: item.code }));
    };

    // --- JSX COMPONENTS ---

    const generalInfoCard = (
        <Card className="border border-gray-200 shadow-md overflow-hidden rounded-4px bg-white">
            <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                <SectionHeader
                    icon={<User />}
                    title="General Information"
                    variant="white"
                />
            </CardHeader>
            <CardContent className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FormField
                        label="NAME OF FACULTY ( Last name, first name, middle initial)"
                        value={formData.name || ''}
                        onChange={(value) => onErrorSafeChange('name', value)}
                        placeholder="e.g. DOE, JOHN A."
                        required
                        readOnly={readOnly}
                    />
                    <FormCombobox
                        label="Generic Faculty Rank"
                        value={formData.rank || ''}
                        onChange={(value) => onErrorSafeChange('rank', value)}
                        options={mapToOptions(GENERIC_RANK_OPTIONS)}
                        placeholder="Select Rank"
                        required
                        showCodePrefix={true}
                    />
                    <FormField
                        label="HOME COLLEGE"
                        value={formData.college || ''}
                        onChange={(value) => onErrorSafeChange('college', value)}
                        readOnly={readOnly}
                    />
                    <FormField
                        label="HOME DEPARTMENT"
                        value={formData.department || ''}
                        onChange={(value) => onErrorSafeChange('department', value)}
                        readOnly={readOnly}
                    />
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <FormCombobox
                        label="IS FACULTY MEMBER TENURED?"
                        value={formData.is_tenured || ''}
                        onChange={(value) => onErrorSafeChange('is_tenured', value)}
                        options={mapToOptions(referenceData?.tenureE2 || TENURE_OPTIONS)}
                        placeholder="Select Option"
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="SSL Salary Grade"
                        value={formData.salary_grade || ''}
                        onChange={(value) => onErrorSafeChange('salary_grade', value)}
                        options={mapToOptions(SALARY_GRADE_OPTIONS)}
                        placeholder="Select Salary Grade"
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="ANNUAL BASIC SALARY"
                        value={formData.annual_salary || ''}
                        onChange={(value) => onErrorSafeChange('annual_salary', value)}
                        options={mapToOptions(ANNUAL_SALARY_OPTIONS)}
                        placeholder="Select Salary Range"
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="ON LEAVE WITHOUT PAY?"
                        value={formData.on_leave || ''}
                        onChange={(value) => onErrorSafeChange('on_leave', value)}
                        options={mapToOptions(ON_LEAVE_PAY_OPTIONS)}
                        placeholder="Select Option"
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="FULL-TIME EQUIVALENT (FTE)"
                        value={formData.fte || ''}
                        onChange={(value) => onErrorSafeChange('fte', value)}
                        options={mapToOptions(FTE_OPTIONS)}
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="GENDER OF FACULTY"
                        value={formData.gender || ''}
                        onChange={(value) => onErrorSafeChange('gender', value)}
                        options={mapToOptions(GENDER_OPTIONS)}
                        placeholder="Select Gender"
                        required
                        showCodePrefix={true}
                    />
                </div>
            </CardContent>
        </Card>
    );

    const educationalAttainmentCard = (
        <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
            <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                <SectionHeader
                    icon={<GraduationCap />}
                    title="Educational Attainment"
                    variant="white"
                />
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FormCombobox
                        label="Highest Degree Attained"
                        value={formData.degree || ''}
                        onChange={(value) => onErrorSafeChange('degree', value)}
                        options={mapToOptions(HIGHEST_DEGREE_OPTIONS)}
                        placeholder="Select Degree"
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="Actively Pursuing Next Degree?"
                        value={formData.pursuing_degree || ''}
                        onChange={(value) => onErrorSafeChange('pursuing_degree', value)}
                        options={mapToOptions(PURSUING_DEGREE_OPTIONS)}
                        placeholder="Select Option"
                        showCodePrefix={true}
                    />
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-base font-bold text-gray-600 uppercase tracking-wider">SPECIFIC DISCIPLINE (1) OF PRIMARY TEACHING LOAD</label>
                            <DisciplineSelector
                                value={formData.discipline_load_1}
                                onChange={(code) => onErrorSafeChange('discipline_load_1', code)}
                                referenceData={referenceData}
                                placeholder="Select Primary Discipline (1)"
                                showGroup={false}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-base font-bold text-gray-600 uppercase tracking-wider">SPECIFIC DISCIPLINE (2) OF PRIMARY TEACHING LOAD</label>
                            <DisciplineSelector
                                value={formData.discipline_load_2}
                                onChange={(code) => onErrorSafeChange('discipline_load_2', code)}
                                referenceData={referenceData}
                                placeholder="Select Primary Discipline (2)"
                                showGroup={false}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-1.5">
                            <label className="text-base font-bold text-gray-600 uppercase tracking-wider">SPECIFIC DISCIPLINE OF BACHELORS DEGREE</label>
                            <DisciplineSelector
                                value={formData.discipline_bachelors}
                                onChange={(code) => onErrorSafeChange('discipline_bachelors', code)}
                                referenceData={referenceData}
                                placeholder="Select Bachelors Degree"
                                showGroup={false}
                                filterCategory="bachelors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-base font-bold text-gray-600 uppercase tracking-wider">SPECIFIC DISCIPLINE OF MASTERS DEGREE</label>
                            <DisciplineSelector
                                value={formData.discipline_masters}
                                onChange={(code) => onErrorSafeChange('discipline_masters', code)}
                                referenceData={referenceData}
                                placeholder="Select Masters Degree"
                                showGroup={false}
                                filterCategory="masters"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-base font-bold text-gray-600 uppercase tracking-wider">SPECIFIC DISCIPLINE OF DOCTORATE DEGREE</label>
                            <DisciplineSelector
                                value={formData.discipline_doctorate}
                                onChange={(code) => onErrorSafeChange('discipline_doctorate', code)}
                                referenceData={referenceData}
                                placeholder="Select Doctorate Degree"
                                showGroup={false}
                                filterCategory="doctorate"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FormCombobox
                        label="MASTERS DEGREE WITH THESIS?"
                        value={formData.masters_thesis || ''}
                        onChange={(value) => onErrorSafeChange('masters_thesis', value)}
                        options={mapToOptions(THESIS_OPTIONS)}
                        placeholder="Select Option"
                        showCodePrefix={true}
                    />
                    <FormCombobox
                        label="DOCTORATE WITH DISSERTATION?"
                        value={formData.doctorate_dissertation || ''}
                        onChange={(value) => onErrorSafeChange('doctorate_dissertation', value)}
                        options={mapToOptions(DISSERTATION_OPTIONS)}
                        placeholder="Select Option"
                        showCodePrefix={true}
                    />
                </div>
            </CardContent>
        </Card>
    );

    const undergraduateWorkloadCard = (
        <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
            <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                <SectionHeader
                    icon={<Clock />}
                    title="Workload"
                    variant="white"
                />
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
                <WorkloadGrid
                    title="CREDIT UNITS"
                    items={[
                        {
                            label: "LAB CREDIT UNITS TEACHING Undergrad",
                            value: formData.ug_lab_units || '',
                            onChange: (value) => onErrorSafeChange('ug_lab_units', value),
                        },
                        {
                            label: "LECTURE CREDIT UNITS TEACHING Undergrad",
                            value: formData.ug_lec_units || '',
                            onChange: (value) => onErrorSafeChange('ug_lec_units', value),
                        },
                        {
                            label: "TOTAL TEACHING CREDIT UNITS Undergrad (Lab+Lect)",
                            value: formData.ug_total_units || '',
                            onChange: (value) => onErrorSafeChange('ug_total_units', value),
                        }
                    ]}
                />
                <Separator className="my-6" />
                <WorkloadGrid
                    title="HOURS PER WEEK TEACHING"
                    items={[
                        {
                            label: "LAB HOURS PER WEEK TEACHING Undergrad",
                            value: formData.ug_lab_hours || '',
                            onChange: (value) => onErrorSafeChange('ug_lab_hours', value)
                        },
                        {
                            label: "LECTURE HOURS PER WEEK TEACHING Undergrad",
                            value: formData.ug_lec_hours || '',
                            onChange: (value) => onErrorSafeChange('ug_lec_hours', value)
                        },
                        {
                            label: "TOTAL TEACHING HOURS PER WEEK Undergrad",
                            value: formData.ug_total_hours || '',
                            onChange: (value) => onErrorSafeChange('ug_total_hours', value),
                        }
                    ]}
                />
                <Separator className="my-6" />
                <WorkloadGrid
                    title="CONTACT - HOURS"
                    items={[
                        {
                            label: "Student Contact Hours Lab Undergrad",
                            value: formData.ug_lab_contact || '',
                            onChange: (value) => onErrorSafeChange('ug_lab_contact', value)
                        },
                        {
                            label: "Student Contact Hours Lecture Undergrad",
                            value: formData.ug_lec_contact || '',
                            onChange: (value) => onErrorSafeChange('ug_lec_contact', value)
                        },
                        {
                            label: "STUDENT CONTACT-HOURS  Undergrad (Lab+Lect)",
                            value: formData.ug_total_contact || '',
                            onChange: (value) => onErrorSafeChange('ug_total_contact', value),
                        }
                    ]}
                />
                <Separator className="my-6" />
                <WorkloadGrid
                    title="CREDIT UNITS"
                    items={[
                        {
                            label: "LAB CREDIT UNITS TEACHING Graduate Level",
                            value: formData.grad_lab_units || '',
                            onChange: (value) => onErrorSafeChange('grad_lab_units', value),
                        },
                        {
                            label: "LECTURE CREDIT UNITS TEACHING Graduate Level",
                            value: formData.grad_lec_units || '',
                            onChange: (value) => onErrorSafeChange('grad_lec_units', value),
                        },
                        {
                            label: "TOTAL TEACHING CREDIT UNITS Graduate (Lab+Lect)",
                            value: formData.grad_total_units || '',
                            onChange: (value) => onErrorSafeChange('grad_total_units', value),
                        }
                    ]}
                />
                <Separator className="my-6" />
                <WorkloadGrid
                    title="Contact - Hours"
                    items={[
                        {
                            label: "Student Contact Hours Lab Graduate",
                            value: formData.grad_lab_contact || '',
                            onChange: (value) => onErrorSafeChange('grad_lab_contact', value),
                        },
                        {
                            label: "Student Contact Hours Lecture Graduate",
                            value: formData.grad_lec_contact || '',
                            onChange: (value) => onErrorSafeChange('grad_lec_contact', value),
                        },
                        {
                            label: "STUDENT CONTACT-HOURS Graduate (Lab+Lect)",
                            value: formData.grad_total_contact || '',
                            onChange: (value) => onErrorSafeChange('grad_total_contact', value),
                        }
                    ]}
                />
            </CardContent>
        </Card>
    );

    const officialCreditLoadCard = (
        <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white lg:col-span-2">
            <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                <SectionHeader
                    icon={<Award />}
                    title="Official Credit Load"
                    variant="white"
                />
            </CardHeader>
            <CardContent className="pt-6">
                <WorkloadGrid
                    title="CREDIT UNITS"
                    items={[
                        {
                            label: "OFFICIAL RESEARCH LOAD",
                            value: formData.load_research || '',
                            onChange: (value) => onErrorSafeChange('load_research', value),
                        },
                        {
                            label: "OFFICIAL EXTENSION LOAD",
                            value: formData.load_extension || '',
                            onChange: (value) => onErrorSafeChange('load_extension', value),
                        },
                        {
                            label: "OFFICIAL STUDY LOAD",
                            value: formData.load_study || '',
                            onChange: (value) => onErrorSafeChange('load_study', value),
                        },
                        {
                            label: "OFFICIAL LOAD FOR PRODUCTION",
                            value: formData.load_production || '',
                            onChange: (value) => onErrorSafeChange('load_production', value),
                        },
                        {
                            label: "OFFICIAL ADMINISTRATIVE LOAD",
                            value: formData.load_admin || '',
                            onChange: (value) => onErrorSafeChange('load_admin', value),
                        },
                        {
                            label: "OTHER OFFICIAL LOAD CREDITS",
                            value: formData.load_others || '',
                            onChange: (value) => onErrorSafeChange('load_others', value),
                        },
                        {
                            label: "TOTAL WORK LOAD",
                            value: formData.load_total || '',
                            onChange: (value) => onErrorSafeChange('load_total', value),
                        },
                    ]}
                />
            </CardContent>
        </Card>
    );

    // --- MAIN RENDER ---

    return (
        <div className="space-y-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="lg:col-span-2">
                    {generalInfoCard}
                </div>
                <div className="lg:col-span-2">
                    {educationalAttainmentCard}
                </div>
                <div className="lg:col-span-2">
                    {undergraduateWorkloadCard}
                </div>

                <div className="lg:col-span-2">
                    {officialCreditLoadCard}
                </div>
            </div>
        </div>
    );
};
