/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, GraduationCap, Briefcase } from 'lucide-react';
import React from 'react';

interface PrivateFacultyProfileViewProps {
    formData: any;
    referenceData: any;
}

const DataItem = ({ label, code, desc, value }: { label: string, code?: string, desc?: string, value?: string }) => {
    if (value !== undefined) {
        return (
            <div className="flex flex-col gap-1.5 mb-6">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-[15px] font-medium text-gray-900 border-b border-gray-200 pb-2 bg-transparent">{value || "-"}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1.5 mb-6">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
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
    <div className="flex items-center gap-4 bg-linear-to-r from-[#003468] to-[#1a4f8c] p-4 rounded-none mb-6 shadow-sm">
        <div className="bg-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#003468]" />
        </div>
        <h3 className="text-[14px] font-bold text-white uppercase tracking-widest">{title}</h3>
    </div>
);

export function PrivateFacultyProfileView({ formData, referenceData }: PrivateFacultyProfileViewProps) {
    const getDescStrict = (list: any[], code?: string) => {
        if (!code) return '';
        const found = list?.find((item: any) => String(item.code) === String(code));
        return found ? found.desc : '';
    };

    const getDisciplineDesc = (code?: string) => {
        if (!code) return '';
        const allDisciplines = Array.isArray(referenceData?.disciplines) ? referenceData.disciplines : [];
        const specific = allDisciplines.find((d: any) => String(d.code) === String(code));
        if (specific && specific.desc) return specific.desc;

        const groups = Array.isArray(referenceData?.groupDiscipline) ? referenceData.groupDiscipline : [];
        const group = groups.find((g: any) => String(g.code) === String(code));
        if (group && group.desc) return group.desc;

        return '';
    };


    return (
        <div className="space-y-5 p-3">
            {/* Personal Information */}
            <div>
                <SectionHeader icon={User} title="Personal & Institutional Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                    <DataItem label="Faculty Name (LN, FN, MI)" value={formData.name} />
                    <DataItem label="Full-Time / Part-Time" code={formData.fullTimeCode} desc={getDescStrict(referenceData?.fullTimePartTime, formData.fullTimeCode)} />
                    <DataItem label="Gender" code={formData.genderCode} desc={getDescStrict(referenceData?.gender, formData.genderCode)} />
                    <DataItem label="Primary Teaching Discipline" code={formData.disciplineCode} desc={getDisciplineDesc(formData.disciplineCode)} />
                </div>
            </div>

            {/* Educational Credentials */}
            <div>
                <SectionHeader icon={GraduationCap} title="Educational Credentials" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <DataItem label="Highest Degree Attained" code={formData.degree} desc={getDescStrict(referenceData?.highestDegree, formData.degree)} />
                    <DataItem label="Bachelors Degree Discipline" code={formData.bachelorsCode} desc={getDisciplineDesc(formData.bachelorsCode)} />
                    <DataItem label="Masters Degree Discipline" code={formData.mastersCode} desc={getDisciplineDesc(formData.mastersCode)} />
                    <DataItem label="Doctorate Degree Discipline" code={formData.doctorateCode} desc={getDisciplineDesc(formData.doctorateCode)} />
                </div>
            </div>

            {/* Professional & Teaching Load */}
            <div>
                <SectionHeader icon={Briefcase} title="Employment & Teaching Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
                    <DataItem label="Professional License" code={formData.licenseCode} desc={getDescStrict(referenceData?.professionalLicense, formData.licenseCode)} />
                    <DataItem label="Faculty Rank" code={formData.rankCode} desc={getDescStrict(referenceData?.facultyRank, formData.rankCode)} />
                    <DataItem label="Tenure of Employment" code={formData.tenureCode} desc={getDescStrict(referenceData?.tenure, formData.tenureCode)} />
                    <DataItem label="Teaching Load" code={formData.loadCode} desc={getDescStrict(referenceData?.teachingLoad, formData.loadCode)} />
                    <DataItem label="Annual Salary" code={formData.salaryCode} desc={getDescStrict(referenceData?.annualSalary, formData.salaryCode)} />
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <DataItem label="Subjects Taught" value={formData.subjects} />
                    </div>
                </div>
            </div>
        </div>
    );
}
