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

interface DisciplineItem {
    id: number;
    code: string;
    group: string;
    majorDiscipline: string;
    specificDiscipline: string;
}

interface DisciplineFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: DisciplineItem | null;
}

export default function DisciplineFormModal({ isOpen, onClose, onSubmit, initialData }: DisciplineFormModalProps) {
    const [formData, setFormData] = useState({
        code: "",
        group: "",
        majorDiscipline: "",
        specificDiscipline: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                group: initialData.group,
                majorDiscipline: initialData.majorDiscipline,
                specificDiscipline: initialData.specificDiscipline
            });
        } else {
            setFormData({
                code: "",
                group: "",
                majorDiscipline: "",
                specificDiscipline: ""
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-none bg-white">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold">{initialData ? 'Edit Discipline' : 'Add Discipline'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Update the details below.' : 'Enter the details for the new discipline.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="px-6 py-4 grid gap-5">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                            Code
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="col-span-3 rounded-none"
                            placeholder="e.g. 140101"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="group" className="text-right">
                            Group Code
                        </Label>
                        <Input
                            id="group"
                            value={formData.group}
                            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                            className="col-span-3 rounded-none"
                            placeholder="e.g. 14"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="major" className="text-right">
                            Major Disc.
                        </Label>
                        <Input
                            id="major"
                            value={formData.majorDiscipline}
                            onChange={(e) => setFormData({ ...formData, majorDiscipline: e.target.value })}
                            className="col-span-3 rounded-none"
                            placeholder="e.g. Education Science"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="specific" className="text-right">
                            Specific Disc.
                        </Label>
                        <Input
                            id="specific"
                            value={formData.specificDiscipline}
                            onChange={(e) => setFormData({ ...formData, specificDiscipline: e.target.value })}
                            className="col-span-3 rounded-none"
                            placeholder="e.g. Teaching Math"
                            required
                        />
                    </div>

                    <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-none border-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-none bg-black text-white hover:bg-gray-800">
                            {initialData ? 'Save Changes' : 'Create Discipline'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
