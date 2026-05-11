import type { PublicFaculty } from '@/types/faculty';

export const E2_FIELD_LABELS: Record<string, string> = {
    name: 'NAME OF FACULTY ( Last name, first name, middle initial)',
    rank: 'GENERIC FACULTY RANK',
    college: 'HOME COLLEGE',
    department: 'HOME DEPARTMENT',
    is_tenured: 'IS FACULTY MEMBER TENURED?',
    salary_grade: 'SSL SALARY GRADE',
    annual_salary: 'ANNUAL BASIC SALARY',
    on_leave: 'ON LEAVE WITHOUT PAY?',
    fte: 'FULL-TIME EQUIVALENT (FTE)',
    gender: 'GENDER OF FACULTY',
    degree: 'HIGHEST DEGREE ATTAINED',
    pursuing_degree: 'ACTIVELY PURSUING NEXT DEGREE?',
    discipline_load_1: 'SPECIFIC DISCIPLINE (1) OF PRIMARY TEACHING LOAD',
    discipline_load_2: 'SPECIFIC DISCIPLINE (2) OF PRIMARY TEACHING LOAD',
    discipline_bachelors: 'SPECIFIC DISCIPLINE OF BACHELORS DEGREE',
    discipline_masters: 'SPECIFIC DISCIPLINE OF MASTERS DEGREE',
    discipline_doctorate: 'SPECIFIC DISCIPLINE OF DOCTORATE DEGREE',
    masters_thesis: 'MASTERS DEGREE WITH THESIS?',
    doctorate_dissertation: 'DOCTORATE WITH DISSERTATION?',
    ug_lab_units: 'LAB CREDIT UNITS TEACHING Undergrad',
    ug_lec_units: 'LECTURE CREDIT UNITS TEACHING Undergrad',
    ug_total_units: 'TOTAL TEACHING CREDIT UNITS Undergrad (Lab+Lect)',
    ug_lab_hours: 'LAB HOURS PER WEEK TEACHING Undergrad',
    ug_lec_hours: 'LECTURE HOURS PER WEEK TEACHING Undergrad',
    ug_total_hours: 'TOTAL TEACHING HOURS PER WEEK Undergrad',
    ug_lab_contact: 'Student Contact Hours Lab Undergrad',
    ug_lec_contact: 'Student Contact Hours Lecture Undergrad',
    ug_total_contact: 'STUDENT CONTACT-HOURS  Undergrad (Lab+Lect)',
    grad_lab_units: 'LAB CREDIT UNITS TEACHING Graduate Level',
    grad_lec_units: 'LECTURE CREDIT UNITS TEACHING Graduate Level',
    grad_total_units: 'TOTAL TEACHING CREDIT UNITS Graduate (Lab+Lect)',
    grad_lab_contact: 'Student Contact Hours Lab Graduate',
    grad_lec_contact: 'Student Contact Hours Lecture Graduate',
    grad_total_contact: 'STUDENT CONTACT-HOURS Graduate (Lab+Lect)',
    load_research: 'OFFICIAL RESEARCH LOAD',
    load_extension: 'OFFICIAL EXTENSION LOAD',
    load_study: 'OFFICIAL STUDY LOAD',
    load_production: 'OFFICIAL LOAD FOR PRODUCTION',
    load_admin: 'OFFICIAL ADMINISTRATIVE LOAD',
    load_others: 'OTHER OFFICIAL LOAD CREDITS',
    load_total: 'TOTAL WORK LOAD'
};

/**
 * Returns an array of field labels that are missing based on CHED Form E-2 conditional rules.
 */
export const getMissingE2Fields = (formData: Partial<PublicFaculty>): string[] => {
    const missing: string[] = [];

    const isFilled = (val: unknown) => val !== undefined && val !== null && String(val).trim() !== '';
    const getVal = (key: string) => (formData as Record<string, string | undefined>)[key];
    const check = (key: string) => {
        if (!isFilled(getVal(key))) {
            missing.push(E2_FIELD_LABELS[key] || key);
        }
    };

    // 1. Always Required Fields
    const alwaysRequired = [
        'name', 'rank', 'college', 'department', 'gender',
        'is_tenured', 'salary_grade', 'annual_salary', 'fte', 'degree'
    ];
    alwaysRequired.forEach(check);

    // 2. Degree-Based Validation
    const degree = getVal('degree');
    
    // Bachelor's level (code 507) or higher
    if (degree === '507' || degree?.startsWith('7') || degree?.startsWith('8') || degree?.startsWith('9')) {
        check('discipline_bachelors');
    }

    // Master's level (codes starting with 7 or 8) or higher
    if (degree?.startsWith('7') || degree?.startsWith('8') || degree?.startsWith('9')) {
        check('discipline_masters');
    }

    // Doctorate level (codes starting with 9)
    if (degree?.startsWith('9')) {
        check('discipline_doctorate');
        check('doctorate_dissertation');
    }

    // 3. Instructional Workload Validation
    const ugTotalUnits = parseFloat(getVal('ug_total_units') || '0');
    const gradTotalUnits = parseFloat(getVal('grad_total_units') || '0');

    if (ugTotalUnits > 0 || gradTotalUnits > 0) {
        check('discipline_load_1');
    }

    if (ugTotalUnits > 0) {
        check('ug_total_hours');
        check('ug_total_contact');
    }

    if (gradTotalUnits > 0) {
        check('grad_total_contact');
    }

    // 4. Workload Distribution (Conditional)
    // Only validate if they are used (> 0). 
    // The user's request: "Do NOT require these if value is 0 or null."
    // This is already handled by NOT listing them in 'alwaysRequired'.
    // They are updated if filled, but not "missing" if empty.

    return missing;
};

/**
 * Returns true if the form is complete based on CHED E-2 rules.
 */
export const isFormE2Complete = (formData: Partial<PublicFaculty>): boolean => {
    return getMissingE2Fields(formData).length === 0;
};
