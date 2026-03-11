import { FC, useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { School } from '@/types/school';

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    school: School | null;
    onSave?: (school: School) => void;
}

const AddSchoolModal: FC<Props> = ({ isOpen, onOpenChange, school, onSave }) => {
    const { data, setData, put, post, processing, errors, reset } = useForm({
        name: '',
        hei_code: '',
        address: '',
        contact_number: '',
        email: '',
        is_active: true,
        type: 'Private' as 'Public' | 'Private',
    });

    useEffect(() => {
        if (school) {
            setData({
                name: school.name,
                hei_code: school.hei_code || '',
                address: school.address || '',
                contact_number: school.contact_number || '',
                email: school.email || '',
                is_active: school.is_active,
                type: school.type || 'Private',
            });
        } else {
            reset();
        }
    }, [school, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (school) {
            put(route('schools.update', school.id), {
                onSuccess: () => {
                    onSave?.({ ...school, ...data } as School);
                    onOpenChange(false);
                },
            });
        } else {
            post(route('admin.schools.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-2xl rounded-none"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl">{school ? 'Edit School' : 'Add School'}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {school ? 'Update the information for this school.' : 'Enter the details of the new school to add it to the system.'}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-semibold">School Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. University of Example"
                            required
                            className="h-10"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hei_code" className="text-sm font-semibold">HEI Code <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                        <Input
                            id="hei_code"
                            value={data.hei_code}
                            onChange={(e) => setData('hei_code', e.target.value)}
                            placeholder="e.g. HEI-001"
                            className="h-10"
                        />
                        {errors.hei_code && <p className="text-sm text-red-500">{errors.hei_code}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address" className="text-sm font-semibold">Address <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Full address"
                            className="h-10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_number" className="text-sm font-semibold">Contact Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                            <Input
                                id="contact_number"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="+63 912 345 6789"
                                className="h-10"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-semibold">Email <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="school@example.com"
                                className="h-10"
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 pt-2">
                        <Label className="text-sm font-semibold">School Type <span className="text-red-500">*</span></Label>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="type-public"
                                    checked={data.type === 'Public'}
                                    onCheckedChange={(checked) => {
                                        if (checked) setData('type', 'Public');
                                    }}
                                    className="h-5 w-5"
                                />
                                <Label htmlFor="type-public" className="cursor-pointer font-medium">Public Institution</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="type-private"
                                    checked={data.type === 'Private'}
                                    onCheckedChange={(checked) => {
                                        if (checked) setData('type', 'Private');
                                    }}
                                    className="h-5 w-5"
                                />
                                <Label htmlFor="type-private" className="cursor-pointer font-medium">Private Institution</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t mt-2">
                        <Label className="text-sm font-semibold">Status <span className="text-red-500">*</span></Label>
                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border text-sm">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                className="h-5 w-5 data-[state=checked]:bg-green-600 data-[state=checked]:text-white data-[state=checked]:border-green-600"
                            />
                            <div className="flex flex-col">
                                <Label htmlFor="is_active" className="cursor-pointer font-medium">Active School</Label>
                                <span className="text-xs text-muted-foreground">If unchecked, the school will be hidden from the active list.</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSchoolModal;
