import { ChevronDown, FileSpreadsheet, UploadCloud } from 'lucide-react';
import type { FC, ChangeEvent } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Faculty, IMPORT_GROUP_OPTIONS } from '@/types/faculty';
import AcademicYearSelect from '@/components/common/AcademicYearSelect';


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
    schoolType?: string;
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
    onFileImport,
    schoolType
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
                <Button variant="outline" className="border-green-500 bg-green-500 text-white hover:border-green-500 hover:bg-green-300 hover:text-gray-500 font-medium shadow-sm gap-2 rounded-md h-9 px-3">
                    <FileSpreadsheet className="h-4 w-4" /> Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-2xl rounded-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Import Faculty Data</DialogTitle>
                    <DialogDescription>Select form template, academic year, and upload file.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-8">
                    <div className="space-y-2">
                        <Label>Form Template</Label>
                        {schoolType ? (
                            <div className="flex h-9 w-full items-center px-3 py-2 text-sm font-medium bg-gray-100 border border-gray-200 text-gray-700">
                                {schoolType.toLowerCase().trim() === 'private' ? 'Private: FORM E5' : 'Public: FORM E2'}
                            </div>
                        ) : (
                            <Select value={importType} onValueChange={(val: any) => setImportType(val)}>
                                <SelectTrigger><SelectValue placeholder="Select Form" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="E5">Private: FORM E5</SelectItem>
                                    <SelectItem value="E2">Public: FORM E2</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Input
                            value={importYear}
                            onChange={(e) => setImportYear(e.target.value)}
                            placeholder="e.g., 2025-2026"
                            className="rounded-none w-full"
                        />
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
