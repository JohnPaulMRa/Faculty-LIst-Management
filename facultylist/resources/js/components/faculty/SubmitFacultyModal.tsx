import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/combobox';

interface SubmitFacultyModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    submitYear: string;
    setSubmitYear: (year: string) => void;
    availableYears: string[];
    onConfirmSubmit: () => void;
}

export function SubmitFacultyModal({
    isOpen,
    onOpenChange,
    submitYear,
    setSubmitYear,
    availableYears,
    onConfirmSubmit,
}: SubmitFacultyModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] px-8 py-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            Submit Faculty List
                        </DialogTitle>
                    </DialogHeader>
                </div>
                <div className="px-8 py-8">

                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed text-slate-600">
                            Select the Academic Year you want to submit the faculty list for. Once submitted, the records will be locked for review by the regional office.
                        </p>

                        <div className="grid gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                            <div className="space-y-3">
                                <label className="text-base font-bold text-slate-600 uppercase tracking-wider ml-1">Target Academic Year</label>
                                <Combobox
                                    value={submitYear}
                                    onChange={setSubmitYear}
                                    options={(availableYears || []).map((year) => ({
                                        label: year,
                                        value: year
                                    }))}
                                    placeholder="Select Academic Year"
                                    className="w-full h-12 bg-white border-slate-200 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-600/20 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-slate-50 px-8 py-5 border-t border-slate-100">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-6 font-semibold text-slate-600 border-slate-300 hover:bg-slate-100 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirmSubmit}
                        disabled={!submitYear}
                        className="bg-[#003468] text-white hover:bg-[#1a4f8c] font-bold shadow-lg shadow-blue-900/10 rounded-xl h-11 px-8 transition-all active:scale-[0.98]"
                    >
                        Submit List
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}
