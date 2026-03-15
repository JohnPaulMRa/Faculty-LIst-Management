export interface Hei {
    id: number;
    name: string;
    hei_code: string | null;
    address: string | null;
    contact_number: string | null;
    email: string | null;
    is_active: boolean;
    type: 'Public' | 'Private';
    created_at: string;
    updated_at: string;
}

export type HeiForm = Omit<Hei, 'id' | 'created_at' | 'updated_at'>;
