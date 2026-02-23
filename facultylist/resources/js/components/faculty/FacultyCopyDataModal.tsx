import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface FacultyCopyDataModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    availableYears: string[];
    onSuccess?: () => void;
    onError?: (errors: any) => void;
}

export function FacultyCopyDataModal({ isOpen, onOpenChange, availableYears, onSuccess, onError }: FacultyCopyDataModalProps) {
    const [sourceYear, setSourceYear] = useState<string>('');
    const [targetYear, setTargetYear] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter out the source year from target options to prevent copying to itself
    const targetYears = availableYears.filter(year => year !== sourceYear);

    // Also suggest next year if needed, for now just use available or let user type one?
    // Hardcoded next year logic could be added, but a text input might be better for "Target Year" if it doesn't exist yet.
    // Let's use a simple Select for Source, and maybe an Input or Select for Target.
    // Given the app's style, let's keep it simple:

    const [customTargetYear, setCustomTargetYear] = useState<string>('');

    const handleCopy = () => {
        if (!sourceYear) return;

        const finalTargetYear = customTargetYear.trim() || targetYear;

        if (!finalTargetYear) return;

        setIsSubmitting(true);
        router.post(route('faculty.copyData'), {
            source_year: sourceYear,
            target_year: finalTargetYear
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                setIsSubmitting(false);
                onOpenChange(false);
                if (onSuccess) onSuccess();
            },
            onError: (errors: any) => {
                setIsSubmitting(false);
                if (onError) onError(errors);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-4xl rounded-none"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-[#003468]">Copy Faculty Data</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <p className="text-sm text-gray-600">
                        Copy all faculty records from a previous academic year into a new one. This will duplicate their profiles so you can update them for the new year.
                    </p>

                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-gray-700">Copy From (Source Year)</label>
                        <Select value={sourceYear} onValueChange={setSourceYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Source Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableYears.length > 0 ? (
                                    availableYears.map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>No years available</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-gray-700">Copy To (Target Year)</label>
                        <input
                            type="text"
                            placeholder="e.g. 2024-2025"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={customTargetYear}
                            onChange={(e) => setCustomTargetYear(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Enter the new academic year format (e.g., 2024-2025).</p>
                    </div>
                </div>
                <DialogFooter className="gap-3 sm:gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="text-[#003468] border-[#003468] hover:bg-gray-100 shadow-sm">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCopy}
                        className="bg-[#003468] text-white hover:bg-[#002a54]"
                        disabled={!sourceYear || (!targetYear && !customTargetYear) || isSubmitting}
                    >
                        {isSubmitting ? 'Copying...' : 'Copy Data'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
