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
    onSave: (school: School) => void;
}

const SchoolNameModal: FC<Props> = ({ isOpen, onOpenChange, school, onSave }) => {
    const { data, setData, put, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        address: '',
        contact_number: '',
        email: '',
        is_active: true,
    });

    useEffect(() => {
        if (school) {
            setData({
                name: school.name,
                code: school.code || '',
                address: school.address || '',
                contact_number: school.contact_number || '',
                email: school.email || '',
                is_active: school.is_active,
            });
        } else {
            reset();
        }
    }, [school, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const schoolData = {
            id: school?.id || 0, // 0 or placeholder for new
            ...data,
            created_at: school?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as School;

        onSave(schoolData);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{school ? 'Edit School' : 'Add School'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">School Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. University of Example"
                            required
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">School Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="e.g. SCH-001"
                        />
                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Full address"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_number">Contact Number</Label>
                            <Input
                                id="contact_number"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="+1234567890"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="school@example.com"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">Active Status</Label>
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

export default SchoolNameModal;
