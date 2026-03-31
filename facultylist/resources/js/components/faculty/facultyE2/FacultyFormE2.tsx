/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { 
    Save, 
    X, 
    User, 
    GraduationCap, 
    Briefcase, 
    Clock, 
    Award, 
    ChevronRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface FacultyFormE2Props {
    faculty?: PublicFaculty;
    formData?: Partial<PublicFaculty>;
    onChange?: (field: keyof PublicFaculty, value: string) => void;
    onCancel?: () => void;
    onSave?: (data: Partial<PublicFaculty>) => void;
    referenceData?: any;
    hideHeader?: boolean;
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
    const selectedOption = options.find((opt) => String(opt.value) === String(value));
    const codeValue = selectedOption ? String(selectedOption.value) : "Code";
    
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
                    <div className="shrink-0 h-12 w-32 bg-gray-50 border border-input flex items-center justify-center text-[12px] font-bold text-gray-700 uppercase rounded-md px-3 text-center">
                        {codeValue}
                    </div>
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
                    item.highlighted ? 'font-bold text-[#003468] cursor-default bg-transparent' : 'bg-transparent'
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
                                    readOnly={item.readOnly || item.highlighted}
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

const FacultyFormE2: FC<FacultyFormE2Props> = ({
    faculty,
    hideHeader = false,
    formData: externalFormData,
    onChange: externalOnChange,
    onCancel,
    referenceData
}) => {
    // --- HOOKS ---
    
    const [internalFormData, setInternalFormData] = useState<Partial<PublicFaculty>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (faculty && !externalFormData) {
            setInternalFormData(faculty);
        }
    }, [faculty, externalFormData]);

    const formData = externalFormData || internalFormData;

    // --- HANDLERS ---

    const handleChange = (field: keyof PublicFaculty, value: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }

        if (externalOnChange) {
            externalOnChange(field, value);
        } else {
            setInternalFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // --- DERIVED VARIABLES ---

    const calculateAndSync = (fields: string[], targetField: keyof PublicFaculty) => {
        const total = fields.reduce((sum, field) => 
            sum + (parseFloat(formData[field as keyof PublicFaculty] as string || '0') || 0), 
            0
        ).toFixed(2);
        
        if (total !== formData[targetField]) {
            handleChange(targetField, total);
        }
    };

    // --- SECONDARY HOOKS (EFFECTS) ---

    // Auto-calculate totals
    useEffect(() => {
        // Undergraduate Totals
        calculateAndSync(['ug_lab_units', 'ug_lec_units'], 'ug_total_units');
        calculateAndSync(['ug_lab_hours', 'ug_lec_hours'], 'ug_total_hours');
        calculateAndSync(['ug_lab_contact', 'ug_lec_contact'], 'ug_total_contact');

        // Graduate Totals
        calculateAndSync(['grad_lab_units', 'grad_lec_units'], 'grad_total_units');
        calculateAndSync(['grad_lab_contact', 'grad_lec_contact'], 'grad_total_contact');

        // Official Credit Load Total
        calculateAndSync([
            'load_research', 'load_extension', 'load_study',
            'load_production', 'load_admin', 'load_others'
        ], 'load_total');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formData.ug_lab_units, formData.ug_lec_units,
        formData.ug_lab_hours, formData.ug_lec_hours,
        formData.ug_lab_contact, formData.ug_lec_contact,
        formData.grad_lab_units, formData.grad_lec_units,
        formData.grad_lab_contact, formData.grad_lec_contact,
        formData.load_research, formData.load_extension,
        formData.load_study, formData.load_production,
        formData.load_admin, formData.load_others
    ]);

    // Auto-calculate status
    useEffect(() => {
        const requiredFields = [
            formData.name,
            formData.rank,
            formData.college,
            formData.department,
            formData.is_tenured,
            formData.salary_grade,
            formData.annual_salary,
            formData.on_leave,
            formData.fte,
            formData.gender,
            formData.degree,
            formData.pursuing_degree,
            formData.discipline_load_1,
            formData.discipline_load_2,
            formData.discipline_bachelors,
            formData.discipline_masters,
            formData.discipline_doctorate,
            formData.masters_thesis,
            formData.doctorate_dissertation,
            formData.ug_lab_units,
            formData.ug_lec_units,
            formData.ug_lab_hours,
            formData.ug_lec_hours,
            formData.ug_lab_contact,
            formData.ug_lec_contact,
            formData.grad_lab_units,
            formData.grad_lec_units,
            formData.grad_lab_contact,
            formData.grad_lec_contact,
            formData.load_research,
            formData.load_extension,
            formData.load_study,
            formData.load_production,
            formData.load_admin,
            formData.load_others
        ];

        const isComplete = requiredFields.every(field => field !== undefined && field !== null && field.toString().trim() !== '');
        let newStatus = formData.status;

        if (!isComplete) {
            newStatus = 'Not Yet Completed';
        } else if (formData.status !== 'Completed' && formData.status !== 'Submitted') {
            newStatus = 'Updated';
        }

        if (formData.status !== newStatus) {
            handleChange('status', newStatus || 'Not Yet Completed');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formData.name,
        formData.rank,
        formData.college,
        formData.department,
        formData.is_tenured,
        formData.salary_grade,
        formData.annual_salary,
        formData.on_leave,
        formData.fte,
        formData.gender,
        formData.degree,
        formData.pursuing_degree,
        formData.discipline_load_1,
        formData.discipline_load_2,
        formData.discipline_bachelors,
        formData.discipline_masters,
        formData.discipline_doctorate,
        formData.masters_thesis,
        formData.doctorate_dissertation,
        formData.ug_lab_units,
        formData.ug_lec_units,
        formData.ug_lab_hours,
        formData.ug_lec_hours,
        formData.ug_lab_contact,
        formData.ug_lec_contact,
        formData.grad_lab_units,
        formData.grad_lec_units,
        formData.grad_lab_contact,
        formData.grad_lec_contact,
        formData.load_research,
        formData.load_extension,
        formData.load_study,
        formData.load_production,
        formData.load_admin,
        formData.load_others
    ]);

    // --- JSX FRAGMENTS ---

    const formFields = (
        <div className="space-y-6">
            {/* Section 1: General Information */}
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
                            label="Name of Faculty (Last, First, M.I.)"
                            value={formData.name || ''}
                            onChange={(value) => handleChange('name', value)}
                            placeholder="e.g. DOE, JOHN A."
                            required
                            error={errors.name}
                        />
                        <FormCombobox
                            label="Generic Faculty Rank"
                            value={formData.rank || ''}
                            onChange={(value) => handleChange('rank', value)}
                            options={GENERIC_RANK_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Rank"
                            required
                            showCodePrefix={true}
                            error={errors.rank}
                        />
                        <FormField
                            label="Home College"
                            value={formData.college || ''}
                            onChange={(value) => handleChange('college', value)}
                        />
                        <FormField
                            label="Home Department"
                            value={formData.department || ''}
                            onChange={(value) => handleChange('department', value)}
                        />
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <FormCombobox
                            label="Is Faculty Member Tenured?"
                            value={formData.is_tenured || ''}
                            onChange={(value) => handleChange('is_tenured', value)}
                            options={TENURE_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="SSL Salary Grade"
                            value={formData.salary_grade || ''}
                            onChange={(value) => handleChange('salary_grade', value)}
                            options={SALARY_GRADE_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Salary Grade"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Annual Basic Salary"
                            value={formData.annual_salary || ''}
                            onChange={(value) => handleChange('annual_salary', value)}
                            options={ANNUAL_SALARY_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Salary Range"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="On Leave Without Pay?"
                            value={formData.on_leave || ''}
                            onChange={(value) => handleChange('on_leave', value)}
                            options={ON_LEAVE_PAY_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Full-Time Equivalent (FTE)"
                            value={formData.fte || ''}
                            onChange={(value) => handleChange('fte', value)}
                            options={FTE_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Gender of Faculty"
                            value={formData.gender || ''}
                            onChange={(value) => handleChange('gender', value)}
                            options={GENDER_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Gender"
                            required
                            showCodePrefix={true}
                            error={errors.gender}
                        />
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Section 2: Educational Attainment */}
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
                            onChange={(value) => handleChange('degree', value)}
                            options={HIGHEST_DEGREE_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Degree"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Actively Pursuing Next Degree?"
                            value={formData.pursuing_degree || ''}
                            onChange={(value) => handleChange('pursuing_degree', value)}
                            options={PURSUING_DEGREE_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-[#003468]">Teaching Load Disciplines</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-base font-bold text-gray-600 uppercase tracking-wider">Primary Discipline (1)</label>
                                <DisciplineSelector
                                    value={formData.discipline_load_1}
                                    onChange={(code) => handleChange('discipline_load_1', code)}
                                    referenceData={referenceData}
                                    placeholder="Select Primary Discipline (1)"
                                    showGroup={false}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-base font-bold text-gray-600 uppercase tracking-wider">Primary Discipline (2)</label>
                                <DisciplineSelector
                                    value={formData.discipline_load_2}
                                    onChange={(code) => handleChange('discipline_load_2', code)}
                                    referenceData={referenceData}
                                    placeholder="Select Primary Discipline (2)"
                                    showGroup={false}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-[#003468]">Degree Disciplines</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-1.5">
                                <label className="text-base font-bold text-gray-600 uppercase tracking-wider">Bachelors Discipline</label>
                                <DisciplineSelector
                                    value={formData.discipline_bachelors}
                                    onChange={(code) => handleChange('discipline_bachelors', code)}
                                    referenceData={referenceData}
                                    placeholder="Select Bachelors Discipline"
                                    showGroup={false}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-base font-bold text-gray-600 uppercase tracking-wider">Masters Discipline</label>
                                <DisciplineSelector
                                    value={formData.discipline_masters}
                                    onChange={(code) => handleChange('discipline_masters', code)}
                                    referenceData={referenceData}
                                    placeholder="Select Masters Discipline"
                                    showGroup={false}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-base font-bold text-gray-600 uppercase tracking-wider">Doctorate Discipline</label>
                                <DisciplineSelector
                                    value={formData.discipline_doctorate}
                                    onChange={(code) => handleChange('discipline_doctorate', code)}
                                    referenceData={referenceData}
                                    placeholder="Select Doctorate Discipline"
                                    showGroup={false}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <FormCombobox
                            label="Masters Degree with Thesis?"
                            value={formData.masters_thesis || ''}
                            onChange={(value) => handleChange('masters_thesis', value)}
                            options={THESIS_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Doctorate with Dissertation?"
                            value={formData.doctorate_dissertation || ''}
                            onChange={(value) => handleChange('doctorate_dissertation', value)}
                            options={DISSERTATION_OPTIONS.map(opt => ({ label: opt.desc, value: opt.code }))}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Undergraduate Workload */}
            <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
                <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                    <SectionHeader
                        icon={<Clock />}
                        title="Undergraduate Workload"
                        variant="white"
                    />
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                    <WorkloadGrid
                        title="Credit Units"
                        items={[
                            {
                                label: "Lab Credit Units",
                                value: formData.ug_lab_units || '',
                                onChange: (value) => handleChange('ug_lab_units', value),
                            },
                            {
                                label: "Lecture Credit Units",
                                value: formData.ug_lec_units || '',
                                onChange: (value) => handleChange('ug_lec_units', value),
                            },
                            {
                                label: "Total Credit Units",
                                value: formData.ug_total_units || '',
                                highlighted: true,
                                hint: "Auto-calculated",
                            }
                        ]}
                    />
                    <Separator className="my-6" />
                    <WorkloadGrid
                        title="Hours Per Week"
                        items={[
                            {
                                label: "Lab Hours",
                                value: formData.ug_lab_hours || '',
                                onChange: (value) => handleChange('ug_lab_hours', value)
                            },
                            {
                                label: "Lecture Hours",
                                value: formData.ug_lec_hours || '',
                                onChange: (value) => handleChange('ug_lec_hours', value)
                            },
                            {
                                label: "Total Hours",
                                value: formData.ug_total_hours || '',
                                highlighted: true,
                                hint: "Auto-calculated"
                            }
                        ]}
                    />
                    <Separator className="my-6" />
                    <WorkloadGrid
                        title="Contact Hours"
                        items={[
                            {
                                label: "Lab Contact Hours",
                                value: formData.ug_lab_contact || '',
                                onChange: (value) => handleChange('ug_lab_contact', value)
                            },
                            {
                                label: "Lecture Contact Hours",
                                value: formData.ug_lec_contact || '',
                                onChange: (value) => handleChange('ug_lec_contact', value)
                            },
                            {
                                label: "Total Contact Hours",
                                value: formData.ug_total_contact || '',
                                highlighted: true,
                                hint: "Auto-calculated"
                            }
                        ]}
                    />
                </CardContent>
            </Card>

            {/* Section 4: Graduate Workload */}
            <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
                <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                    <SectionHeader
                        icon={<Briefcase />}
                        title="Graduate Workload"
                        variant="white"
                    />
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                    <WorkloadGrid
                        title="Credit Units"
                        items={[
                            {
                                label: "Lab Units",
                                value: formData.grad_lab_units || '',
                                onChange: (value) => handleChange('grad_lab_units', value),
                            },
                            {
                                label: "Lecture Units",
                                value: formData.grad_lec_units || '',
                                onChange: (value) => handleChange('grad_lec_units', value),
                            },
                            {
                                label: "Total Units",
                                value: formData.grad_total_units || '',
                                highlighted: true,
                                hint: "Auto-calculated"
                            }
                        ]}
                    />
                    <Separator className="my-6" />
                    <WorkloadGrid
                        title="Contact - Hours"
                        items={[
                            {
                                label: "Lab Contact",
                                value: formData.grad_lab_contact || '',
                                onChange: (value) => handleChange('grad_lab_contact', value),
                            },
                            {
                                label: "Lecture Contact",
                                value: formData.grad_lec_contact || '',
                                onChange: (value) => handleChange('grad_lec_contact', value),
                            },
                            {
                                label: "Total Contact",
                                value: formData.grad_total_contact || '',
                                highlighted: true,
                                hint: "Auto-calculated"
                            }
                        ]}
                    />
                </CardContent>
            </Card>

            {/* Section 5: Official Credit Load */}
            <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl bg-white">
                <CardHeader className="bg-linear-to-r from-[#003468] to-[#1a4f8c] pb-6 pt-6 px-6 border-b-0">
                    <SectionHeader
                        icon={<Award />}
                        title="Official Credit Load"
                        variant="white"
                    />
                </CardHeader>
                <CardContent className="pt-6">
                    <WorkloadGrid
                        title="Credit Units"
                        items={[
                            {
                                label: "OFFICIAL RESEARCH LOAD",
                                value: formData.load_research || '',
                                onChange: (value) => handleChange('load_research', value),
                            },
                            {
                                label: "OFFICIAL EXTENSION LOAD",
                                value: formData.load_extension || '',
                                onChange: (value) => handleChange('load_extension', value),
                            },
                            {
                                label: "OFFICIAL STUDY LOAD",
                                value: formData.load_study || '',
                                onChange: (value) => handleChange('load_study', value),
                            },
                            {
                                label: "OFFICIAL LOAD FOR PRODUCTION",
                                value: formData.load_production || '',
                                onChange: (value) => handleChange('load_production', value),
                            },
                            {
                                label: "OFFICIAL ADMINISTRATIVE LOAD",
                                value: formData.load_admin || '',
                                onChange: (value) => handleChange('load_admin', value),
                            },
                            {
                                label: "OTHER OFFICIAL LOAD CREDITS",
                                value: formData.load_others || '',
                                onChange: (value) => handleChange('load_others', value),
                            },
                        ]}
                    />
                    
                    <Separator className="my-6" />

                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-4px border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-lg font-bold text-[#003468] uppercase tracking-wider">
                                    Total Work Load
                                </label>
                                <p className="text-xs text-gray-600 mt-1">Sum of all official loads</p>
                            </div>
                            <div className="text-right">
                                <Input
                                    value={formData.load_total || '0.00'}
                                    readOnly
                                    className="text-2xl! font-semibold h-12 text-[#003468] bg-white border-blue-300 w-44 text-center rounded-lg focus-visible:ring-0 cursor-default"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // --- MAIN RENDER ---

    if (hideHeader) {
        return (
            <div className="w-full bg-gray-50/50 p-2">
                {formFields}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[90vh] md:h-[85vh] w-full bg-gray-50 overflow-hidden rounded-md">
            <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
                <div>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        FORM E-2
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
                            Tertiary Faculty Profile
                        </Badge>
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <DialogClose className="h-9 w-9 flex items-center justify-center hover:bg-white/10 rounded-md transition-all duration-200">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </div>
            </div>

            <ScrollArea className="flex-1 px-8 py-6">
                <div className="max-w-7xl mx-auto pb-8">
                    {formFields}
                </div>
            </ScrollArea>
        </div>
    );
};

export default FacultyFormE2;