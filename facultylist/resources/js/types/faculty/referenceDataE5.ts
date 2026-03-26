export interface ReferenceOption {
    code: string;
    desc: string;
}

export const GENDER_OPTIONS: ReferenceOption[] = [
    { code: "1", desc: "Male" },
    { code: "2", desc: "Female" }
];

export const HIGHEST_DEGREE_OPTIONS: ReferenceOption[] = [
    { code: "000", desc: "No formal education at all" },
    { code: "101", desc: "Partial elementary schooling but did not complete Grade 4" },
    { code: "102", desc: "Completed Grade 4 but did not graduate from elementary school" },
    { code: "103", desc: "Completed Elementary School" },
    { code: "201", desc: "Partial completion of High School" },
    { code: "202", desc: "Secondary school graduate or equivalent" },
    { code: "301", desc: "Partial completion of High School" },
    { code: "302", desc: "Completed Tech/Voc" },
    { code: "401", desc: "Partial completion of pre-baccalaureate certificate, diploma or associateship" },
    { code: "402", desc: "Completed pre-bacc certificate, diploma or associateship" },
    { code: "501", desc: "Completed Year 1 of baccalaureate level or equivalent" },
    { code: "502", desc: "Completed Year 2 of baccalaureate level or equivalent" },
    { code: "503", desc: "Completed Year 3 of baccalaureate level or equivalent" },
    { code: "504", desc: "Completed Year 4 of baccalaureate level or equivalent" },
    { code: "505", desc: "Completed Year 5 of baccalaureate level or equivalent" },
    { code: "506", desc: "Completed Year 6 of baccalaureate level or equivalent" },
    { code: "507", desc: "Completed a baccalaureate degree (including DVM, DDM, D Opt)" },
    { code: "601", desc: "Partial Completion of postgraduate certificate or diploma program" },
    { code: "602", desc: "Completed post-grad certificate or diploma program" },
    { code: "701", desc: "Completed Year 1 of MD or LLB (or equivalent)" },
    { code: "702", desc: "Completed Year 2 of MD or LLB (or equivalent)" },
    { code: "703", desc: "Completed Year 3 of MD or LLB (or equivalent)" },
    { code: "704", desc: "Completed Year 4 of MD or LLB (or equivalent)" },
    { code: "705", desc: "Completed MD or LLB (or equivalent)" },
    { code: "801", desc: "Partial completion of masters degree" },
    { code: "802", desc: "Completed all masters requirements" },
    { code: "803", desc: "Completed masters degree or equivalent (or equivalent)" },
    { code: "901", desc: "Partial completion of doctorate degree (or equivalent)" },
    { code: "902", desc: "Completed all doctorate requirements except dissertation (or equivalent)" },
    { code: "903", desc: "Completed doctoratedegree (or equivalent)" },
    { code: "980", desc: "NOT A FACULTY MEMBER" },
    { code: "999", desc: "No record" }
];

