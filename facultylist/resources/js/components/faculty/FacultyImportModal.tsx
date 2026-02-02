import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronDown, FileSpreadsheet, UploadCloud } from 'lucide-react';
import { Faculty } from '@/types/faculty';
import { FC, useRef, ChangeEvent } from 'react';

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    importType: 'E2' | 'E5';
    setImportType: (type: 'E2' | 'E5') => void;
    onFileImport: (file: File) => void;
};

const FacultyImportModal: FC<Props> = ({ 
    isOpen, 
    onOpenChange, 
    importType, 
    setImportType, 
    onFileImport
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            onFileImport(file);
            event.target.value = ''; 
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-green-700 hover:text-green-800 hover:bg-green-50 border-green-200">
                    <FileSpreadsheet className="h-4 w-4" /> Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import Faculty Data</DialogTitle>
                    <DialogDescription>Select form template and upload file. Group will be detected automatically.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Form Template</Label>
                        <Select value={importType} onValueChange={(val: any) => setImportType(val)}>
                            <SelectTrigger><SelectValue placeholder="Select Form" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="E5">FORM E-5: Private / LUC</SelectItem>
                                <SelectItem value="E2">FORM E-2: Public / SUC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Auto-detect Group Visualization */}
                    <div className="space-y-2">
                        <Label>Group</Label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500 italic flex justify-between items-center">
                            <span>Auto-detecting from file...</span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium not-italic">Auto</span>
                        </div>
                        <p className="text-xs text-gray-500">The system will automatically identify the group from the uploaded file header.</p>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                        <div className="relative" onClick={() => fileInputRef.current?.click()}>
                            <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload XLSX/CSV</p>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FacultyImportModal;
