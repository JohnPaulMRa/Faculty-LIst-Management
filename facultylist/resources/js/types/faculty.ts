export type Faculty = {
    id: string;
    name: string;
    email: string;
    department: string;
    rank: string;
    degree: string;
    status: 'Completed' | 'No Submission' | 'Not Yet Completed'; 
    employment: 'Plantilla' | 'Contract of Service' | 'Part-time';
    avatar_initials: string;
    joined_year: string;
    form_type: 'E2' | 'E5';
    import_group?: string; 
    
    // Form E5 Specific Fields (Optional)
    fullTimeCode?: string;
    genderCode?: string;
    disciplineCode?: string;
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
};

export const IMPORT_GROUP_OPTIONS = [
    "GROUP A1", "GROUP A2", "GROUP A3", 
    "GROUP B", 
    "GROUP C1", "GROUP C2", "GROUP C3", 
    "GROUP D",
    "GROUP E"
] as const;
