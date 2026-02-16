export interface School {
    id: number;
    name: string;
    code: string | null;
    address: string | null;
    contact_number: string | null;
    email: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type SchoolForm = Omit<School, 'id' | 'created_at' | 'updated_at'>;
