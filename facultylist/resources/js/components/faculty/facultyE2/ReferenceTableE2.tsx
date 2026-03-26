import type { FC } from 'react';
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

const ReferenceTableE2: FC = () => {
    const col1 = GENERIC_RANK_OPTIONS;
    const col2 = TENURE_OPTIONS;
    const col3 = SALARY_GRADE_OPTIONS;
    const col4 = ANNUAL_SALARY_OPTIONS;
    const col5 = ON_LEAVE_PAY_OPTIONS;
    const col6 = FTE_OPTIONS;
    const col7 = GENDER_OPTIONS;
    const col8 = HIGHEST_DEGREE_OPTIONS;
    const col9 = PURSUING_DEGREE_OPTIONS;
    const col10 = THESIS_OPTIONS;
    const col11 = DISSERTATION_OPTIONS;

    const maxRows = Math.max(
        col1.length, col2.length, col3.length, col4.length, col5.length, 
        col6.length, col7.length, col8.length, col9.length, col10.length, col11.length
    );

    return (
        <div className="h-full overflow-auto bg-white border border-gray-200 shadow-sm rounded-4px">
            <table className="w-full border-collapse text-[10px] font-sans">
                <thead className="bg-[#003468] text-white sticky top-0 z-10">
                    <tr>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[150px]">Generic Rank (A3)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[100px]">Tenure (A6)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[150px]">Salary Grade (A7)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[120px]">Annual Salary (A8)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[150px]">On Leave Pay (A9)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[100px]">FTE (A10)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[80px]">Sex (A11)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[180px]">Highest Degree (B1)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[200px]">Next Degree (B2)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[120px]">Thesis (B8)</th>
                        <th colSpan={2} className="border border-white/30 px-2 py-1.5 text-left min-w-[120px]">Dissertation (B9)</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(maxRows)].map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50 align-top transition-colors">
                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-16 text-center bg-gray-50/50">{col1[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[150px]">{col1[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-12 text-center bg-gray-50/50">{col2[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left">{col2[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-8 text-center bg-gray-50/50">{col3[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[150px]">{col3[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-8 text-center bg-gray-50/50">{col4[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left">{col4[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-8 text-center bg-gray-50/50">{col5[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[150px]">{col5[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-12 text-center bg-gray-50/50">{col6[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left">{col6[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-12 text-center bg-gray-50/50">{col7[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left">{col7[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-10 text-center bg-gray-50/50">{col8[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[180px] text-[9px]">{col8[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-8 text-center bg-gray-50/50">{col9[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[200px] text-[9px]">{col9[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-8 text-center bg-gray-50/50">{col10[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[120px]">{col10[i]?.desc}</td>

                            <td className="border border-gray-200 px-1.5 py-1 font-bold w-8 text-center bg-gray-50/50">{col11[i]?.code}</td>
                            <td className="border border-gray-200 px-1.5 py-1 whitespace-normal text-left max-w-[120px]">{col11[i]?.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReferenceTableE2;
