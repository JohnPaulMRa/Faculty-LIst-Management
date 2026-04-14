/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from '@inertiajs/react';
import { Save, X, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FacultyProfileCardsE2 } from '@/components/faculty/facultyE2/FacultyProfileCardsE2';

interface PublicEditSubmissionModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    selectedFaculty: any;
    referenceData: any;
}

export function PublicEditSubmissionModal({ isOpen, onClose, selectedFaculty, referenceData }: PublicEditSubmissionModalProps) {
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (selectedFaculty) {
            setFormData({
                ...selectedFaculty,
            });
        }
    }, [selectedFaculty]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!selectedFaculty?.id) return;

        setIsSaving(true);
        router.put(`/faculty/${selectedFaculty.id}`, formData, {
            onSuccess: () => {
                setIsSaving(false);
                onClose(false);
                router.reload();
            },
            onError: (errors: any) => {
                setIsSaving(false);
                console.error('Update failed', errors);
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[95vw] sm:max-w-[1700px] w-full max-h-[95vh] overflow-y-auto p-0 gap-0 rounded-[4px] [&>button]:hidden bg-white"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-2 sticky top-0 bg-white z-10 border-b border-gray-200 shadow-sm">
                    <DialogTitle className="text-2xl font-bold flex items-center justify-between text-[#003468]">
                        <div className="flex items-center gap-3">
                            <span className="bg-[#003468] text-white p-2 rounded-lg">
                                <Save className="h-5 w-5" />
                            </span>
                            <span>Edit Faculty Submission (FORM E-2)</span>
                        </div>
                        <button
                            onClick={() => onClose(false)}
                            className="rounded-full p-2 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                        >
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </button>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-8">
                    {formData && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <FacultyProfileCardsE2
                                formData={formData}
                                handleChange={handleChange}
                                readOnly={false}
                                referenceData={referenceData}
                            />

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <Button
                                    variant="outline"
                                    onClick={() => onClose(false)}
                                    className="px-8 h-12 font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-100 rounded-xl"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="px-10 h-12 font-bold uppercase tracking-wider bg-linear-to-r from-[#003468] to-[#1a4f8c] hover:opacity-90 shadow-lg hover:shadow-[#003468]/20 transition-all rounded-xl"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-5 w-5" />
                                            Update Submission
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
