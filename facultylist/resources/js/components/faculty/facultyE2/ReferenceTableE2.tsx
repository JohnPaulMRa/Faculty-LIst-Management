/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
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

// --- MAIN COMPONENT ---

const ReferenceTableE2: FC = () => {
    // --- CONSTANTS ---

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

    // --- RENDER HELPERS ---

    const renderRows = [...Array(maxRows)].map((_, index) => {
        const rowClass = "hover:bg-gray-50 align-top transition-colors";
        const codeCellClass = "border border-gray-200 px-1.5 py-1 font-bold w-12 text-center bg-gray-50/50";
        const descCellClass = "border border-gray-200 px-1.5 py-1 whitespace-normal text-left";
        
        return (
            <tr key={index} className={rowClass}>
                {/* Generic Rank */}
                <td className={cn(codeCellClass, "w-16")}>{col1[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[150px]")}>{col1[index]?.desc}</td>

                {/* Tenure */}
                <td className={cn(codeCellClass, "w-12")}>{col2[index]?.code}</td>
                <td className={descCellClass}>{col2[index]?.desc}</td>

                {/* Salary Grade */}
                <td className={cn(codeCellClass, "w-8")}>{col3[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[150px]")}>{col3[index]?.desc}</td>

                {/* Annual Salary */}
                <td className={cn(codeCellClass, "w-8")}>{col4[index]?.code}</td>
                <td className={descCellClass}>{col4[index]?.desc}</td>

                {/* On Leave Pay */}
                <td className={cn(codeCellClass, "w-8")}>{col5[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[150px]")}>{col5[index]?.desc}</td>

                {/* FTE */}
                <td className={cn(codeCellClass, "w-12")}>{col6[index]?.code}</td>
                <td className={descCellClass}>{col6[index]?.desc}</td>

                {/* Sex */}
                <td className={cn(codeCellClass, "w-12")}>{col7[index]?.code}</td>
                <td className={descCellClass}>{col7[index]?.desc}</td>

                {/* Highest Degree */}
                <td className={cn(codeCellClass, "w-10")}>{col8[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[180px] text-[9px]")}>{col8[index]?.desc}</td>

                {/* Next Degree */}
                <td className={cn(codeCellClass, "w-8")}>{col9[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[200px] text-[9px]")}>{col9[index]?.desc}</td>

                {/* Thesis */}
                <td className={cn(codeCellClass, "w-8")}>{col10[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[120px]")}>{col10[index]?.desc}</td>

                {/* Dissertation */}
                <td className={cn(codeCellClass, "w-8")}>{col11[index]?.code}</td>
                <td className={cn(descCellClass, "max-w-[120px]")}>{col11[index]?.desc}</td>
            </tr>
        );
    });

    // --- MAIN RENDER ---

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
                    {renderRows}
                </tbody>
            </table>
        </div>
    );
};

// --- HELPERS ---

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default ReferenceTableE2;
