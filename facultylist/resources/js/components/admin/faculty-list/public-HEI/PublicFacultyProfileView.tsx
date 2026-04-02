/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { IMPORT_GROUPS } from '@/types/faculty/constants';
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

interface PublicFacultyProfileViewProps {
    formData: any;
    referenceData: any;
}

const DataItem = ({ label, code, desc, value }: { label: string, code?: string | number, desc?: string, value?: string | number }) => {
    if (value !== undefined || (!code && !desc)) {
        return (
            <div className="flex flex-col gap-1.5 mb-6">
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-[13px] font-medium text-gray-900 border-b border-gray-200 pb-2 bg-transparent">{value || "-"}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1.5 mb-6">
            <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <div className="flex items-start gap-3 border-b border-gray-200 pb-2 bg-transparent min-h-[30px]">
                <div className="w-14 shrink-0 flex justify-center pt-0.5">
                    <span className="text-[13px] font-bold text-gray-900 text-center">{code || "-"}</span>
                </div>
                <span className="text-[12px] font-bold text-gray-600 pt-0.5">:</span>
                <div className="flex-1 text-left">
                    <span className="text-[13px] font-medium text-gray-900 wrap-break-word leading-tight block">{desc || "-"}</span>
                </div>
            </div>
        </div>
    );
};

export function PublicFacultyProfileView({ formData, referenceData }: PublicFacultyProfileViewProps) {
    const getDescStrict = (options: any[], code: any) => {
        if (code === undefined || code === null) return '';
        const found = options.find((opt: any) => String(opt.code) === String(code));
        return found ? found.desc : '';
    };

    const getDisciplineDescWithGroup = (code?: string) => {
        if (!code) return '-';

        // Try specific_discipline first
        const allDisciplines = Array.isArray(referenceData?.disciplines) ? referenceData.disciplines : [];
        const specific = allDisciplines.find((d: any) => String(d.code) === String(code));

        if (specific) {
            let finalDesc = specific.desc;
            if (specific.major_code) {
                const groups = Array.isArray(referenceData?.groupDiscipline) ? referenceData.groupDiscipline : [];
                const major = groups.find((g: any) => String(g.code) === String(specific.major_code));
                if (major && major.desc) {
                    finalDesc = specific.desc;
                }
            }
            return finalDesc;
        }

        // Fall back to major_discipline (groupDiscipline) — E2 codes live here
        const allGroups = Array.isArray(referenceData?.groupDiscipline) ? referenceData.groupDiscipline : [];
        const fromGroup = allGroups.find((g: any) => String(g.code) === String(code));
        if (fromGroup) return fromGroup.desc;

        return code;
    };

    const groupInfo = IMPORT_GROUPS.find(g => {
        const val = String(g.value).replace('GROUP ', '').trim().toUpperCase();
        const dataVal = String(formData.import_group || '').replace('GROUP ', '').trim().toUpperCase();
        return val === dataVal;
    });

    return (
        <div className="space-y-5 p-3">
            {/* Import Group Banner */}
            {groupInfo && (
                <div className="mb-6 -mt-2">
                    <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">
                        {groupInfo.label.replace('GROUP ', '')}
                    </h2>
                    {groupInfo.remarks && (
                        <p className="text-[13px] italic text-gray-400 mt-1">
                            {groupInfo.remarks}
                        </p>
                    )}
                </div>
            )}

            {/* General Information */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="Name of Faculty (Last, First, M.I.)" value={formData.name} />
                        <DataItem label="Generic Faculty Rank" code={formData.rank} desc={getDescStrict(GENERIC_RANK_OPTIONS, formData.rank)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="Home College" value={formData.college} />
                        <DataItem label="Home Department" value={formData.department} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="Is Faculty Member Tenured?" code={formData.is_tenured} desc={getDescStrict(TENURE_OPTIONS, formData.is_tenured)} />
                        <DataItem label="SSL Salary Grade" code={formData.salary_grade} desc={getDescStrict(SALARY_GRADE_OPTIONS, formData.salary_grade)} />
                        <DataItem label="Annual Basic Salary" code={formData.annual_salary} desc={getDescStrict(ANNUAL_SALARY_OPTIONS, formData.annual_salary)} />
                        <DataItem label="On Leave Without Pay?" code={formData.on_leave} desc={getDescStrict(ON_LEAVE_PAY_OPTIONS, formData.on_leave)} />
                        <DataItem label="Full-Time Equivalent (FTE)" code={formData.fte} desc={getDescStrict(FTE_OPTIONS, formData.fte)} />
                        <DataItem label="Gender of Faculty" code={formData.gender} desc={getDescStrict(GENDER_OPTIONS, formData.gender)} />
                    </div>
                </div>
            </div>

            {/* Educational Attainment */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Educational Attainment</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="Highest Degree Attained" code={formData.degree} desc={getDescStrict(HIGHEST_DEGREE_OPTIONS, formData.degree)} />
                        <DataItem label="Actively Pursuing Next Degree?" code={formData.pursuing_degree} desc={getDescStrict(PURSUING_DEGREE_OPTIONS, formData.pursuing_degree)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="Primary Discipline (1)" code={formData.discipline_load_1} desc={getDisciplineDescWithGroup(formData.discipline_load_1)} />
                        <DataItem label="Primary Discipline (2)" code={formData.discipline_load_2} desc={getDisciplineDescWithGroup(formData.discipline_load_2)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="Bachelors Discipline" code={formData.discipline_bachelors} desc={getDisciplineDescWithGroup(formData.discipline_bachelors)} />
                        <DataItem label="Masters Discipline" code={formData.discipline_masters} desc={getDisciplineDescWithGroup(formData.discipline_masters)} />
                        <DataItem label="Doctorate Discipline" code={formData.discipline_doctorate} desc={getDisciplineDescWithGroup(formData.discipline_doctorate)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="Masters Degree with Thesis?" code={formData.masters_thesis} desc={getDescStrict(THESIS_OPTIONS, formData.masters_thesis)} />
                        <DataItem label="Doctorate with Dissertation?" code={formData.doctorate_dissertation} desc={getDescStrict(DISSERTATION_OPTIONS, formData.doctorate_dissertation)} />
                    </div>
                </div>
            </div>

            {/* Undergraduate & Graduate Workload */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Undergraduate</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="Lab Units" value={formData.ug_lab_units} />
                        <DataItem label="Lecture Units" value={formData.ug_lec_units} />
                        <DataItem label="Total Units" value={formData.ug_total_units} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="Lab Hours" value={formData.ug_lab_hours} />
                        <DataItem label="Lecture Hours" value={formData.ug_lec_hours} />
                        <DataItem label="Total Hours" value={formData.ug_total_hours} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="Lab Contact" value={formData.ug_lab_contact} />
                        <DataItem label="Lecture Contact" value={formData.ug_lec_contact} />
                        <DataItem label="Total Contact" value={formData.ug_total_contact} />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Graduate Workload</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
                    <DataItem label="Lab Units" value={formData.grad_lab_units} />
                    <DataItem label="Lecture Units" value={formData.grad_lec_units} />
                    <DataItem label="Total Units" value={formData.grad_total_units} />

                    <DataItem label="Lab Contact" value={formData.grad_lab_contact} />
                    <DataItem label="Lecture Contact" value={formData.grad_lec_contact} />
                    <DataItem label="Total Contact" value={formData.grad_total_contact} />
                </div>
            </div>

            {/* Official Credit Load */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Official Credit Load</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
                    <DataItem label="Official Research Load" value={formData.load_research} />
                    <DataItem label="Official Extension Load" value={formData.load_extension} />
                    <DataItem label="Official Study Load" value={formData.load_study} />
                    <DataItem label="Official Load for Production" value={formData.load_production} />
                    <DataItem label="Official Administrative Load" value={formData.load_admin} />
                    <DataItem label="Other Official Load Credits" value={formData.load_others} />
                    <div className="col-span-1 md:col-span-3">
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700 uppercase">Total Work Load</span>
                            <span className="text-2xl font-bold text-blue-900">{formData.load_total || '0'}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
