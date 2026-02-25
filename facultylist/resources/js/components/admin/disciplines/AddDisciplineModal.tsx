import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { useState, useMemo, useEffect } from "react";

interface AddDisciplineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    majors: any[];
    processing?: boolean;
}

export default function AddDisciplineModal({ isOpen, onClose, onSubmit, majors = [], processing = false }: AddDisciplineModalProps) {
    const [groupCode, setGroupCode] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [majorCode, setMajorCode] = useState("");
    const [majorDesc, setMajorDesc] = useState("");
    const [specificCode, setSpecificCode] = useState("");
    const [specificDesc, setSpecificDesc] = useState("");

    // Reset form every time the modal opens
    useEffect(() => {
        if (isOpen) {
            setGroupCode(""); setGroupDesc("");
            setMajorCode(""); setMajorDesc("");
            setSpecificCode(""); setSpecificDesc("");
        }
    }, [isOpen]);

    const groupOptions = useMemo(() =>
        majors
            .filter(m => m.code !== "00" && !m.description?.toUpperCase().includes("GENERAL"))
            .map((m: any) => ({ label: `${m.code} - ${m.description}`, value: m.code })),
        [majors]
    );

    // When a group is selected from the combobox, populate the code + desc boxes
    const handleGroupSelect = (code: string) => {
        const found = majors.find(m => m.code === code);
        setGroupCode(code);
        setGroupDesc(found?.description ?? "");
        setMajorCode(code);    // pre-fill major prefix
        setMajorDesc("");
        setSpecificCode(code); // pre-fill specific prefix
        setSpecificDesc("");
    };

    // Existing major disciplines for the selected group
    const majorOptions = useMemo(() => {
        const group = majors.find(m => m.code === groupCode);
        return (group?.groups ?? []).map((g: any) => ({
            label: `${g.code} - ${g.description}`,
            value: g.code,
        }));
    }, [majors, groupCode]);

    // When an existing major is selected from the combobox
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
        if (!groupCode) { alert("Please select or enter a Discipline Group."); return; }
        if (!majorCode || !majorDesc) { alert("Please enter the Major Discipline code and name."); return; }

        const finalCode = specificDesc ? specificCode : majorCode;
        onSubmit({
            code: finalCode,
            majorName: majorDesc,
            specificDiscipline: specificDesc || null,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] rounded-none bg-white">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold">Add Discipline</DialogTitle>
                    <DialogDescription>
                        Fill in the details. A specific discipline is optional — you can add a major only.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Discipline Group */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Discipline Group <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                value={groupCode}
                                readOnly
                                className="w-28 h-11 rounded-none font-mono text-sm text-center border-gray-300 bg-gray-50 shrink-0"
                                placeholder="code"
                            />
                            <Combobox
                                options={groupOptions}
                                value={groupCode}
                                onChange={handleGroupSelect}
                                placeholder="Select Group..."
                                containerClassName="flex-1 h-11"
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
                                    setMajorCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                                    setSpecificCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                                }}
                                className="w-28 h-11 rounded-none font-mono text-sm text-center border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 shrink-0"
                                placeholder="code"
                                maxLength={4}
                            />
                            <Combobox
                                options={majorOptions}
                                value={majorCode}
                                onChange={handleMajorSelect}
                                onInputChange={(typed) => {
                                    const matched = majorOptions.find((o: { label: string; value: string }) => o.label.toLowerCase() === typed.toLowerCase());
                                    if (!matched) setMajorDesc(typed);
                                }}
                                allowFreeInput
                                placeholder={majorOptions.length > 0 ? "Select or type new major..." : "Enter Major Discipline name..."}
                                containerClassName="flex-1 h-11"
                                className="h-full rounded-none border border-gray-300 text-sm uppercase"
                            />
                        </div>
                    </div>

                    {/* Specific Discipline */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                            Specific Discipline <span className="text-gray-400 font-normal">(optional)</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                value={specificCode}
                                onChange={(e) => setSpecificCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                className="w-28 h-11 rounded-none font-mono text-sm text-center border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 shrink-0"
                                placeholder="code"
                                maxLength={6}
                            />
                            <Input
                                value={specificDesc}
                                onChange={(e) => setSpecificDesc(e.target.value)}
                                className="flex-1 h-11 rounded-none uppercase text-sm border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                                placeholder="Enter Specific Discipline name..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="rounded-none border-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-none bg-black text-white hover:bg-gray-800 disabled:opacity-60">
                            {processing ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
