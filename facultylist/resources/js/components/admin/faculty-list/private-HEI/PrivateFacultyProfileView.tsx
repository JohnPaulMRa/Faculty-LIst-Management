import React from 'react';

interface PrivateFacultyProfileViewProps {
    formData: any;
    referenceData: any;
}

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
                <div className="flex items-center gap-3 border-b border-gray-200 pb-2 bg-transparent min-h-[30px]">
                    <div className="w-14 shrink-0 flex justify-center">
                        <span className="text-[13px] font-bold text-gray-900 text-center">{code || "-"}</span>
                    </div>
                    <span className="text-[12px] font-bold text-gray-600">:</span>
                    <div className="flex-1">
                        <span className="text-[13px] font-medium text-gray-900">{desc || "-"}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5 p-3">
            {/* Personal Information */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Personal Information</h3>
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-x-5">
                    <DataItem label="Faculty Name (LN, FN, MI)" value={formData.name} />
                    <DataItem label="Gender" code={formData.genderCode} desc={getDescStrict(referenceData?.gender, formData.genderCode)} />
                    <DataItem label="Full-Time / Part-Time" code={formData.fullTimeCode} desc={getDescStrict(referenceData?.fullTimePartTime, formData.fullTimeCode)} />
                </div>
            </div>

            {/* Educational Credentials */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-5">Educational Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <div className="col-span-1 md:col-span-2">
                        <DataItem label="Highest Degree Attained" code={formData.degree} desc={getDescStrict(referenceData?.highestDegree, formData.degree)} />
                    </div>
                    <DataItem label="Primary Teaching Discipline" code={formData.disciplineCode} desc={getDisciplineDesc(formData.disciplineCode)} />
                    <DataItem label="Bachelors Degree Discipline" code={formData.bachelorsCode} desc={getDisciplineDesc(formData.bachelorsCode)} />
                    <DataItem label="Masters Degree Discipline" code={formData.mastersCode} desc={getDisciplineDesc(formData.mastersCode)} />
                    <DataItem label="Doctorate Degree Discipline" code={formData.doctorateCode} desc={getDisciplineDesc(formData.doctorateCode)} />
                </div>
            </div>

            {/* Professional & Teaching Load */}
            <div>
                <h3 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-3 mb-6">Professional & Teaching Details</h3>
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
