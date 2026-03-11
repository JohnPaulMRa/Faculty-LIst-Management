import type { FC } from 'react';

type ReferenceTableProps = {
    referenceData: any;
};

const ReferenceTableE5: FC<ReferenceTableProps> = ({ referenceData }) => {
    // Safe access to arrays
    const fullTimePartTime = referenceData?.fullTimePartTime || [];
    const gender = referenceData?.gender || [];
    const highestDegree = referenceData?.highestDegree || [];
    const professionalLicense = referenceData?.professionalLicense || [];
    const tenure = referenceData?.tenure || [];
    const facultyRank = referenceData?.facultyRank || [];
    const teachingLoad = referenceData?.teachingLoad || [];
    const annualSalary = referenceData?.annualSalary || [];

    const maxRows = Math.max(fullTimePartTime.length, gender.length, highestDegree.length, professionalLicense.length, tenure.length, facultyRank.length, teachingLoad.length, annualSalary.length);

    return (
        <div className="h-full overflow-auto bg-white">
            <table className="w-full border-collapse text-[10px] font-sans">
                <thead className="bg-black text-white sticky top-0 z-10">
                    <tr>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-64">Full-Time/Part-Time</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-24">Gender</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-64">Highest Degree Attained</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-64">Professional License</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-32">Tenure</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-64">Faculty Rank</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-40">Teaching Load</th>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-40">Annual Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(maxRows)].map((_, i) => (
                        <tr key={i} className="hover:bg-gray-100 align-top">
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{fullTimePartTime[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{fullTimePartTime[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{gender[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{gender[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-8 text-center">{highestDegree[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{highestDegree[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{professionalLicense[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{professionalLicense[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{tenure[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{tenure[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{facultyRank[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{facultyRank[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{teachingLoad[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{teachingLoad[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{annualSalary[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{annualSalary[i]?.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReferenceTableE5;
