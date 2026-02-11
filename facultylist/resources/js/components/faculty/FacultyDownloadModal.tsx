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
            <DialogContent className="sm:max-w-[425px] bg-white text-black p-0 overflow-hidden rounded-md">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-[#003468]">Download Template</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Select which form template you would like to download.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 p-6 pt-2">
                    <Button 
                        onClick={() => handleDownloadTemplate('E2')}
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-2 border-dashed border-2 hover:border-[#003468] hover:bg-blue-50 transition-all rounded-md"
                    >
                        <FileSpreadsheet className="h-8 w-8 text-green-600" />
                        <span className="font-semibold text-gray-700">Form E-2 (Public/SUC)</span>
                    </Button>

                    <Button 
                        onClick={() => handleDownloadTemplate('E5')}
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-2 border-dashed border-2 hover:border-[#003468] hover:bg-blue-50 transition-all rounded-md"
                    >
                        <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                        <span className="font-semibold text-gray-700">Form E-5 (Private/LUC)</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FacultyDownloadModal;
