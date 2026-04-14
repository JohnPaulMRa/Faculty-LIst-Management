/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddDisciplineFormProps {
    onCancel?: () => void;
    onSubmit: (data: any, onSuccess?: () => void) => void;
    majors: any[];
    processing?: boolean;
}

export default function AddDisciplineForm({ onCancel, onSubmit, majors = [], processing = false }: AddDisciplineFormProps) {
    const [groupCode, setGroupCode] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [majorCode, setMajorCode] = useState("");
    const [majorDesc, setMajorDesc] = useState("");
    const [specificCode, setSpecificCode] = useState("");
    const [specificDesc, setSpecificDesc] = useState("");

    const groupOptions = useMemo(() => {
        const unique = new Map();
        majors.forEach((m: any) => {
            if (!unique.has(m.description)) {
                unique.set(m.description, m.code);
            }
        });
        return Array.from(unique.entries()).map(([label, value]) => ({ label, value }));
    }, [majors]);

    const handleGroupSelect = (code: string) => {
        const found = majors.find(m => m.code === code);
        setGroupCode(code);
        setGroupDesc(found?.description ?? "");
        setMajorCode(code);    // pre-fill major prefix
        setMajorDesc("");
        setSpecificCode(code); // pre-fill specific prefix
        setSpecificDesc("");
    };

    const majorOptions = useMemo(() => {
        if (!groupDesc) return [];
        const allRelevantMajors = majors
            .filter(m => m.description === groupDesc)
            .flatMap(m => m.groups ?? []);

        const unique = new Map();
        allRelevantMajors.forEach((g: any) => {
            if (!unique.has(g.description)) {
                unique.set(g.description, g.code);
            }
        });
        return Array.from(unique.entries()).map(([label, value]) => ({ label, value }));
    }, [majors, groupDesc]);

    const handleMajorSelect = (code: string) => {
        const allRelevantMajors = majors
            .filter(m => m.description === groupDesc)
            .flatMap(m => m.groups ?? []);

        const found = allRelevantMajors.find((g: any) => g.code === code);
        setMajorCode(code);
        setMajorDesc(found?.description ?? "");
        setSpecificCode(code); // pre-fill specific code prefix
        setSpecificDesc("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked!");
        if (!groupCode) { alert("Please select or enter a Discipline Group."); return; }

        const hasMajor = !!(majorCode && majorDesc);
        const hasSpecific = !!(specificCode && specificDesc);

        console.log("Validation check:", { hasMajor, hasSpecific, majorCode, majorDesc, specificCode, specificDesc });

        if (!hasMajor && !hasSpecific) {
            alert("Please provide at least a Major Discipline (name and code) or a Specific Discipline (name and code).");
            return;
        }

        if (majorDesc && !majorCode) {
            alert("Major Discipline code is required.");
            return;
        }

        if (specificDesc && !specificCode) {
            alert("Specific Discipline code is required.");
            return;
        }

        const finalCode = hasSpecific ? specificCode : majorCode;
        onSubmit({
            code: finalCode,
            groupName: groupDesc,
            majorName: majorDesc,
            specificDiscipline: specificDesc || null,
        }, () => {
            // On success: preserve group + major selection, clear only the specific code/name
            // so the admin can quickly add another specific under the same group/major
            setSpecificCode("");
            setSpecificDesc("");
        });
    };

    const clearForm = () => {
        setMajorCode(""); setMajorDesc("");
        setSpecificCode(""); setSpecificDesc("");
    };

    return (
        <div className="bg-white border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-[70px_1fr_1fr_1fr] gap-4 items-end">
                    {/* Code */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={specificCode}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase();
                                setSpecificCode(val);

                                // Sync parent codes
                                const gCode = val.length >= 2 ? val.slice(0, 2) : val;
                                const mCode = val.length >= 6 ? val.slice(0, 6) : (val.length >= 4 ? val.slice(0, 4) : val);

                                setGroupCode(gCode);
                                setMajorCode(mCode);

                                // Try to find matching descriptions to auto-fill the comboboxes
                                const foundGroup = majors.find(m => m.code === gCode);
                                if (foundGroup) {
                                    setGroupDesc(foundGroup.description);
                                    const foundMajor = (foundGroup.groups ?? []).find((g: any) => g.code === mCode);
                                    if (foundMajor) {
                                        setMajorDesc(foundMajor.description);
                                    }
                                }
                            }}
                            className="h-10 rounded-none font-mono text-lg text-center border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-400"
                            placeholder=""
                            maxLength={10}
                        />
                    </div>

                    {/* Discipline Group */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Discipline Group <span className="text-red-500">*</span>
                        </Label>
                        <Combobox
                            options={groupOptions}
                            value={groupCode}
                            onChange={handleGroupSelect}
                            onInputChange={(typed) => {
                                setGroupDesc(typed);
                            }}
                            allowFreeInput
                            placeholder=""
                            containerClassName="w-full h-10"
                            className="h-full rounded-none border border-gray-500 text-sm"
                        />
                    </div>

                    {/* Major Discipline */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Major Discipline <span className="text-red-500">*</span>
                        </Label>
                        <Combobox
                            options={majorOptions}
                            value={majorCode}
                            onChange={handleMajorSelect}
                            onInputChange={(typed) => {
                                setMajorDesc(typed);
                            }}
                            allowFreeInput
                            placeholder=""
                            containerClassName="w-full h-10"
                            className="h-full rounded-none border border-gray-500 text-sm"
                        />
                    </div>

                    {/* Specific Discipline */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Specific Discipline <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={specificDesc}
                            onChange={(e) => setSpecificDesc(e.target.value)}
                            className="h-10 rounded-none text-lg border-gray-500 focus-visible:ring-1 focus-visible:ring-gray-400"
                            placeholder=""
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
