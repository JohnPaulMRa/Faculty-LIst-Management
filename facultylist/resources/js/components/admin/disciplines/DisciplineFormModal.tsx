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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface DisciplineItem {
    id: number;
    code: string;
    group: string;
    majorDiscipline: string;
    specificDiscipline: string;
    type?: 'group' | 'specific';
    groupDescription?: string;
}

interface DisciplineFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: DisciplineItem | null;
    majors?: any[]; // Passed from parent
}

export default function DisciplineFormModal({ isOpen, onClose, onSubmit, initialData, majors = [] }: DisciplineFormModalProps) {
    const [formData, setFormData] = useState({
        code: "",
        group: "",
        majorDiscipline: "",
        specificDiscipline: "",
        groupDescription: ""
    });

    const [addType, setAddType] = useState<'group' | 'specific'>('specific');
    const [selectedMajorCode, setSelectedMajorCode] = useState<string>("");
    const [selectedGroupCode, setSelectedGroupCode] = useState<string>("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                group: initialData.group,
                majorDiscipline: initialData.majorDiscipline,
                specificDiscipline: initialData.specificDiscipline || "",
                groupDescription: initialData.groupDescription || ""
            });
            // Could try to reverse-lookup major/group codes if needed, but for edit we might just stick to text or pre-fill
            // For now, let's keep Edit as is (text inputs largely) or if user wants purely Add flow changed.
            // The request specifically said "on the Add Discipline". So I will only apply dropdowns for ADD mode.
        } else {
            setFormData({
                code: "",
                group: "",
                majorDiscipline: "",
                specificDiscipline: "",
                groupDescription: ""
            });
            setAddType('specific');
            setSelectedMajorCode("");
            setSelectedGroupCode("");
        }
    }, [initialData, isOpen]);

    // Handle Major Selection
    const handleMajorChange = (code: string) => {
        setSelectedMajorCode(code);
        setSelectedGroupCode(""); // Reset group
        const major = majors.find(m => m.code === code);
        if (major) {
            setFormData(prev => ({
                ...prev,
                majorDiscipline: major.description,
                code: code, // Start code with major code
                group: ""
            }));
        }
    };

    // Handle Group Selection
    const handleGroupChange = (code: string) => {
        setSelectedGroupCode(code);
        const major = majors.find(m => m.code === selectedMajorCode);
        const group = major?.groups.find((g: any) => g.code === code);
        if (group) {
            setFormData(prev => ({
                ...prev,
                group: group.code,
                groupDescription: group.description,
                code: group.code // Start code with group code
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const effectiveIsGroup = initialData ? initialData.type === 'group' : addType === 'group';

    // Helper to get groups for selected major
    const activeMajor = majors.find(m => m.code === selectedMajorCode);
    const activeGroups = activeMajor ? activeMajor.groups : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-none bg-white">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold">{initialData ? (effectiveIsGroup ? 'Edit Group Discipline' : 'Edit Specific Discipline') : 'Add Discipline'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Update the details below.' : 'Enter the details for the new discipline.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="px-6 py-4 grid gap-5">

                    {/* ADD MODE: Type Selection */}
                    {!initialData && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Type</Label>
                            <div className="col-span-3 flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="addType" checked={addType === 'specific'} onChange={() => setAddType('specific')} className="accent-black" />
                                    <span className="text-sm">Specific Discipline</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="addType" checked={addType === 'group'} onChange={() => setAddType('group')} className="accent-black" />
                                    <span className="text-sm">Discipline Group</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* ADD MODE: Major Dropdown */}
                    {!initialData && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Major Disc.</Label>
                            <div className="col-span-3">
                                <Select value={selectedMajorCode} onValueChange={handleMajorChange}>
                                    <SelectTrigger className="rounded-none">
                                        <SelectValue placeholder="Select Major Discipline" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {majors.map((m: any) => (
                                            <SelectItem key={m.code} value={m.code}>
                                                <span className="font-mono font-bold mr-2">{m.code}</span>
                                                {m.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* EDIT MODE: Major Input (Read-onlyish) */}
                    {initialData && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="major" className="text-right">Major Disc.</Label>
                            <Input id="major" value={formData.majorDiscipline} readOnly className="col-span-3 rounded-none bg-gray-50" />
                        </div>
                    )}

                    {/* ADD MODE: Group Dropdown (If Specific Type selected) */}
                    {!initialData && addType === 'specific' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Group</Label>
                            <div className="col-span-3">
                                <Select value={selectedGroupCode} onValueChange={handleGroupChange} disabled={!selectedMajorCode}>
                                    <SelectTrigger className="rounded-none">
                                        <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {activeGroups.map((g: any) => (
                                            <SelectItem key={g.code} value={g.code}>
                                                <span className="font-mono font-bold mr-2">{g.code}</span>
                                                {g.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* ADD MODE: Group Code Display */}
                    {!initialData && selectedGroupCode && addType === 'specific' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Group Code</Label>
                            <div className="col-span-3 font-mono text-sm font-bold pl-3 py-2 bg-gray-50 border border-gray-100">
                                {selectedGroupCode}
                            </div>
                        </div>
                    )}


                    {/* ADD MODE: New Group Name (If Group Type selected) */}
                    {!initialData && addType === 'group' && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newGroupCode" className="text-right">New Group Code</Label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="font-mono bg-gray-100 px-2 py-2 text-sm">{selectedMajorCode || 'XX'}</span>
                                    <Input
                                        id="newGroupCode"
                                        placeholder="01"
                                        className="rounded-none w-20"
                                        maxLength={2}
                                        value={formData.code.slice(2)}
                                        onChange={(e) => setFormData({ ...formData, code: (selectedMajorCode || '') + e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="groupDesc" className="text-right">Group Name</Label>
                                <Input
                                    id="groupDesc"
                                    value={formData.groupDescription}
                                    onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
                                    className="col-span-3 rounded-none"
                                    placeholder="e.g. Science Education"
                                />
                            </div>
                        </>
                    )}


                    {/* ADD MODE: Specific Discipline Input */}
                    {(!initialData && addType === 'specific') && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newSpecificCode" className="text-right">New Specific Code</Label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <span className="font-mono bg-gray-100 px-2 py-2 text-sm">{selectedGroupCode || 'XXXX'}</span>
                                    <Input
                                        id="newSpecificCode"
                                        placeholder="01"
                                        className="rounded-none w-20"
                                        maxLength={2}
                                        value={formData.code.slice(4)}
                                        onChange={(e) => setFormData({ ...formData, code: (selectedGroupCode || '') + e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="specific" className="text-right">Specific Disc.</Label>
                                <Input
                                    id="specific"
                                    value={formData.specificDiscipline}
                                    onChange={(e) => setFormData({ ...formData, specificDiscipline: e.target.value })}
                                    className="col-span-3 rounded-none"
                                    placeholder="e.g. Teaching Math"
                                />
                            </div>
                        </>
                    )}

                    {/* EDIT MODE: Legacy Fields (Keep as is for editing) */}
                    {initialData && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="code" className="text-right">Code</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="col-span-3 rounded-none"
                                />
                            </div>
                            {effectiveIsGroup ? (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="groupDesc" className="text-right">Group Name</Label>
                                    <Input
                                        id="groupDesc"
                                        value={formData.groupDescription}
                                        onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
                                        className="col-span-3 rounded-none"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="specific" className="text-right">Specific Disc.</Label>
                                    <Input
                                        id="specific"
                                        value={formData.specificDiscipline}
                                        onChange={(e) => setFormData({ ...formData, specificDiscipline: e.target.value })}
                                        className="col-span-3 rounded-none"
                                    />
                                </div>
                            )}
                        </>
                    )}


                    <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-none border-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-none bg-black text-white hover:bg-gray-800">
                            {initialData ? (effectiveIsGroup ? 'Save Group' : 'Save Specific') : (effectiveIsGroup ? 'Create Group' : 'Create Specific')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
