import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
                className="sm:max-w-4xl rounded-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-[#003468]">Submit Faculty List</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-2">
                    <p className="text-sm text-gray-600">
                        Select the Academic Year you want to submit the faculty list for:
                    </p>
                    <Select value={submitYear} onValueChange={setSubmitYear}>
                        <SelectTrigger className="w-full">
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
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="text-[#003468] border-[#003468] hover:bg-gray-100 shadow-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirmSubmit}
                        disabled={!submitYear}
                        className="bg-[#003468] text-white hover:bg-[#002a54]"
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
