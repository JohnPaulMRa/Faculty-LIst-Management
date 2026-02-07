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
import { Input } from '@/components/ui/input';
import { Faculty, IMPORT_GROUP_OPTIONS } from '@/types/faculty';
import { FC, useRef, ChangeEvent } from 'react';


type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    importType: 'E2' | 'E5';
    setImportType: (type: 'E2' | 'E5') => void;
    importGroup: string;
    setImportGroup: (group: string) => void;
    importYear: string;
    setImportYear: (year: string) => void;
    onFileImport: (file: File) => void;
};

const FacultyImportModal: FC<Props> = ({ 
    isOpen, 
    onOpenChange, 
    importType, 
    setImportType, 
    importGroup,
    setImportGroup,
    importYear,
    setImportYear,
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
                    <DialogDescription>Select form template, academic year, and upload file.</DialogDescription>
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

                    <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <div className="relative">
                                <Input 
                                    value={importYear} 
                                    readOnly 
                                    disabled
                                    className="bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
                                />
                            </div>
                            <p className="text-xs text-gray-500">Records will be tagged with this academic year.</p>
                        </div>
                    
                    {/* Group Selection - ONLY for E2 */}
                    {importType === 'E2' && (
                        <div className="space-y-2">
                            <Label>Group</Label>
                            <Select value={importGroup} onValueChange={setImportGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {IMPORT_GROUP_OPTIONS
                                        .filter(opt => opt.includes('GROUP A'))
                                        .map((option) => (
                                            <SelectItem key={option} value={option.replace('GROUP ', '')}>
                                                {option}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">Select the specific group for this batch of faculty records.</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <div className="relative" onClick={() => fileInputRef.current?.click()}>
                            <div className="flex h-32 w-full flex-col items-center justify-center rounded-none border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
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
