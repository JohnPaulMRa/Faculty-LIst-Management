import type { FC } from 'react';
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

type ReferenceTableProps = {
    referenceData?: any;
};

const ReferenceTableE5: FC<ReferenceTableProps> = ({ referenceData }) => {
    // Prefer constants if available, fallback to props
    const fullTimePartTime = FT_PT_OPTIONS;
    const gender = GENDER_OPTIONS;
    const highestDegree = HIGHEST_DEGREE_OPTIONS;
    const professionalLicense = PROFESSIONAL_LICENSE_OPTIONS;
    const tenure = TENURE_OPTIONS;
    const facultyRank = FACULTY_RANK_OPTIONS;
    const teachingLoad = TEACHING_LOAD_OPTIONS;
    const annualSalary = ANNUAL_SALARY_OPTIONS;

    const maxRows = Math.max(
        fullTimePartTime.length, gender.length, highestDegree.length, 
        professionalLicense.length, tenure.length, facultyRank.length, 
        teachingLoad.length, annualSalary.length
    );

    return (
        <div className="h-full overflow-auto bg-white border border-gray-200 shadow-sm rounded-4px">
            <table className="w-full border-collapse text-[10px] font-sans">
                <thead className="bg-[#003468] text-white sticky top-0 z-10">
                    <tr>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[180px]">Full-Time/Part-Time</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[100px]">Gender</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[200px]">Highest Degree</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[250px]">Professional License</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[120px]">Tenure</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[180px]">Faculty Rank</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[150px]">Teaching Load</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[150px]">Annual Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(maxRows)].map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50 align-top transition-colors">
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{fullTimePartTime[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[180px]">{fullTimePartTime[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{gender[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left">{gender[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-12 text-center bg-gray-50/50">{highestDegree[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[200px] text-[9px]">{highestDegree[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{professionalLicense[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[250px] text-[9px]">{professionalLicense[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{tenure[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left">{tenure[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{facultyRank[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[180px]">{facultyRank[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{teachingLoad[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[150px]">{teachingLoad[i]?.desc}</td>
                            
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{annualSalary[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[150px]">{annualSalary[i]?.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReferenceTableE5;
