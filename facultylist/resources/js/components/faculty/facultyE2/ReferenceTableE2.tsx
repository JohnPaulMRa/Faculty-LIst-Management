import type { FC } from 'react';

const ReferenceTableE2: FC = () => {
    // Data derived from reference image
    const col1 = [ // Full-Time/Part-Time
        { code: "1", desc: "The person is a full-time employee of the HEI." },
        { code: "2", desc: "The person is a half-time employee of the HEI." },
        { code: "3", desc: "Student employee such as Student Assistant or Graduate Assistant." },
        { code: "4", desc: "Teaching Fellow, Associate or Assistant." },
        { code: "5", desc: "None of the above and therefore part-time. This includes: lecturers (all ranks), adjunct or affiliate faculty, visiting professors, professors emeriti, Physicians on call, lawyers or accountants on retainer basis, etc." },
        { code: "9", desc: "Not known or not indicated." },
        { code: "", desc: "Used by: Col B" }
    ];
    const col2 = [ // Gender
        { code: "1", desc: "Male" },
        { code: "2", desc: "Female" },
        { code: "", desc: "Used by: Col C" }
    ];
    const col3 = [ // Highest Degree Attained
        { code: "000", desc: "No formal education at all" },
        { code: "101", desc: "Partial elementary schooling but did not complete Grade 4" },
        { code: "102", desc: "Completed Grade 4 but did not graduate from elementary school" },
        { code: "103", desc: "Completed Elementary School" },
        { code: "201", desc: "Partial completion of High School" },
        { code: "202", desc: "Secondary school graduate or equivalent" },
        { code: "301", desc: "Partial completion of pre-baccalaureate certificate, diploma or associateship" },
        { code: "302", desc: "Completed Tech/Voc" },
        { code: "401", desc: "Partial completion of pre-bac certificate, diploma or associateship" },
        { code: "402", desc: "Completed pre-bacc certificate, diploma or associateship" },
        { code: "501", desc: "Completed Year 1 of baccalaureate level or equivalent" },
        { code: "502", desc: "Completed Year 2 of baccalaureate level or equivalent" },
        { code: "503", desc: "Completed Year 3 of baccalaureate level or equivalent" }
    ];
    const col4 = [ // Professional License
        { code: "1", desc: "PRC in Accountancy or the equivalent from another jurisdiction" },
        { code: "2", desc: "PRC in Aeronautical engineering or the equivalent from another jurisdiction" },
        { code: "3", desc: "PRC in Agricultural Engineering or the equivalent from another jurisdiction" },
        { code: "4", desc: "PRC in Agriculture or the equivalent from another jurisdiction" },
        { code: "5", desc: "PRC in Architecture or the equivalent from another jurisdiction" },
        { code: "6", desc: "PRC in Chemical Engineering or the equivalent from another jurisdiction" },
        { code: "7", desc: "PRC in Chemistry or the equivalent" },
        { code: "8", desc: "PRC in Civil Engineering or the equivalent" },
        { code: "9", desc: "PRC in Criminology or the equivalent" },
        { code: "10", desc: "PRC in Customs Brokerage or the equivalent" },
        { code: "11", desc: "PRC in Dentistry or the equivalent" },
        { code: "12", desc: "PRC in Electrical Engineering or the equivalent" },
        { code: "13", desc: "PRC in Electronics & Communication Engineering or the equivalent" }
    ];
    const col5 = [ // Tenure
        { code: "1", desc: "Permanent" },
        { code: "2", desc: "Probationary" },
        { code: "3", desc: "Casual" },
        { code: "4", desc: "Contractual" }
    ];
    const col6 = [ // Faculty Rank
        { code: "09", desc: "Teaching Fellow or Teaching Associate" },
        { code: "10", desc: "Teacher, Master Teacher" },
        { code: "11", desc: "Lecturer, Senior Lecturer, Professorial Lecturer" },
        { code: "12", desc: "Professor Emeritus" },
        { code: "13", desc: "Visiting Professor (whatever the actual rank)" },
        { code: "14", desc: "Adjunct or affiliate faculty" },
        { code: "20", desc: "Instructor" },
        { code: "30", desc: "Assistant Professor" },
        { code: "40", desc: "Associate Professor" },
        { code: "50", desc: "Full Professor (including University Professor)" },
        { code: "90", desc: "Others" },
        { code: "", desc: "Used by: Col K" }
    ];
    const col7 = [ // Teaching Load
        { code: "00", desc: "No teaching load" },
        { code: "10", desc: "1.0 - 6.0 units per semester" },
        { code: "20", desc: "7.0 - 12.0 units per semester" },
        { code: "30", desc: "13.0 - 18.0 units per semester" },
        { code: "40", desc: "19.0 - 24.0 units per semester" },
        { code: "50", desc: "more than 24 units per semester" },
        { code: "90", desc: "Not known" },
        { code: "", desc: "Used by: Col L" }
    ];
    const col8 = [ // Annual Salary
        { code: "1", desc: "60,000 below" },
        { code: "2", desc: "60,000 - 69,999" },
        { code: "3", desc: "70,000 - 79,999" },
        { code: "4", desc: "80,000 - 89,999" },
        { code: "5", desc: "90,000 - 99,999" },
        { code: "6", desc: "100,000 - 149,999" },
        { code: "7", desc: "150,000 - 249,999" },
        { code: "8", desc: "250,000 - 499,999" },
        { code: "9", desc: "500,000 - UP" },
        { code: "", desc: "Used by: Col N" }
    ];

    const maxRows = Math.max(col1.length, col2.length, col3.length, col4.length, col5.length, col6.length, col7.length, col8.length);

    return (
        <div className="h-full overflow-auto bg-white">
            <table className="w-full border-collapse text-[10px] font-sans">
                <thead className="bg-black text-white sticky top-0 z-10">
                    <tr>
                        <th colSpan={2} className="border border-white/30 px-1 py-1 text-left w-64">Full-Time/Part Time</th>
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
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col1[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col1[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col2[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col2[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-8 text-center">{col3[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col3[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col4[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col4[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col5[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col5[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col6[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col6[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col7[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col7[i]?.desc}</td>
                            
                            <td className="border border-gray-300 px-1 py-0.5 font-bold w-6 text-center">{col8[i]?.code}</td>
                            <td className="border border-gray-300 px-1 py-0.5 whitespace-normal text-left">{col8[i]?.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReferenceTableE2;
