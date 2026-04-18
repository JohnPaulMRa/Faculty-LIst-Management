import { FileSpreadsheet } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { downloadTemplateE2 } from './facultyE2/downloadTemplateE2';
import { downloadTemplateE5 } from './facultyE5/downloadTemplateE5';

interface FacultyDownloadModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    schoolType?: string;
}

const FacultyDownloadModal: FC<FacultyDownloadModalProps> = ({ isOpen, onOpenChange, schoolType }) => {


    const handleDownloadTemplate = (type: 'E2' | 'E5'): void => {
        if (type === 'E2') {
            downloadTemplateE2();
        } else {
            downloadTemplateE5();
        }

        onOpenChange(false); // Close modal after download
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] px-8 py-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Download Template</DialogTitle>
                        <DialogDescription className="text-blue-50/90 text-sm mt-1">
                            Select which form template you would like to download.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="grid gap-6 p-8">
                    {(schoolType?.toLowerCase().trim() === 'public' || !schoolType) && (
                        <Button
                            onClick={() => handleDownloadTemplate('E2')}
                            variant="outline"
                            className="flex flex-col items-center justify-center h-40 gap-4 border-dashed border-2 border-slate-200 text-[#003468] hover:border-[#003468] hover:bg-blue-50/30 transition-all duration-300 rounded-2xl group shadow-sm"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="h-8 w-8 text-[#003468]" />
                            </div>
                            <div className="text-center">
                                <span className="block text-lg font-bold text-[#003468]">Public: FORM E2</span>
                                <span className="text-xs text-slate-500 font-medium">Standard format for Public HEIs</span>
                            </div>
                        </Button>
                    )}

                    {(schoolType?.toLowerCase().trim() === 'private' || !schoolType) && (
                        <Button
                            onClick={() => handleDownloadTemplate('E5')}
                            variant="outline"
                            className="flex flex-col items-center justify-center h-40 gap-4 border-dashed border-2 border-slate-200 text-[#003468] hover:border-[#003468] hover:bg-blue-50/30 transition-all duration-300 rounded-2xl group shadow-sm"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileSpreadsheet className="h-8 w-8 text-[#003468]" />
                            </div>
                            <div className="text-center">
                                <span className="block text-lg font-bold text-[#003468]">Private: FORM E5</span>
                                <span className="text-xs text-slate-500 font-medium">Standard format for Private HEIs</span>
                            </div>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FacultyDownloadModal;
