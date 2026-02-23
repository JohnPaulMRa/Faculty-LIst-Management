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
}

const FacultyDownloadModal: FC<FacultyDownloadModalProps> = ({ isOpen, onOpenChange }) => {


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
                className="sm:max-w-4xl bg-white text-black p-0 overflow-hidden rounded-none"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-2xl font-bold text-[#003468]">Download Template</DialogTitle>
                    <DialogDescription className="text-gray-500 text-base">
                        Select which form template you would like to download.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 p-6 pt-2">
                    <Button
                        onClick={() => handleDownloadTemplate('E2')}
                        variant="outline"
                        className="flex flex-col items-center justify-center h-32 gap-3 border-dashed border-2 border-gray-300 text-[#003468] hover:border-[#003468] hover:bg-gray-100 transition-all rounded-md shadow-sm"
                    >
                        <FileSpreadsheet className="h-12 w-12 text-[#003468]" />
                        <span className="text-lg font-bold text-[#003468]">Public: FORM E2</span>
                    </Button>

                    <Button
                        onClick={() => handleDownloadTemplate('E5')}
                        variant="outline"
                        className="flex flex-col items-center justify-center h-32 gap-3 border-dashed border-2 border-gray-300 text-[#003468] hover:border-[#003468] hover:bg-gray-100 transition-all rounded-md shadow-sm"
                    >
                        <FileSpreadsheet className="h-12 w-12 text-[#003468]" />
                        <span className="text-lg font-bold text-[#003468]">Private: FORM E5</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FacultyDownloadModal;
