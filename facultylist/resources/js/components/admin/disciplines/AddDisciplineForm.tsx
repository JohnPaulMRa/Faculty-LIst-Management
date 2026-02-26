import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { useState, useMemo, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface AddDisciplineFormProps {
    onCancel?: () => void;
    onSubmit: (data: any) => void;
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

    const groupOptions = useMemo(() =>
        majors
            .map((m: any) => ({ label: `${m.code} - ${m.description}`, value: m.code })),
        [majors]
    );

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
        const group = majors.find(m => m.code === groupCode);
        return (group?.groups ?? []).map((g: any) => ({
            label: `${g.code} - ${g.description}`,
            value: g.code,
        }));
    }, [majors, groupCode]);

    const handleMajorSelect = (code: string) => {
        const group = majors.find(m => m.code === groupCode);
        const found = (group?.groups ?? []).find((g: any) => g.code === code);
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

        if (majorDesc && (!majorCode || majorCode.length < 4)) {
            alert("Major Discipline code must be at least 4 digits.");
            return;
        }

        if (specificDesc && (!specificCode || specificCode.length < 6)) {
            alert("Specific Discipline code must be at least 6 digits.");
            return;
        }

        const finalCode = hasSpecific ? specificCode : majorCode;
        onSubmit({
            code: finalCode,
            majorName: majorDesc,
            specificDiscipline: specificDesc || null,
        });

        // Reset form after successful local submission logic (Parent will handle actual API call and state)
        // Wait for parent success if needed, but usually we reset or parent closes it.
    };

    const clearForm = () => {
        setGroupCode(""); setGroupDesc("");
        setMajorCode(""); setMajorDesc("");
        setSpecificCode(""); setSpecificDesc("");
    };

    return (
        <div className="bg-white border border-gray-200 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900"> New Discipline</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in the details. Add major and specific discipline.
                    </p>
                </div>
                {onCancel && (
                    <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-none">
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Discipline Group */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Discipline Group <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                value={groupCode}
                                readOnly
                                className="w-20 h-10 rounded-none font-mono text-xs text-center border-gray-300 bg-gray-50 shrink-0"
                                placeholder="code"
                            />
                            <Combobox
                                options={groupOptions}
                                value={groupCode}
                                onChange={handleGroupSelect}
                                placeholder="Select Group..."
                                containerClassName="flex-1 h-10"
                                className="h-full rounded-none border border-gray-300 text-sm"
                            />
                        </div>
                    </div>

                    {/* Major Discipline */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Major Discipline <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                value={majorCode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    setMajorCode(val);
                                    setSpecificCode(val);
                                }}
                                className="w-20 h-10 rounded-none font-mono text-xs text-center border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 shrink-0"
                                placeholder="code"
                                minLength={3}
                                maxLength={10}
                            />
                            <Combobox
                                options={majorOptions}
                                value={majorCode}
                                onChange={handleMajorSelect}
                                onInputChange={(typed) => {
                                    setMajorDesc(typed);
                                    // If manually typing, we don't clear the code, allowing the user to provide a new code.
                                }}
                                allowFreeInput
                                placeholder={majorOptions.length > 0 ? "Select or type..." : "Enter name..."}
                                containerClassName="flex-1 h-10"
                                className="h-full rounded-none border border-gray-300 text-sm"
                            />
                        </div>
                    </div>

                    {/* Specific Discipline */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Specific Discipline <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                value={specificCode}
                                onChange={(e) => setSpecificCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                className="w-20 h-10 rounded-none font-mono text-xs text-center border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 shrink-0"
                                placeholder="code"
                                minLength={3}
                                maxLength={10}
                            />
                            <Input
                                value={specificDesc}
                                onChange={(e) => setSpecificDesc(e.target.value)}
                                className="flex-1 h-10 rounded-none text-sm border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                                placeholder="Enter name..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={clearForm}
                        disabled={processing}
                        className="rounded-none border-gray-300 h-10 px-6 text-xs uppercase tracking-wider font-semibold"
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="rounded-none bg-black text-white hover:bg-gray-800 disabled:opacity-60 h-10 px-8 text-xs uppercase tracking-wider font-semibold flex gap-2"
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
