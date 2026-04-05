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
                        <DataItem label="NAME OF FACULTY ( Last name, first name, middle initial)" value={formData.name} />
                        <DataItem label="Generic Faculty Rank" code={formData.rank} desc={getDescStrict(GENERIC_RANK_OPTIONS, formData.rank)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="HOME COLLEGE" value={formData.college} />
                        <DataItem label="HOME DEPARTMENT" value={formData.department} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="IS FACULTY MEMBER TENURED?" code={formData.is_tenured} desc={getDescStrict(TENURE_OPTIONS, formData.is_tenured)} />
                        <DataItem label="SSL Salary Grade" code={formData.salary_grade} desc={getDescStrict(SALARY_GRADE_OPTIONS, formData.salary_grade)} />
                        <DataItem label="ANNUAL BASIC SALARY" code={formData.annual_salary} desc={getDescStrict(ANNUAL_SALARY_OPTIONS, formData.annual_salary)} />
                        <DataItem label="ON LEAVE WITHOUT PAY?" code={formData.on_leave} desc={getDescStrict(ON_LEAVE_PAY_OPTIONS, formData.on_leave)} />
                        <DataItem label="FULL-TIME EQUIVALENT (FTE)" code={formData.fte} desc={getDescStrict(FTE_OPTIONS, formData.fte)} />
                        <DataItem label="GENDER OF FACULTY" code={formData.gender} desc={getDescStrict(GENDER_OPTIONS, formData.gender)} />
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
                        <DataItem label="SPECIFIC DISCIPLINE (1) OF PRIMARY TEACHING LOAD" code={formData.discipline_load_1} desc={getDisciplineDescWithGroup(formData.discipline_load_1)} />
                        <DataItem label="SPECIFIC DISCIPLINE (2) OF PRIMARY TEACHING LOAD" code={formData.discipline_load_2} desc={getDisciplineDescWithGroup(formData.discipline_load_2)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="SPECIFIC DISCIPLINE OF BACHELORS DEGREE" code={formData.discipline_bachelors} desc={getDisciplineDescWithGroup(formData.discipline_bachelors)} />
                        <DataItem label="SPECIFIC DISCIPLINE OF MASTERS DEGREE" code={formData.discipline_masters} desc={getDisciplineDescWithGroup(formData.discipline_masters)} />
                        <DataItem label="SPECIFIC DISCIPLINE OF DOCTORATE DEGREE" code={formData.discipline_doctorate} desc={getDisciplineDescWithGroup(formData.discipline_doctorate)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
                        <DataItem label="MASTERS DEGREE WITH THESIS?" code={formData.masters_thesis} desc={getDescStrict(THESIS_OPTIONS, formData.masters_thesis)} />
                        <DataItem label="DOCTORATE WITH DISSERTATION?" code={formData.doctorate_dissertation} desc={getDescStrict(DISSERTATION_OPTIONS, formData.doctorate_dissertation)} />
                    </div>
                </div>
            </div>

            {/* Undergraduate & Graduate Workload */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Workload</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="LAB CREDIT UNITS TEACHING Undergrad" value={formData.ug_lab_units} />
                        <DataItem label="LECTURE CREDIT UNITS TEACHING Undergrad" value={formData.ug_lec_units} />
                        <DataItem label="TOTAL TEACHING CREDIT UNITS Undergrad (Lab+Lect)" value={formData.ug_total_units} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="LAB HOURS PER WEEK TEACHING Undergrad" value={formData.ug_lab_hours} />
                        <DataItem label="LECTURE HOURS PER WEEK TEACHING Undergrad" value={formData.ug_lec_hours} />
                        <DataItem label="TOTAL TEACHING HOURS PER WEEK Undergrad" value={formData.ug_total_hours} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="Student Contact Hours Lab Undergrad" value={formData.ug_lab_contact} />
                        <DataItem label="Student Contact Hours Lecture Undergrad" value={formData.ug_lec_contact} />
                        <DataItem label="STUDENT CONTACT-HOURS  Undergrad (Lab+Lect)" value={formData.ug_total_contact} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem label="LAB CREDIT UNITS TEACHING Graduate Level" value={formData.grad_lab_units} />
                        <DataItem label="LECTURE CREDIT UNITS TEACHING Graduate Level" value={formData.grad_lec_units} />
                        <DataItem label="TOTAL TEACHING CREDIT UNITS Graduate (Lab+Lect)" value={formData.grad_total_units} />
                        <DataItem label="Student Contact Hours Lab Graduate" value={formData.grad_lab_contact} />
                        <DataItem label="Student Contact Hours Lecture Graduate" value={formData.grad_lec_contact} />
                        <DataItem label="STUDENT CONTACT-HOURS Graduate (Lab+Lect)" value={formData.grad_total_contact} />
                    </div>
                </div>
            </div>


            {/* Official Credit Load */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Official Credit Load</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-15 ">
                    <DataItem label="OFFICIAL RESEARCH LOAD" value={formData.load_research} />
                    <DataItem label="OFFICIAL EXTENSION LOAD" value={formData.load_extension} />
                    <DataItem label="OFFICIAL STUDY LOAD" value={formData.load_study} />
                    <DataItem label="OFFICIAL LOAD FOR PRODUCTION" value={formData.load_production} />
                    <DataItem label="OFFICIAL ADMINISTRATIVE LOAD" value={formData.load_admin} />
                    <DataItem label="OTHER OFFICIAL LOAD CREDITS" value={formData.load_others} />
                    <DataItem label="TOTAL WORK LOAD" value={formData.load_total} />
                </div>
            </div>

        </div >
    );
}
