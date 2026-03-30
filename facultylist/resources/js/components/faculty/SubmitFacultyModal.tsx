import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
                className="sm:max-w-xl p-0 overflow-hidden border-0 shadow-lg rounded-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="px-6 py-6 pb-4">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                            Submit Faculty List
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed text-slate-600">
                            Select the Academic Year you want to submit the faculty list for. Once submitted, the records will be locked for review by the regional office.
                        </p>

                        <div className="grid gap-5 bg-slate-50/50 p-5 rounded-lg border border-slate-100">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Target Academic Year</label>
                                <Select value={submitYear} onValueChange={setSubmitYear}>
                                    <SelectTrigger className="w-full bg-white transition-shadow focus:ring-2 focus:ring-blue-600/20">
                                        <SelectValue placeholder="Select Academic Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableYears && availableYears.length > 0 ? (
                                            availableYears.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-muted-foreground">
                                                No academic years found
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="font-medium text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirmSubmit}
                        disabled={!submitYear}
                        className="bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-600/20"
                    >
                        Submit List
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
