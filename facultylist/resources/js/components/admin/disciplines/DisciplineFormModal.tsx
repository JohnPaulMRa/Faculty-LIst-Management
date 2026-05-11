/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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

interface DisciplineItem {
    id: number;
    code: string;
    group: string;
    majorDiscipline: string;
    specificDiscipline: string;
    type?: 'group' | 'specific' | 'major';
    groupDescription?: string;
    groupName?: string;
    groupCode?: string;
    majorCode?: string;
    majorName?: string;
}

interface DisciplineFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: DisciplineItem | null;
    majors?: any[];
    processing?: boolean;
}

export default function DisciplineFormModal({ isOpen, onClose, onSubmit, initialData, majors = [], processing = false }: DisciplineFormModalProps) {
    const [formData, setFormData] = useState({
        code: "",
        group: "",
        majorDiscipline: "",
        specificDiscipline: "",
        groupDescription: "",
        groupName: "",   // Discipline GROUP name (editable)
        groupCode: "",   // Discipline GROUP code (read-only FK)
        majorCode: "",   // Major Discipline code (read-only FK)
        majorName: "",   // Major Discipline name (editable)
    });

    const [parentGroupCode, setParentGroupCode] = useState<string>("");
    const [majorSubCode, setMajorSubCode] = useState<string>("");
    const [specificSubCode, setSpecificSubCode] = useState<string>("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                group: initialData.group || '',
                majorDiscipline: initialData.majorDiscipline || '',
                specificDiscipline: initialData.specificDiscipline || '',
                groupDescription: initialData.groupDescription || initialData.majorName || '',
                groupName: initialData.groupName || initialData.majorDiscipline || '',
                groupCode: initialData.groupCode || '',
                majorCode: initialData.majorCode || initialData.group || '',
                majorName: initialData.majorName || initialData.groupDescription || '',
            });
        } else {
            setFormData({
                code: '', group: '', majorDiscipline: '',
                specificDiscipline: '', groupDescription: '',
                groupName: '', groupCode: '', majorCode: '', majorName: '',
            });
            setParentGroupCode('');
            setMajorSubCode('');
            setSpecificSubCode('');
        }
    }, [initialData, isOpen]);

    const handleParentGroupChange = (code: string) => {
        setParentGroupCode(code);
        setMajorSubCode("");
        setSpecificSubCode("");
        const group = majors.find(m => m.code === code);
        if (group) {
            setFormData(prev => ({
                ...prev,
                groupName: group.description,
                groupCode: code,
                code: code,
                majorCode: "",
                majorName: "",
                specificDiscipline: ""
            }));
        }
    };

    // Handle Parent Major Selection Helper (Level 2)
    const handleMajorSelectHelper = (code: string) => {
        const group = majors.find(m => m.code === parentGroupCode);
        const major = group?.groups.find((g: any) => g.code === code);
        if (major) {
            const subCode = major.code.substring(2);
            setMajorSubCode(subCode);
            setFormData(prev => ({
                ...prev,
                majorCode: major.code,
                majorName: major.description,
                groupDescription: major.description,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Final code assembly: Group (2) + Major (2) + Specific (2 or 0)
        let finalCode = parentGroupCode + (majorSubCode || "00");
        if (specificSubCode) {
            finalCode += specificSubCode;
        }

        const dataToSubmit = {
            ...formData,
            code: finalCode,
            majorDiscipline: formData.majorName,
            groupDescription: formData.majorName,
        };

        onSubmit(dataToSubmit);
    };

    const effectiveIsGroup = initialData ? (initialData.type === 'group' || initialData.type === 'major') : false;

    // Helper to get majors for selected group, filtering out dummy/general records
    const activeMajors = useMemo(() => {
        const activeGroup = majors.find(m => m.code === parentGroupCode);
        return activeGroup
            ? activeGroup.groups.filter((m: any) => m.code !== '0000' && !m.description.toUpperCase().includes('GENERAL'))
            : [];
    }, [majors, parentGroupCode]);

    // Filter Groups for Level 1 selection
    const filteredGroups = majors.filter(m => m.code !== '00' && !m.description.toUpperCase().includes('GENERAL'));

    // Memoize options for Combobox
    const groupOptions = useMemo(() => filteredGroups.map((m: any) => ({
        label: `${m.code} - ${m.description}`,
        value: m.code
    })), [filteredGroups]);

    const majorOptions = useMemo(() => {
        return activeMajors.map((m: any) => ({
            label: `${m.code} - ${m.description}`,
            value: m.code
        }));
    }, [activeMajors]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[600px] rounded-2xl bg-white shadow-2xl p-0 overflow-hidden border-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-8 pt-8 pb-6 border-b border-gray-100 bg-linear-to-r from-[#003468] to-[#1a4f8c] text-white">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {initialData ? 'Edit Discipline' : (specificSubCode ? 'Add Specific Discipline' : 'Add Discipline')}
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 opacity-90">
                        {initialData ? 'Update the details below.' : (specificSubCode ? 'Enter the details for the specific discipline.' : 'Enter the details for the major discipline.')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="px-8 py-8 grid gap-8">

                    {/* ADD MODE: Clean Hierarchical Entry */}
                    {!initialData && (
                        <div className="space-y-6">
                            {/* Level 1: Group */}
                            <div className="space-y-2">
                                <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">Discipline Group</Label>
                                <Combobox
                                    options={groupOptions}
                                    value={parentGroupCode}
                                    onChange={handleParentGroupChange}
                                    placeholder="Select Group"
                                    className="border-gray-300 hover:border-gray-400 focus-within:border-[#003468] focus-within:ring-1 focus-within:ring-[#003468]/20 rounded-md shadow-none h-12"
                                />
                            </div>

                            {/* Level 2: Major */}
                            <div className="space-y-2">
                                <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">Major Discipline</Label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.majorName}
                                            onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                                            className="h-12 border-gray-300 hover:border-gray-400 focus-visible:ring-1 focus-visible:ring-[#003468]/20 focus-visible:border-[#003468] rounded-md"
                                            placeholder="Enter Major name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 h-12 shrink-0 rounded-md shadow-inner">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CODE</span>
                                        <Input
                                            className="w-10 h-8 border-none bg-transparent font-bold text-base p-0 focus-visible:ring-0 text-center text-gray-700"
                                            maxLength={2}
                                            value={majorSubCode}
                                            onChange={(e) => setMajorSubCode(e.target.value)}
                                            placeholder="--"
                                        />
                                    </div>
                                </div>
                                <div className="px-2">
                                    <p className="text-[10px] text-gray-400 font-mono tracking-tight">Full Prefix: <span className="text-[#003468] font-bold">{parentGroupCode || '??'}</span><span className="text-blue-500 font-bold">{majorSubCode || '??'}</span></p>
                                </div>
                            </div>

                            {/* Level 3: Specific */}
                            <div className="space-y-2">
                                <Label className="text-base font-bold text-gray-600 uppercase tracking-wider ml-1">Specific Discipline (Optional)</Label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.specificDiscipline}
                                            onChange={(e) => setFormData({ ...formData, specificDiscipline: e.target.value })}
                                            className="h-12 border-gray-300 hover:border-gray-400 focus-visible:ring-1 focus-visible:ring-[#003468]/20 focus-visible:border-[#003468] rounded-md"
                                            placeholder="Enter Specific name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 h-12 shrink-0 rounded-md shadow-inner">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CODE</span>
                                        <Input
                                            className="w-10 h-8 border-none bg-transparent font-bold text-base p-0 focus-visible:ring-0 text-center text-gray-700"
                                            maxLength={2}
                                            value={specificSubCode}
                                            onChange={(e) => setSpecificSubCode(e.target.value)}
                                            placeholder="--"
                                        />
                                    </div>
                                </div>
                                <div className="px-2">
                                    <p className="text-[10px] text-gray-400 font-mono tracking-tight">Full Code: <span className="text-[#003468] font-bold">{parentGroupCode || '??'}</span><span className="text-blue-400 font-bold">{majorSubCode || '??'}</span><span className="text-blue-300 font-bold">{specificSubCode || '??'}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDIT MODE: All fields editable — codes + descriptions */}
                    {initialData && (
                        <div className="space-y-6">
                            {/* Level 1: Discipline Group */}
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-1">Discipline Group</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.groupName}
                                            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                            className="rounded-xl h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 uppercase font-medium shadow-sm transition-all"
                                            placeholder="Discipline Group name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 h-11 shrink-0 rounded-xl shadow-sm">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</span>
                                        <Input
                                            value={formData.groupCode}
                                            onChange={(e) => setFormData({ ...formData, groupCode: e.target.value })}
                                            className="w-12 h-8 border-none bg-transparent font-mono text-sm p-0 focus-visible:ring-0 text-center font-bold text-blue-600"
                                            placeholder="XXXX"
                                            maxLength={4}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Level 2: Major Discipline */}
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-1">Major Discipline</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            value={formData.majorCode ? (formData.majorName || '') : ''}
                                            onChange={(e) => setFormData({ ...formData, majorName: e.target.value, groupDescription: e.target.value })}
                                            className="rounded-xl h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                                            placeholder={formData.majorCode ? 'Major Discipline name' : '—'}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 h-11 shrink-0 rounded-xl shadow-sm">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</span>
                                        <Input
                                            value={formData.majorCode || ''}
                                            onChange={(e) => setFormData({ ...formData, majorCode: e.target.value })}
                                            className="w-16 h-8 border-none bg-transparent font-mono text-sm p-0 focus-visible:ring-0 text-center font-bold text-blue-600"
                                            placeholder="XXXXXX"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Level 3: Specific Discipline */}
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 ml-1">Specific Discipline</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            value={initialData.type === 'specific' ? formData.specificDiscipline : ''}
                                            onChange={(e) => setFormData({ ...formData, specificDiscipline: e.target.value })}
                                            className="rounded-xl h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                                            placeholder={initialData.type === 'specific' ? 'Specific Discipline name' : '—'}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 h-10 shrink-0">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Code</span>
                                        <Input
                                            value={initialData.type === 'specific' ? formData.code : ''}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="w-16 h-7 border-none bg-transparent font-mono text-sm p-0 focus-visible:ring-0 text-center"
                                            placeholder="XXXXXXXX"
                                            maxLength={8}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}






                    <DialogFooter className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-gray-300 h-12 px-6 font-semibold uppercase tracking-wider text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-xl bg-[#003468] text-white hover:bg-[#1a4f8c] disabled:opacity-60 h-12 px-8 font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-900/10">
                            {processing ? 'Saving...' : (initialData ? 'Save Changes' : (specificSubCode ? 'Add Specific' : 'Add Discipline'))}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
