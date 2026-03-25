import { Save, X, User, GraduationCap, Briefcase, Clock, Award, ChevronRight } from 'lucide-react';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import type { PublicFaculty } from '@/types/faculty';
import { cn } from '@/lib/utils';

type Props = {
    faculty?: PublicFaculty;
    formData?: Partial<PublicFaculty>;
    onChange?: (field: keyof PublicFaculty, value: string) => void;
    onCancel?: () => void;
    onSave?: (data: Partial<PublicFaculty>) => void;
    referenceData?: any;
    hideHeader?: boolean;
};

// Section Header Component for consistent styling
const SectionHeader: FC<{ icon: React.ReactNode; title: string; badge?: string }> = ({ icon, title, badge }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-linear-to-br from-[#003468] to-[#1a4f8c] text-white rounded-lg shadow-sm">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg text-[#003468]">{title}</h3>
                {badge && <p className="text-xs text-gray-500">{badge}</p>}
            </div>
        </div>
        {badge && <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">{badge}</Badge>}
    </div>
);

// Form Field Component for consistency
const FormField: FC<{
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
}> = ({ label, value, onChange, placeholder, type = 'text', className = '', required, hint, error, readOnly, showCodePrefix = false }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {hint && <span className="text-[10px] text-gray-400 italic">{hint}</span>}
        </div>
        <div className="flex items-center gap-2">
            {showCodePrefix && (
                <div className="shrink-0 h-9 w-[50px] bg-[#F8F9FA] border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 uppercase rounded-sm">
                    CODE
                </div>
            )}
            <div className={cn(
                "flex flex-1 items-stretch rounded-4px border border-gray-300 bg-white transition-all duration-200 overflow-hidden",
                readOnly ? "bg-gray-50/50 border-gray-200" : "focus-within:border-[#003468] focus-within:ring-1 focus-within:ring-[#003468]/20 hover:border-gray-400",
                error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20" : ""
            )}>
                <Input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={cn(
                        "border-0 focus-visible:ring-0 shadow-none h-9 flex-1",
                        readOnly && "cursor-not-allowed text-gray-500",
                        className
                    )}
                />
            </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

// Form Combobox Component for consistency
const FormCombobox: FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string | number }[];
    placeholder?: string;
    required?: boolean;
    error?: string;
    showCodePrefix?: boolean;
}> = ({ label, value, onChange, options, placeholder, required, error, showCodePrefix = true }) => {
    const selectedOption = options.find((opt) => String(opt.value) === String(value));
    const codeValue = selectedOption ? String(selectedOption.value) : "CODE";

    return (
        <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-600 uppercase tracking-wider">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-2">
                {showCodePrefix && (
                    <div className="shrink-0 h-10 w-[60px] bg-[#F8F9FA] border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 uppercase rounded-4px">
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
                        className={cn(
                            'border-gray-300 hover:border-gray-400 focus-within:border-[#003468] focus-within:ring-1 focus-within:ring-[#003468]/20 rounded-4px shadow-none h-9',
                            error ? 'border-red-500 focus-within:ring-red-500/20 focus-within:border-red-500' : ''
                        )}
                    />
                </div>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

// Workload Grid Component for consistent workload sections
const WorkloadGrid: FC<{
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
}> = ({ title, items }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-[#003468]" />
            <span className="text-xs font-bold text-[#003468] uppercase tracking-wider">{title}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
                <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[13px] font-semibold text-gray-500 uppercase leading-tight">
                            {item.label}
                        </label>
                        {item.hint && <span className="text-[8px] text-gray-400">{item.hint}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        {item.showCodePrefix && (
                            <div className="shrink-0 h-9 w-[60px] bg-[#F8F9FA] border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 uppercase rounded-4px">
                                CODE
                            </div>
                        )}
                        <div className={cn(
                            "flex flex-1 items-stretch rounded-4px border overflow-hidden h-9",
                            item.highlighted
                                ? 'bg-blue-50/50 border-blue-200'
                                : 'bg-white border-gray-300 hover:border-gray-400'
                        )}>
                            <Input
                                value={item.value || ''}
                                onChange={(e) => item.onChange && item.onChange(e.target.value)}
                                readOnly={item.readOnly || item.highlighted}
                                className={cn(
                                    "border-0 focus-visible:ring-0 shadow-none h-full w-full flex-1 text-center",
                                    item.highlighted
                                        ? 'font-bold text-[#003468] cursor-default bg-transparent'
                                        : 'bg-transparent'
                                )}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FacultyFormE2: FC<Props> = ({
    faculty,
    onSave,
    onCancel,
    hideHeader = false,
    formData: externalFormData,
    onChange: externalOnChange
}) => {
    const [internalFormData, setInternalFormData] = useState<Partial<PublicFaculty>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (faculty && !externalFormData) {
            setInternalFormData(faculty);
        }
    }, [faculty, externalFormData]);

    const formData = externalFormData || internalFormData;

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

    // Auto-calculate totals
    useEffect(() => {
        const calculateAndSync = (fields: string[], targetField: keyof PublicFaculty) => {
            const total = fields.reduce((sum, field) => sum + (parseFloat(formData[field as keyof PublicFaculty] as string || '0') || 0), 0).toFixed(2);
            if (total !== formData[targetField]) {
                handleChange(targetField, total);
            }
        };

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name?.trim()) newErrors.name = "Faculty name is required";
        if (!formData.rank?.trim()) newErrors.rank = "Faculty rank is required";
        if (!formData.gender?.trim()) newErrors.gender = "Gender is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(formData);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const formFields = (
        <div className="space-y-6">
            {/* Section 1: General Information */}
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                    <SectionHeader
                        icon={<User className="h-5 w-5" />}
                        title="General Information"
                    />
                </CardHeader>
                <CardContent className="pt-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            options={[
                                { label: 'PROFESSOR', value: 'PROF' },
                                { label: 'ASSOCIATE PROFESSOR', value: 'ASSOC_PROF' },
                                { label: 'ASSISTANT PROFESSOR', value: 'ASST_PROF' },
                                { label: 'INSTRUCTOR', value: 'INST' },
                                { label: 'LECTURER', value: 'LECT' },
                            ]}
                            placeholder="Select Rank"
                            required
                            showCodePrefix={true}
                            error={errors.rank}
                        />
                        <FormField
                            label="Home College"
                            value={formData.college || ''}
                            onChange={(value) => handleChange('college', value)}
                            placeholder="College code"
                            showCodePrefix={true}
                        />
                        <FormField
                            label="Home Department"
                            value={formData.department || ''}
                            onChange={(value) => handleChange('department', value)}
                            placeholder="Department code"
                            showCodePrefix={true}
                        />
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <FormCombobox
                            label="Is Faculty Member Tenured?"
                            value={formData.is_tenured || ''}
                            onChange={(value) => handleChange('is_tenured', value)}
                            options={[
                                { label: 'YES', value: '1' },
                                { label: 'NO', value: '0' },
                            ]}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                        <FormField
                            label="SSL Salary Grade"
                            value={formData.salary_grade || ''}
                            onChange={(value) => handleChange('salary_grade', value)}
                            type="number"
                            placeholder="e.g. 15"
                            showCodePrefix={true}
                        />
                        <FormField
                            label="Annual Basic Salary"
                            value={formData.annual_salary || ''}
                            onChange={(value) => handleChange('annual_salary', value)}
                            type="number"
                            placeholder="e.g. 123456"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="On Leave Without Pay?"
                            value={formData.on_leave || ''}
                            onChange={(value) => handleChange('on_leave', value)}
                            options={[
                                { label: 'YES', value: '1' },
                                { label: 'NO', value: '0' },
                            ]}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                        <FormField
                            label="Full-Time Equivalent (FTE)"
                            value={formData.fte || ''}
                            onChange={(value) => handleChange('fte', value)}
                            placeholder="1.00"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Gender of Faculty"
                            value={formData.gender || ''}
                            onChange={(value) => handleChange('gender', value)}
                            options={[
                                { label: 'MALE', value: 'M' },
                                { label: 'FEMALE', value: 'F' },
                            ]}
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
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                    <SectionHeader
                        icon={<GraduationCap className="h-5 w-5" />}
                        title="Educational Attainment"
                    />
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                            label="Highest Degree Attained"
                            value={formData.degree || ''}
                            onChange={(value) => handleChange('degree', value)}
                            placeholder="Use 3-digit code"
                            hint="e.g. PHD, MAS"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Actively Pursuing Next Degree?"
                            value={formData.pursuing_degree || ''}
                            onChange={(value) => handleChange('pursuing_degree', value)}
                            options={[
                                { label: 'YES', value: '1' },
                                { label: 'NO', value: '0' },
                            ]}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-[#003468]">Teaching Load Disciplines</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <FormField
                                label="Primary Discipline (1)"
                                value={formData.discipline_load_1 || ''}
                                onChange={(value) => handleChange('discipline_load_1', value)}
                                placeholder="Use 6-digit code"
                                showCodePrefix={true}
                            />
                            <FormField
                                label="Primary Discipline (2)"
                                value={formData.discipline_load_2 || ''}
                                onChange={(value) => handleChange('discipline_load_2', value)}
                                placeholder="Use 6-digit code"
                                showCodePrefix={true}
                            />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-[#003468]">Degree Disciplines</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <FormField
                                label="Bachelors Degree"
                                value={formData.discipline_bachelors || ''}
                                onChange={(value) => handleChange('discipline_bachelors', value)}
                                placeholder="6-digit code"
                                showCodePrefix={true}
                            />
                            <FormField
                                label="Masters Degree"
                                value={formData.discipline_masters || ''}
                                onChange={(value) => handleChange('discipline_masters', value)}
                                placeholder="6-digit code"
                                showCodePrefix={true}
                            />
                            <FormField
                                label="Doctorate"
                                value={formData.discipline_doctorate || ''}
                                onChange={(value) => handleChange('discipline_doctorate', value)}
                                placeholder="6-digit code"
                                showCodePrefix={true}
                            />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormCombobox
                            label="Masters Degree with Thesis?"
                            value={formData.masters_thesis || ''}
                            onChange={(value) => handleChange('masters_thesis', value)}
                            options={[
                                { label: 'YES', value: '1' },
                                { label: 'NO', value: '0' },
                            ]}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                        <FormCombobox
                            label="Doctorate with Dissertation?"
                            value={formData.doctorate_dissertation || ''}
                            onChange={(value) => handleChange('doctorate_dissertation', value)}
                            options={[
                                { label: 'YES', value: '1' },
                                { label: 'NO', value: '0' },
                            ]}
                            placeholder="Select Option"
                            showCodePrefix={true}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Undergraduate Workload */}
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                    <SectionHeader
                        icon={<Clock className="h-5 w-5" />}
                        title="Undergraduate Workload"
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
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                    <SectionHeader
                        icon={<Briefcase className="h-5 w-5" />}
                        title="Graduate Workload"
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
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                    <SectionHeader
                        icon={<Award className="h-5 w-5" />}
                        title="Official Credit Load"
                    />
                </CardHeader>
                <CardContent className="pt-6">
                    <WorkloadGrid
                        title="Credit Units"
                        items={[
                            {
                                label: "OFFICIAL RESEARCH LOAD",
                                value: formData.grad_lab_units || '',
                                onChange: (value) => handleChange('grad_lab_units', value),
                            },
                            {
                                label: "OFFICIAL EXTENSION LOAD",
                                value: formData.grad_lec_units || '',
                                onChange: (value) => handleChange('grad_lec_units', value),
                            },
                            {
                                label: "OFFICIAL STUDY LOAD",
                                value: formData.grad_lec_units || '',
                                onChange: (value) => handleChange('grad_lec_units', value),
                            },
                            {
                                label: "OFFICIAL LOAD FOR PRODUCTION",
                                value: formData.grad_lec_units || '',
                                onChange: (value) => handleChange('grad_lec_units', value),
                            },
                            {
                                label: "OFFICIAL ADMINISTRATIVE LOAD",
                                value: formData.grad_lec_units || '',
                                onChange: (value) => handleChange('grad_lec_units', value),
                            },
                            {
                                label: "OTHER OFFICIAL LOAD CREDITS",
                                value: formData.grad_lec_units || '',
                                onChange: (value) => handleChange('grad_lec_units', value),
                            },
                        ]}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    </div>

                    <Separator className="my-6" />

                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-4px border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-bold text-[#003468] uppercase tracking-wider">
                                    Total Work Load
                                </label>
                                <p className="text-xs text-gray-600 mt-1">Sum of all official loads</p>
                            </div>
                            <div className="text-right">
                                <Input
                                    value={formData.load_total || '0.00'}
                                    readOnly
                                    className="text-xl font-bold text-[#003468] bg-white border-blue-300 w-32 text-center rounded-lg focus-visible:ring-0 cursor-default"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    if (hideHeader) {
        return (
            <div className="w-full bg-gray-50/50 p-6">
                {formFields}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[90vh] md:h-[85vh] w-full bg-gray-50 overflow-hidden rounded-4px">
            <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
                <div>
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        FORM E-2
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
                            Tertiary Faculty Profile
                        </Badge>
                    </h2>
                    <p className="text-sm text-blue-100 mt-1">Faculty Registration • Academic Year 2025-2026</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="h-9 font-bold uppercase text-xs bg-white text-[#003468] hover:bg-gray-100 shadow-xs"
                    >
                        <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Quick Save'}
                    </Button>
                    <DialogClose className="h-9 w-9 flex items-center justify-center hover:bg-white/10 rounded-md transition-all duration-200">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </div>
            </div>

            <ScrollArea className="flex-1 px-8 py-6">
                <form onSubmit={handleSave} className="max-w-7xl mx-auto pb-8">
                    {formFields}
                </form>
            </ScrollArea>
        </div>
    );
};

export default FacultyFormE2;