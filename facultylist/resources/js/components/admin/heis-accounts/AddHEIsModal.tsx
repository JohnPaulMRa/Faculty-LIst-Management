import { useForm } from '@inertiajs/react';
import type { FC} from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Hei } from '@/types/hei';

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    hei: Hei | null;
    onSave?: (hei: Hei) => void;
}

const AddHEIsModal: FC<Props> = ({ isOpen, onOpenChange, hei, onSave }) => {
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
        if (hei) {
            setData({
                name: hei.name,
                hei_code: hei.hei_code || '',
                address: hei.address || '',
                contact_number: hei.contact_number || '',
                email: hei.email || '',
                is_active: hei.is_active,
                type: hei.type || 'Private',
            });
        } else {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hei, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (hei) {
            put(route('admin.heis.update', hei.id), {
                onSuccess: () => {
                    onSave?.({ ...hei, ...data } as Hei);
                    onOpenChange(false);
                },
            });
        } else {
            post(route('admin.heis.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight">
                            {hei ? 'Edit HEI' : 'Add New HEI'}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/80 text-sm mt-2 font-medium">
                            {hei ? 'Update the information for this HEI.' : 'Enter the details of the new HEI to add it to the system.'}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6 bg-white max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">HEIs Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. University of Example"
                            required
                            className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                        />
                        {errors.name && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hei_code" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">HEIs Code <span className="text-slate-400 font-normal">(Optional)</span></Label>
                        <Input
                            id="hei_code"
                            value={data.hei_code}
                            onChange={(e) => setData('hei_code', e.target.value)}
                            placeholder="e.g. HEI-001"
                            className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all font-mono"
                        />
                        {errors.hei_code && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.hei_code}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Address <span className="text-slate-400 font-normal">(Optional)</span></Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Full address"
                            className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="contact_number" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contact Number <span className="text-slate-400 font-normal">(Optional)</span></Label>
                            <Input
                                id="contact_number"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="+63 912 345 6789"
                                className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email <span className="text-slate-400 font-normal">(Optional)</span></Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="school@example.com"
                                className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 pt-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">HEIs Type <span className="text-red-500">*</span></Label>
                        <div className="flex gap-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="type-public"
                                    checked={data.type === 'Public'}
                                    onCheckedChange={(checked) => {
                                        if (checked) setData('type', 'Public');
                                    }}
                                    className="h-6 w-6 rounded-lg data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
                                />
                                <Label htmlFor="type-public" className="cursor-pointer font-bold text-slate-700">Public Institution</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="type-private"
                                    checked={data.type === 'Private'}
                                    onCheckedChange={(checked) => {
                                        if (checked) setData('type', 'Private');
                                    }}
                                    className="h-6 w-6 rounded-lg data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
                                />
                                <Label htmlFor="type-private" className="cursor-pointer font-bold text-slate-700">Private Institution</Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 mt-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Status <span className="text-red-500">*</span></Label>
                        <div className="flex items-center space-x-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 transition-all">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                className="h-6 w-6 rounded-lg data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white data-[state=checked]:border-emerald-600 transition-all"
                            />
                            <div className="flex flex-col">
                                <Label htmlFor="is_active" className="cursor-pointer font-black text-emerald-900">Active HEIs</Label>
                                <span className="text-xs text-emerald-600/70 font-medium">If unchecked, the HEIs will be hidden from the active list.</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-8 flex gap-3 border-t border-slate-100 bg-slate-50/50 p-8">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)} 
                            className="rounded-xl h-12 px-8 font-bold uppercase tracking-wider text-xs border-slate-200 hover:bg-white shadow-sm transition-all"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            className="rounded-xl h-12 px-10 font-black uppercase tracking-wider text-xs bg-[#003468] text-white hover:bg-[#002850] shadow-lg shadow-blue-900/20 transition-all"
                        >
                            {processing ? 'Saving...' : (hei ? 'Update HEI' : 'Save HEI')}
                        </Button>
                    </DialogFooter>
                </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddHEIsModal;
