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
import { useState, useEffect } from "react";

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

    useEffect(() => {
        if (initialData && isOpen) {
            setGroupCode(initialData.groupCode ?? initialData.code?.slice(0, 2) ?? "");
            setGroupDesc(initialData.groupName ?? initialData.majorDiscipline ?? "");
            setMajorCode(initialData.majorCode ?? initialData.code?.slice(0, 4) ?? "");
            setMajorDesc(initialData.majorName ?? "");
            setSpecificCode(initialData.code ?? "");
            setSpecificDesc(initialData.specificDiscipline ?? "");
        }
    }, [initialData, isOpen]);

    if (!initialData) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            code: specificCode || majorCode,
            majorName: majorDesc,
            specificDiscipline: specificDesc,
            groupDescription: specificDesc || majorDesc,
        });
    };

    const row = (
        label: string,
        code: string, setCode: (v: string) => void,
        desc: string, setDesc: (v: string) => void,
        maxCodeLen = 6
    ) => (
        <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-0.5">
                {label}
            </Label>
            <div className="flex gap-2">
                <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, maxCodeLen))}
                    className="w-24 rounded-none font-mono text-sm text-center border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 shrink-0"
                    placeholder={"0".repeat(maxCodeLen)}
                />
                <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="flex-1 rounded-none text-sm border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                    placeholder={`${label} description...`}
                />
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[520px] rounded-[4px] bg-white"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold">Edit Discipline</DialogTitle>
                    <DialogDescription>Update the details below and click Save Changes.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {row("Discipline Group", groupCode, setGroupCode, groupDesc, setGroupDesc, 2)}
                    {row("Major Discipline", majorCode, setMajorCode, majorDesc, setMajorDesc, 4)}
                    {row("Specific Discipline", specificCode, setSpecificCode, specificDesc, setSpecificDesc, 6)}

                    <DialogFooter className="pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="rounded-none border-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-none bg-black text-white hover:bg-gray-800 disabled:opacity-60">
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
