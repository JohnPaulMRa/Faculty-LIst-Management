import { BaseFaculty } from './base';

export type EmploymentType = 'Plantilla' | 'Contract of Service' | 'Part-time';

export type PublicFaculty = BaseFaculty & {
    form_type: 'E2';
    department: string;
    rank: string;
    degree: string;
    employment: EmploymentType;
    import_group?: string;
};
