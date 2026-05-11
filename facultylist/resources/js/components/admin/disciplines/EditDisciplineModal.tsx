/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
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
import { normalizeProgramName } from "@/lib/utils";

interface EditDisciplineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null;
    processing?: boolean;
}

export default function EditDisciplineModal({ isOpen, onClose, onSubmit, initialData, processing = false }: EditDisciplineModalProps) {
    const [groupCode, setGroupCode] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [majorCode, setMajorCode] = useState("");
    const [majorDesc, setMajorDesc] = useState("");
    const [specificCode, setSpecificCode] = useState("");
    const [specificDesc, setSpecificDesc] = useState("");
    const [programName, setProgramName] = useState("");

    useEffect(() => {
        if (initialData && isOpen) {
            const isSpecific = initialData.type === 'specific';
            const isMajor = initialData.type === 'major';

            setGroupCode(initialData.groupCode ?? initialData.code?.slice(0, 2) ?? "");
            setGroupDesc(initialData.groupName ?? initialData.majorDiscipline ?? "");
            
            // Major fields
            setMajorCode(isMajor || isSpecific ? (initialData.majorCode ?? initialData.code?.slice(0, 4) ?? "") : "");
            setMajorDesc(initialData.majorName ?? (isMajor ? initialData.description : ""));
            
            // Specific fields
            setSpecificCode(isSpecific ? (initialData.code ?? "") : "");
            setSpecificDesc(isSpecific ? (initialData.specificDiscipline ?? initialData.description ?? "") : "");
            setProgramName(initialData.program ?? initialData.originalData?.program ?? "");
        }
    }, [initialData, isOpen]);

    if (!initialData) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            code: specificCode || majorCode || groupCode,
            groupName: groupDesc,
            majorName: majorDesc,
            specificDiscipline: specificDesc,
            program: normalizeProgramName(programName),
        });
    };

    const row = (
        label: string,
        code: string, setCode: (v: string) => void,
        desc: string, setDesc: (v: string) => void,
        maxCodeLen = 6
    ) => (
        <div className="space-y-2">
            <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                {label}
            </Label>
            <div className="flex gap-3">
                <div className="shrink-0 h-12 w-32 bg-gray-50 border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-700 uppercase rounded-md px-3 text-center shadow-inner">
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, maxCodeLen))}
                        className="border-none bg-transparent font-bold text-lg p-0 focus-visible:ring-0 text-center w-full"
                        placeholder={"0".repeat(maxCodeLen)}
                    />
                </div>
                <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="flex-1 h-12 border-gray-300 hover:border-gray-400 focus-visible:ring-1 focus-visible:ring-[#003468]/20 focus-visible:border-[#003468] rounded-md text-base"
                    placeholder={`${label} description...`}
                />
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[600px] rounded-2xl bg-white shadow-2xl p-0 overflow-hidden border-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100 bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white">
                    <DialogTitle className="text-2xl font-bold tracking-tight">Edit Discipline</DialogTitle>
                    <DialogDescription className="text-blue-100 opacity-90">Update the details below and click Save Changes.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {row("Discipline Group", groupCode, setGroupCode, groupDesc, setGroupDesc, 2)}
                    {row("Major Discipline", majorCode, setMajorCode, majorDesc, setMajorDesc, 4)}
                    {row("Specific Discipline", specificCode, setSpecificCode, specificDesc, setSpecificDesc, 10)}

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">
                            Program
                        </Label>
                        <Input
                            value={programName}
                            onChange={(e) => setProgramName(e.target.value)}
                            className="h-12 border-gray-300 hover:border-gray-400 focus-visible:ring-1 focus-visible:ring-[#003468]/20 focus-visible:border-[#003468] rounded-md text-base"
                            placeholder="Program name..."
                        />
                    </div>

                    <DialogFooter className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="rounded-xl border-gray-300 h-12 px-6 font-semibold uppercase tracking-wider text-xs shadow-sm">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-xl bg-[#003468] text-white hover:bg-[#1a4f8c] disabled:opacity-60 h-12 px-8 font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-900/10">
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
