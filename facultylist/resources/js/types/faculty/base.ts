export type FacultyStatus = 'Completed' | 'No Submission' | 'Not Yet Completed' | 'Updated' | 'Not Updated';

export type BaseFaculty = {
    id: string;
    name: string;
    email: string;
    status: FacultyStatus;
    avatar_initials: string;
    joined_year: string;
};
