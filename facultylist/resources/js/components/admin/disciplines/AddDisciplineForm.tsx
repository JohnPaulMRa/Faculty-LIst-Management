/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// Removed Combobox import as it is no longer used
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeProgramName } from "@/lib/utils";

interface AddDisciplineFormProps {
    onCancel?: () => void;
    onSubmit: (data: any, onSuccess?: () => void) => void;
    processing?: boolean;
}

export default function AddDisciplineForm({ onCancel, onSubmit, processing = false }: AddDisciplineFormProps) {
    const [groupCode, setGroupCode] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [majorCode, setMajorCode] = useState("");
    const [majorDesc, setMajorDesc] = useState("");
    const [specificCode, setSpecificCode] = useState("");
    const [specificDesc, setSpecificDesc] = useState("");
    const [programName, setProgramName] = useState("");

    // Selection handlers removed as Comboboxes were replaced with Inputs

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked!");
        if (!groupCode) { toast.warning("Please select or enter a Discipline Group."); return; }

        const hasMajor = !!(majorCode && majorDesc);
        const hasSpecific = !!(specificCode && specificDesc);

        console.log("Validation check:", { hasMajor, hasSpecific, majorCode, majorDesc, specificCode, specificDesc });

        if (!hasMajor && !hasSpecific) {
            toast.warning("Please provide at least a Major Discipline (name and code) or a Specific Discipline (name and code).");
            return;
        }

        if (majorDesc && !majorCode) {
            toast.warning("Major Discipline code is required.");
            return;
        }

        if (specificDesc && !specificCode) {
            toast.warning("Specific Discipline code is required.");
            return;
        }

        const finalCode = hasSpecific ? specificCode : majorCode;
        const normalizedProgram = normalizeProgramName(programName);

        onSubmit({
            code: finalCode,
            groupName: groupDesc,
            majorName: majorDesc,
            specificDiscipline: specificDesc || null,
            program: normalizedProgram || null,
        }, () => {
            // On success: preserve group + major selection, clear only the specific code/name
            // so the admin can quickly add another specific under the same group/major
            setSpecificCode("");
            setSpecificDesc("");
            setProgramName("");
        });
    };

    const clearForm = () => {
        setGroupCode(""); setGroupDesc("");
        setMajorCode(""); setMajorDesc("");
        setSpecificCode(""); setSpecificDesc("");
        setProgramName("");
    };

    return (
        <div className="bg-white border border-gray-100 p-8 mb-8 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900"> New Discipline</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in the details. Add major and specific discipline.
                    </p>
                </div>
                {onCancel && (
                    <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-xl">
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr] gap-6 items-end">
                    {/* Code */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-gray-600 uppercase tracking-wider ml-1">
                            Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={specificCode}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
                                setSpecificCode(val);

                                // Sync parent codes (Hierarchy: 2-4-6 digits) but removed description auto-filling
                                const gCode = val.length >= 2 ? val.slice(0, 2) : "";
                                const mCode = val.length >= 4 ? val.slice(0, 4) : "";

                                if (gCode) setGroupCode(gCode);
                                if (mCode) setMajorCode(mCode);
                            }}
                            className="h-12 bg-slate-50 text-center font-bold text-base focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 border-slate-200 hover:border-blue-400 rounded-xl transition-all shadow-sm text-blue-600"
                            placeholder=" "
                            maxLength={10}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Discipline Group <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={groupDesc}
                            onChange={(e) => setGroupDesc(e.target.value)}
                            className="h-12 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
                            placeholder="Enter Discipline Group"
                        />
                    </div>

                    {/* Major Discipline */}
                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Major Discipline <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={majorDesc}
                            onChange={(e) => setMajorDesc(e.target.value)}
                            className="h-12 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
                            placeholder="Enter Major Discipline"
                        />
                    </div>

                    {/* Specific Discipline */}
                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Specific Discipline <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={specificDesc}
                            onChange={(e) => setSpecificDesc(e.target.value)}
                            className="h-12 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
                            placeholder="Enter Specific Discipline"
                        />
                    </div>

                    {/* Program */}
                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Program <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={programName}
                            onChange={(e) => setProgramName(e.target.value)}
                            className="h-12 border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
                            placeholder="e.g. BS in Information Technology"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={clearForm}
                        disabled={processing}
                        className="rounded-xl border-gray-300 h-10 px-6 text-xs uppercase tracking-wider font-semibold shadow-sm"
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 h-10 px-8 text-xs uppercase tracking-wider font-semibold flex gap-2 shadow-sm"
                    >
                        {processing ? "Saving..." : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add Discipline
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
