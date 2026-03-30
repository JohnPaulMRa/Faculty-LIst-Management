import type { BaseFaculty } from './base';

export type EmploymentType = 'Plantilla' | 'Contract of Service' | 'Part-time';

export type PublicFaculty = BaseFaculty & {
    form_type: 'E2';
    department: string;
    rank: string;
    degree: string;
    employment: EmploymentType;
    import_group?: string;

    // Additional fields for Profile Form E2 (from images)
    gender?: string;
    is_tenured?: string;
    college?: string;
    salary_grade?: string;
    annual_salary?: string;
    pursuing_degree?: string;
    tenured?: string;
    
    // New fields from mapping
    level_code?: string; // ELEM/ SECONDY/ TECH VOC
    on_leave?: string;   // ON LEAVE WITHOUT PAY?
    fte?: string;        // FULL-TIME EQUIVALENT
    
    // Detailed Disciplines
    discipline_load_1?: string;
    discipline_load_2?: string;
    discipline_bachelors?: string;
    discipline_masters?: string;
    discipline_doctorate?: string;

    // Additional Degree Details
    masters_thesis?: string;      // MASTERS DEGREE WITH THESIS?
    doctorate_dissertation?: string; // DOCTORATE WITH DISSERTATION?

    // Workload Metrics - Undergrad (C1-C9)
    ug_lab_units?: string;
    ug_lec_units?: string;
    ug_total_units?: string;
    ug_lab_hours?: string;
    ug_lec_hours?: string;
    ug_total_hours?: string;
    ug_lab_contact?: string;
    ug_lec_contact?: string;
    ug_total_contact?: string;

    // Workload Metrics - Graduate (D1-D9)
    grad_lab_units?: string;
    grad_lec_units?: string;
    grad_total_units?: string;
    grad_lab_contact?: string;
    grad_lec_contact?: string;
    grad_total_contact?: string;

    // Official Credit Load (E1-E7)
    load_research?: string;
    load_extension?: string;
    load_study?: string;
    load_production?: string;
    load_admin?: string;
    load_others?: string;
    load_total?: string;
};




