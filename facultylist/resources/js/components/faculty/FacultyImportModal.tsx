/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileSpreadsheet, UploadCloud } from 'lucide-react';
import type { FC, ChangeEvent } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Combobox } from "@/components/ui/combobox";
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


type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    importType: 'E2' | 'E5';
    setImportType: (type: 'E2' | 'E5') => void;
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
                className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="bg-linear-to-r from-emerald-600 to-green-500 px-8 py-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Import Faculty Data</DialogTitle>
                        <DialogDescription className="text-green-50/90 text-sm mt-1">Select form template, academic year, and upload file.</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="grid gap-6 px-8 py-8">
                    <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">Form Template</Label>
                        {schoolType ? (
                            <div className="flex h-12 w-full items-center px-4 py-2 text-base font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-md shadow-inner">
                                {schoolType.toLowerCase().trim() === 'private' ? 'Private: FORM E5' : 'Public: FORM E2'}
                            </div>
                        ) : (
                            <Combobox
                                value={importType}
                                onChange={(val: any) => setImportType(val)}
                                options={[
                                    { label: 'Private: FORM E5', value: 'E5' },
                                    { label: 'Public: FORM E2', value: 'E2' }
                                ]}
                                placeholder="Select Form"
                                className="h-12 border-slate-200 hover:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-600/20 rounded-md"
                            />
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">Academic Year</Label>
                        <Input
                            value={importYear}
                            onChange={(e) => setImportYear(e.target.value)}
                            placeholder="e.g., 2025-2026"
                            className="h-12 border-slate-200 hover:border-emerald-400 focus-visible:ring-1 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-500 rounded-md text-base px-4"
                        />
                        <p className="text-xs text-slate-500 font-medium italic ml-1 opacity-70">Records will be tagged with this academic year.</p>
                    </div>

                    {/* Group Selection - Removed (Now Automatic) */}
                    <div className="flex flex-col gap-3 pt-2">
                        <div className="relative" onClick={() => fileInputRef.current?.click()}>
                            <div className="flex h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-400 transition-all duration-300 cursor-pointer group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="h-7 w-7 text-emerald-600" />
                                    </div>
                                    <p className="text-base font-bold text-slate-700">Click to upload XLSX/CSV</p>

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
