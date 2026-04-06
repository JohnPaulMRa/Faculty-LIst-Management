
export const E5_FIELD_LABELS: Record<string, string> = {
    name: 'Faculty Name (LN, FN, MI)',
    fullTimeCode: 'Full-Time/Part-Time',
    genderCode: 'Gender',
    disciplineCode: 'Primary Teaching Discipline',
    degree: 'Highest Degree Attained',
    bachelorsCode: "Specific Discipline of Bachelors Degree",
    mastersCode: "Specific Discipline of Masters Degree",
    doctorateCode: "Specific Discipline of Doctorate Degree",
    licenseCode: 'Professional License',
    tenureCode: 'Tenure of Employment',
    rankCode: 'Faculty Rank',
    loadCode: 'Teaching Load',
    salaryCode: 'Annual Salary',
    subjects: 'Subjects Taught',
    joined_year: 'Joined Year'
};

/**
 * Returns an array of field labels that are missing based on CHED Form E-5 conditional rules.
 */
export const getMissingE5Fields = (formData: unknown, isE5: boolean): string[] => {
    const missing: string[] = [];

    const isFilled = (val: unknown) => val !== undefined && val !== null && String(val).trim() !== '';
    const getVal = (key: string) => (formData as Record<string, string | undefined>)[key];
    const check = (key: string) => {
        if (!isFilled(getVal(key))) {
            missing.push(E5_FIELD_LABELS[key] || key);
        }
    };

    // 1. Always Required Fields
    const alwaysRequired = ['name', 'fullTimeCode', 'rankCode', 'joined_year'];
    alwaysRequired.forEach(check);

    // 2. E5-Specific Required Fields
    if (isE5) {
        check('genderCode');
    }

    // 3. Degree-Based Validation
    const degree = getVal('degree');
    
    // Bachelor's level (code 507) or higher
    if (degree === '507' || degree?.startsWith('6') || degree?.startsWith('7') || degree?.startsWith('8') || degree?.startsWith('9')) {
        check('bachelorsCode');
    }

    // Master's level (codes starting with 7 or 8) or higher
    if (degree?.startsWith('7') || degree?.startsWith('8') || degree?.startsWith('9')) {
        check('mastersCode');
    }

    // Doctorate level (codes starting with 9)
    if (degree?.startsWith('9')) {
        check('doctorateCode');
    }

    // 4. Workload (Teaching Load) Validation
    const loadCode = getVal('loadCode');
    // If loadCode is NOT empty and NOT "00" (No teaching load)
    if (isFilled(loadCode) && loadCode !== '00') {
        check('subjects');
        check('disciplineCode');
    }

    return missing;
};

/**
 * Returns true if the form is complete based on CHED E-5 rules.
 */
export const isFormE5Complete = (formData: unknown, isE5: boolean): boolean => {
    return getMissingE5Fields(formData, isE5).length === 0;
};
