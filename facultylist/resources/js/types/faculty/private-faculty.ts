import type { BaseFaculty } from './base';

export type PrivateFaculty = BaseFaculty & {
    form_type: 'E5';
    fullTimeCode?: string;
    genderCode?: string;
    disciplineCode?: string;
    degree?: string; // Mapped from highest_degree_code
    bachelorsCode?: string;
    bachelors?: string;
    mastersCode?: string;
    masters?: string;
    doctorateCode?: string;
    doctorate?: string;
    licenseCode?: string;
    tenureCode?: string;
    rankCode?: string;
    salaryCode?: string;
    loadCode?: string;
    subjects?: string;
    employment?: null; // Usually null for E5 in current implementation
};
