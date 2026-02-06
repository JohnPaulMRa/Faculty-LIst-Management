import { FC } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Faculty } from '@/types/faculty';
import FacultyFormE2 from './FacultyFormE2';
import FacultyFormE5 from './FacultyFormE5';

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: Faculty | null;
    onSave: (faculty: Faculty) => void;
    referenceData: any;
};

const FacultyFileDetailsModal: FC<Props> = ({ isOpen, onOpenChange, faculty, onSave, referenceData }) => {
    const getStatusBadge = (status: string): string => {
        const styles: Record<string, string> = {
            'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'No Submission': 'bg-red-100 text-red-700 border-red-200',
            'Not Yet Completed': 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[95vw] w-[95vw] max-h-[95vh] flex flex-col p-0 gap-0 border-none outline-none bg-white [&>button]:hidden rounded-none overflow-hidden">
                <div className="flex justify-end p-0 absolute top-0 right-0 z-50">
                    <DialogTitle className="sr-only">Faculty File Details</DialogTitle>
                     {/* Close button is automatically added by DialogContent usually, but we might need to style it or ensure z-index */}
                </div>
                
                {faculty && (
                    <div className="flex-1 overflow-hidden p-0 bg-white relative">
                        {faculty.form_type === 'E2' ? (
                            <div className="h-full w-full overflow-hidden">
                                <FacultyFormE2 
                                    faculty={faculty} 
                                    onSave={(data) => onSave({ ...faculty, ...data } as Faculty)}
                                    referenceData={referenceData} 
                                />
                            </div>
                        ) : faculty.form_type === 'E5' ? (
                            <div className="h-full w-full overflow-hidden">
                                <FacultyFormE5 
                                    faculty={faculty} 
                                    onSave={(data) => onSave({ ...faculty, ...data } as Faculty)}
                                    referenceData={referenceData}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Unknown Form Type
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FacultyFileDetailsModal;
