/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/combobox';

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
                className="sm:max-w-xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="bg-linear-to-r from-blue-700 to-indigo-600 px-8 py-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            Copy Faculty Data
                        </DialogTitle>
                    </DialogHeader>
                </div>
                <div className="px-8 py-8">

                    <div className="space-y-6">
                        <p className="text-sm leading-relaxed text-slate-600">
                            Duplicate all faculty records from a previous academic year into a new one. This allows you to quickly set up profiles for the new year.
                        </p>

                        <div className="grid gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                            <div className="space-y-3">
                                <label className="text-base font-bold text-slate-600 uppercase tracking-wider ml-1">Source Academic Year</label>
                                <Combobox
                                    value={sourceYear}
                                    onChange={setSourceYear}
                                    options={availableYears.length > 0 ? (
                                        (() => {
                                            const sorted = [...availableYears].sort((a, b) => (a > b ? -1 : 1));
                                            const latestYear = sorted[0];
                                            return [{ label: latestYear, value: latestYear }];
                                        })()
                                    ) : []}
                                    placeholder="Select year to copy from"
                                    className="w-full h-12 bg-white border-slate-200 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-600/20 rounded-md"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-base font-bold text-slate-600 uppercase tracking-wider ml-1">Target Academic Year</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 2024-2025"
                                    className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-base shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                    value={customTargetYear}
                                    onChange={(e) => setCustomTargetYear(e.target.value)}
                                />
                                <p className="text-[13px] text-slate-500 font-medium italic ml-1 opacity-70">Example format: 2024-2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 bg-slate-50 px-8 py-5 border-t border-slate-100">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="h-11 px-6 font-semibold text-slate-600 border-slate-300 hover:bg-slate-100 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCopy}
                        className="bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-600/20 rounded-xl h-11 px-8 transition-all active:scale-[0.98]"
                        disabled={!sourceYear || (!targetYear && !customTargetYear) || isSubmitting}
                    >
                        {isSubmitting ? 'Copying Records...' : 'Copy Records'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