export const PROFESSIONAL_LICENSE_OPTIONS: ReferenceOption[] = [
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
    { code: "13", desc: "PRC in Electronics & Communication Engineering or the equivalent" },
    { code: "14", desc: "PRC in Environmental Planning or the equivalent" },
    { code: "15", desc: "PRC in Fisheries Technology or the equivalent" },
    { code: "16", desc: "PRC in Forestry or the equivalent" },
    { code: "17", desc: "PRC in Geodetic Engineering or the equivalent" },
    { code: "18", desc: "PRC in Geology or the equivalent" },
    { code: "19", desc: "PRC in Interior Design or the equivalent" },
    { code: "20", desc: "PRC in Landscape Architecture or the equivalent" },
    { code: "21", desc: "Supreme Court Bar Examinations or the equivalent" },
    { code: "22", desc: "PRC in Librarian or the equivalent" },
    { code: "23", desc: "PRC in LET-Elementary or the equivalent" },
    { code: "24", desc: "PRC in LET-Secondary or the equivalent" },
    { code: "25", desc: "PRC in Marine Deck Office or the equivalent" },
    { code: "26", desc: "PRC in Marine Engine Officer or the equivalent" },
    { code: "27", desc: "PRC in Master Plumber or the equivalent" },
    { code: "28", desc: "PRC in Mechanical Engineering or the equivalent" },
    { code: "29", desc: "PRC in Medical Technology or the equivalent" },
    { code: "30", desc: "PRC in Physician or the equivalent" },
    { code: "31", desc: "PRC in Metallurgical Engineering or the equivalent" },
    { code: "32", desc: "PRC in Midwifery or the equivalent" },
    { code: "33", desc: "PRC in Mining Engineering or the equivalent" },
    { code: "34", desc: "PRC in Naval Architecture and Marine Engineering or the equivalent" },
    { code: "35", desc: "PRC in Nursing or the Equivalent" },
    { code: "36", desc: "PRC in Nutrition & Dietetics or the equivalent" },
    { code: "37", desc: "PRC in Occupational Therapy or the equivalent" },
    { code: "38", desc: "PRC in Optometry or the equivalent" },
    { code: "39", desc: "PRC in Pharmacy or the equivalent" },
    { code: "40", desc: "PRC in Physical Therapy or the equivalent" },
    { code: "41", desc: "PRC in Radiological Technology or the equivalent" },
    { code: "42", desc: "PRC in Sanitary Engineering or the equivalent" },
    { code: "43", desc: "PRC in Social Work or the equivalent" },
    { code: "44", desc: "PRC in Sugar Technology or the equivalent" },
    { code: "45", desc: "PRC in Veterinary medicine or the equivalent" },
    { code: "46", desc: "PRC in X-Ray Technology or the equivalent" },
    { code: "47", desc: "PRC or Civil Service (prior to 1995) in Teacher Education" },
    { code: "90", desc: "No licensure earned." },
    { code: "99", desc: "No record or not known" }
];

export const TENURE_OPTIONS: ReferenceOption[] = [
    { code: "1", desc: "Permanent" },
    { code: "2", desc: "Probationary" },
    { code: "3", desc: "Casual" },
    { code: "4", desc: "Contractual" }
];

export const FACULTY_RANK_OPTIONS: ReferenceOption[] = [
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
    { code: "90", desc: "Others" }
];

export const TEACHING_LOAD_OPTIONS: ReferenceOption[] = [
    { code: "00", desc: "No teaching load" },
    { code: "10", desc: "1.0 - 6.0 units per semester" },
    { code: "20", desc: "7.0 - 12.0 units per semester" },
    { code: "30", desc: "13.0 - 18.0 units per semester" },
    { code: "40", desc: "19.0 - 24.0 units per semester" },
    { code: "50", desc: "more than 24 units per semester" },
    { code: "90", desc: "Not known" }
];

export const ANNUAL_SALARY_OPTIONS: ReferenceOption[] = [
    { code: "1", desc: "60,000 below" },
    { code: "2", desc: "60,000 - 69,999" },
    { code: "3", desc: "70,000 - 79,999" },
    { code: "4", desc: "80,000 - 89,999" },
    { code: "5", desc: "90,000 - 99,999" },
    { code: "6", desc: "100,000 - 149,999" },
    { code: "7", desc: "150,000 - 249,999" },
    { code: "8", desc: "250,000 - 499,999" },
    { code: "9", desc: "500,000 - UP" }
];

export const FT_PT_OPTIONS: ReferenceOption[] = [
    { code: '1', desc: 'The person is a full-time employee of the HEI.' },
    { code: '2', desc: 'The person is a half-time employee of the HEI.' },
    { code: '3', desc: 'Student employee such as Student Assistant or Graduate Assistant.' },
    { code: '4', desc: 'Teaching Fellow, Associate or Assistant.' },
    { code: '5', desc: 'None of the above and therefore part-time. This includes: lecturers (all ranks), adjunct or affiliate faculty, visiting professors, professors emeriti, Physicians on call, lawyers or accountants on retainer basis, etc.' },
    { code: '9', desc: 'Not known or not indicated.' },
];
