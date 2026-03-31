/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
                className="sm:max-w-xl p-0 overflow-hidden border-0 shadow-lg rounded-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="px-6 py-6 pb-4">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                            Copy Faculty Data
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed text-slate-600">
                            Duplicate all faculty records from a previous academic year into a new one. This allows you to quickly set up profiles for the new year.
                        </p>

                        <div className="grid gap-5 bg-slate-50/50 p-5 rounded-lg border border-slate-100">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Source Academic Year</label>
                                <Select value={sourceYear} onValueChange={setSourceYear}>
                                    <SelectTrigger className="w-full bg-white transition-shadow focus:ring-2 focus:ring-blue-600/20">
                                        <SelectValue placeholder="Select year to copy from" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableYears.length > 0 ? (
                                            // Show only the latest academic year as source
                                            (() => {
                                                const sorted = [...availableYears].sort((a, b) => (a > b ? -1 : 1));
                                                const latestYear = sorted[0];
                                                return <SelectItem key={latestYear} value={latestYear}>{latestYear}</SelectItem>;
                                            })()
                                        ) : (
                                            <SelectItem value="none" disabled>No previous records found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Target Academic Year</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2024-2025"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                    value={customTargetYear}
                                    onChange={(e) => setCustomTargetYear(e.target.value)}
                                />
                                <p className="text-[13px] text-slate-500 font-medium ml-1">Example: 2024-2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="font-medium text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCopy}
                        className="bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-600/20"
                        disabled={!sourceYear || (!targetYear && !customTargetYear) || isSubmitting}
                    >
                        {isSubmitting ? 'Copying Records...' : 'Copy Records'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
