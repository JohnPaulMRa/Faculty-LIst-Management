/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeProgramName } from "@/lib/utils";
import { toast } from "sonner";

interface AddDisciplineFormProps {
    onCancel?: () => void;
    onSubmit: (data: any, onSuccess?: () => void) => void;
    majors: any[];
    processing?: boolean;
    serverPrograms?: any;
}

export default function AddDisciplineForm({ onCancel, onSubmit, majors = [], processing = false, serverPrograms }: AddDisciplineFormProps) {
    const [groupCode, setGroupCode] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [majorCode, setMajorCode] = useState("");
    const [majorDesc, setMajorDesc] = useState("");
    const [specificCode, setSpecificCode] = useState("");
    const [specificDesc, setSpecificDesc] = useState("");
    const [programName, setProgramName] = useState("");

    const groupOptions = useMemo(() => {
        const unique = new Map();
        const majorsArray = Array.isArray(majors) ? majors : [];
        majorsArray.forEach((m: any) => {
            if (!unique.has(m.description)) {
                unique.set(m.description, m.code);
            }
        });
        return Array.from(unique.entries()).map(([label, value]) => ({ label, value }));
    }, [majors]);

    const handleGroupSelect = (code: string) => {
        const majorsArray = Array.isArray(majors) ? majors : [];
        const found = majorsArray.find(m => m.code === code);
        setGroupCode(code);
        setGroupDesc(found?.description ?? "");
        setMajorCode("");
        setMajorDesc("");
        setSpecificCode("");
        setSpecificDesc("");
    };

    const majorOptions = useMemo(() => {
        if (!groupCode) return [];
        const majorsArray = Array.isArray(majors) ? majors : [];
        const group = majorsArray.find(m => m.code === groupCode);
        const allRelevantMajors = group?.groups ?? [];
        const unique = new Map();
        allRelevantMajors.forEach((g: any) => {
            if (!unique.has(g.description)) {
                unique.set(g.description, g.code);
            }
        });
        return Array.from(unique.entries()).map(([label, value]) => ({ label, value }));
    }, [majors, groupCode]);

    const handleMajorSelect = (code: string) => {
        const group = majors.find(m => m.code === groupCode);
        const found = (group?.groups ?? []).find((g: any) => g.code === code);

        setMajorCode(code);
        setMajorDesc(found?.description ?? "");
        setSpecificCode("");
        setSpecificDesc("");
    };

    const specificOptions = useMemo(() => {
        let list: any[] = [];
        const g = groupCode ? majors.find(m => m.code === groupCode) : null;

        // Try to find the major object to get its nested specifics
        let m: any = null;
        if (g) {
            const mByCode = (majorCode && majorCode !== groupCode)
                ? (g.groups ?? []).find((mg: any) => mg.code === majorCode)
                : null;

            const mByDesc = majorDesc
                ? (g.groups ?? []).find((mg: any) => mg.description?.trim().toLowerCase() === majorDesc.trim().toLowerCase())
                : null;

            m = mByCode || mByDesc;
        }

        // If not found in current group, search ALL groups for this major
        if (!m && majorDesc) {
            for (const anyG of majors) {
                const found = (anyG.groups ?? []).find((mg: any) => mg.description?.trim().toLowerCase() === majorDesc.trim().toLowerCase());
                if (found) {
                    m = found;
                    break;
                }
            }
        }

        if (m) {
            list = m.specifics ?? [];
        } else {
            // No major selected or found, keep list empty as per user request for "lazy" loading
            return [];
        }

        // Supplement with existing programs from serverPrograms if available
        if (majorDesc) {
            const existingSpecifics = serverPrograms
                .filter((p: any) => p.major?.trim().toLowerCase() === majorDesc.trim().toLowerCase())
                .map((p: any) => ({ code: p.code, description: p.name }));

            list = [...list, ...existingSpecifics];
        }

        const unique = new Map();
        list.forEach((s: any) => {
            if (s && s.description) {
                const key = s.description.trim().toLowerCase();
                if (!unique.has(key)) {
                    unique.set(key, { label: s.description.trim(), value: s.code });
                }
            }
        });

        return Array.from(unique.values())
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [majors, groupCode, majorCode, majorDesc, serverPrograms]);

    const handleSpecificSelect = (code: string) => {
        let found: any = null;
        let foundGroup: any = null;
        let foundMajor: any = null;

        // Search through all groups and majors to find this specific code
        for (const g of majors) {
            for (const m of (g.groups ?? [])) {
                const s = (m.specifics ?? []).find((spec: any) => spec.code === code);
                if (s) {
                    found = s;
                    foundGroup = g;
                    foundMajor = m;
                    break;
                }
            }
            if (found) break;
        }

        if (found) {
            setSpecificCode(code);
            setSpecificDesc(found.description);
            // Auto-fill parents if not already matching
            if (groupDesc !== foundGroup.description) {
                setGroupCode(foundGroup.code);
                setGroupDesc(foundGroup.description);
            }
            if (majorDesc !== foundMajor.description) {
                setMajorCode(foundMajor.code);
                setMajorDesc(foundMajor.description);
            }
        } else {
            setSpecificCode(code);
            // If not found in our list (free input), just keep the code
        }
    };

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

                                // Sync parent codes (Hierarchy: 2-4-6 digits)
                                const gCode = val.length >= 2 ? val.slice(0, 2) : "";
                                const mCode = val.length >= 4 ? val.slice(0, 4) : "";

                                if (gCode) setGroupCode(gCode);
                                if (mCode) setMajorCode(mCode);

                                // Try to find matching descriptions to auto-fill the comboboxes
                                const foundGroup = gCode ? majors.find(m => m.code === gCode) : null;
                                if (foundGroup) {
                                    setGroupDesc(foundGroup.description);
                                    const foundMajor = mCode ? (foundGroup.groups ?? []).find((g: any) => g.code === mCode) : null;
                                    if (foundMajor) {
                                        setMajorDesc(foundMajor.description);
                                        const foundSpecific = (foundMajor.specifics ?? []).find((s: any) => s.code === val);
                                        if (foundSpecific) {
                                            setSpecificDesc(foundSpecific.description);
                                        }
                                    }
                                }
                            }}
                            className="h-14 bg-slate-50 text-center font-black text-xl focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 border-slate-200 hover:border-blue-400 rounded-xl transition-all shadow-sm text-blue-600"
                            placeholder=" "
                            maxLength={10}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Discipline Group <span className="text-red-500">*</span>
                        </Label>
                        <Combobox
                            options={groupDesc && !groupOptions.find(o => o.value === groupCode || o.label.toLowerCase() === groupDesc.toLowerCase())
                                ? [{ label: groupDesc, value: groupCode }, ...groupOptions]
                                : groupOptions}
                            value={groupCode}
                            onChange={handleGroupSelect}
                            onInputChange={(typed) => {
                                setGroupDesc(typed);
                            }}
                            allowFreeInput
                            placeholder=" "
                            showClear={true}
                            containerClassName="w-full h-12"
                            className="h-full border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
                        />
                    </div>

                    {/* Major Discipline */}
                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Major Discipline <span className="text-red-500">*</span>
                        </Label>
                        <Combobox
                            options={majorDesc && !majorOptions.find(o => o.value === majorCode || o.label.toLowerCase() === majorDesc.toLowerCase())
                                ? [{ label: majorDesc, value: majorCode }, ...majorOptions]
                                : majorOptions}
                            value={majorCode}
                            onChange={handleMajorSelect}
                            onInputChange={(typed) => {
                                setMajorDesc(typed);
                            }}
                            allowFreeInput
                            placeholder=" "
                            showClear={true}
                            containerClassName="w-full h-12"
                            className="h-full border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
                        />
                    </div>

                    {/* Specific Discipline */}
                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Specific Discipline <span className="text-red-500">*</span>
                        </Label>
                        <Combobox
                            options={specificDesc && !specificOptions.find(o => o.value === specificCode || o.label.toLowerCase() === specificDesc.toLowerCase())
                                ? [{ label: specificDesc, value: specificCode }, ...specificOptions]
                                : specificOptions}
                            value={specificCode}
                            onChange={handleSpecificSelect}
                            onInputChange={(typed) => {
                                setSpecificDesc(typed);
                            }}
                            allowFreeInput
                            placeholder=" "
                            showClear={true}
                            containerClassName="w-full h-12"
                            className="h-full border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/10 rounded-xl shadow-sm text-base font-medium transition-all"
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
