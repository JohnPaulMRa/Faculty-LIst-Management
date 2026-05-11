/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, GraduationCap, Briefcase } from 'lucide-react';
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

const DataItem = ({ label, code, desc, value, center }: { label: string, code?: string | number, desc?: string, value?: string | number, center?: boolean }) => {
    if (value !== undefined || (!code && !desc)) {
        return (
            <div className="flex flex-col gap-1.5 mb-6">
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                <span className={`text-[13px] font-medium text-gray-900 border-b border-gray-200 pb-2 bg-transparent${center ? ' text-center' : ''}`}>{value || "-"}</span>
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

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-4 bg-linear-to-r from-[#003468] to-[#1a4f8c] p-4 rounded-2xl mb-6 shadow-md border border-white/10">
        <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl shadow-inner flex items-center justify-center border border-white/20">
            <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-[14px] font-bold text-white uppercase tracking-widest">{title}</h3>
    </div>
);

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
                <SectionHeader icon={User} title="General Information" />
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
                <SectionHeader icon={GraduationCap} title="Educational Attainment" />
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

            {/* Workload */}
            <div>
                <SectionHeader icon={Briefcase} title="Workload" />
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem center label="LAB CREDIT UNITS TEACHING Undergrad" value={formData.ug_lab_units} />
                        <DataItem center label="LECTURE CREDIT UNITS TEACHING Undergrad" value={formData.ug_lec_units} />
                        <DataItem center label="TOTAL TEACHING CREDIT UNITS Undergrad (Lab+Lect)" value={formData.ug_total_units} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem center label="LAB HOURS PER WEEK TEACHING Undergrad" value={formData.ug_lab_hours} />
                        <DataItem center label="LECTURE HOURS PER WEEK TEACHING Undergrad" value={formData.ug_lec_hours} />
                        <DataItem center label="TOTAL TEACHING HOURS PER WEEK Undergrad" value={formData.ug_total_hours} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem center label="Student Contact Hours Lab Undergrad" value={formData.ug_lab_contact} />
                        <DataItem center label="Student Contact Hours Lecture Undergrad" value={formData.ug_lec_contact} />
                        <DataItem center label="STUDENT CONTACT-HOURS  Undergrad (Lab+Lect)" value={formData.ug_total_contact} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                        <DataItem center label="LAB CREDIT UNITS TEACHING Graduate Level" value={formData.grad_lab_units} />
                        <DataItem center label="LECTURE CREDIT UNITS TEACHING Graduate Level" value={formData.grad_lec_units} />
                        <DataItem center label="TOTAL TEACHING CREDIT UNITS Graduate (Lab+Lect)" value={formData.grad_total_units} />
                        <DataItem center label="Student Contact Hours Lab Graduate" value={formData.grad_lab_contact} />
                        <DataItem center label="Student Contact Hours Lecture Graduate" value={formData.grad_lec_contact} />
                        <DataItem center label="STUDENT CONTACT-HOURS Graduate (Lab+Lect)" value={formData.grad_total_contact} />
                    </div>
                </div>
            </div>


            {/* Official Credit Load */}
            <div>
                <SectionHeader icon={Briefcase} title="Official Credit Load" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-15 ">
                    <DataItem center label="OFFICIAL RESEARCH LOAD" value={formData.load_research} />
                    <DataItem center label="OFFICIAL EXTENSION LOAD" value={formData.load_extension} />
                    <DataItem center label="OFFICIAL STUDY LOAD" value={formData.load_study} />
                    <DataItem center label="OFFICIAL LOAD FOR PRODUCTION" value={formData.load_production} />
                    <DataItem center label="OFFICIAL ADMINISTRATIVE LOAD" value={formData.load_admin} />
                    <DataItem center label="OTHER OFFICIAL LOAD CREDITS" value={formData.load_others} />
                    <DataItem center label="TOTAL WORK LOAD" value={formData.load_total} />
                </div>
            </div>

        </div >
    );
}
