import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FC} from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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

interface Hei {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    heis: Hei[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    account?: any; // Add account prop
}

const CreateFacultyAccountModal: FC<Props> = ({ isOpen, onOpenChange, heis, account }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        username: account?.email || '',
        password: '',
        password_confirmation: '',
        hei_id: account?.hei_id || '',
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen && account) {
            setData({
                username: account.email || account.name || '',
                password: '',
                password_confirmation: '',
                hei_id: account.hei_id || '',
            });
        } else if (!isOpen) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, account]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (account) {
            put(route('admin.users.update', account.id), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(route('admin.faculty.create-account'), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="bg-linear-to-r from-[#003468] to-[#1a4f8c] p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight">
                            {account ? 'Edit User Account' : 'Create Faculty Account'}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/80 text-sm mt-2 font-medium">
                            {account 
                                ? 'Update account details. Leave password blank if you don\'t want to change it.' 
                                : 'Provide a username, assign an HEIs, and set a password for the new faculty member.'}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6 bg-white">
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">User name <span className="text-red-500">*</span></Label>
                        <Input
                            id="username"
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Enter user name"
                            required
                            className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                        />
                        {errors.username && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.username}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hei" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">HEIs <span className="text-red-500">*</span></Label>
                        <select
                            id="hei"
                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 font-medium shadow-sm transition-all appearance-none"
                            value={data.hei_id}
                            onChange={(e) => setData('hei_id', e.target.value)}
                            required
                        >
                            <option value="">Select an HEIs</option>
                            {heis.map((hei) => (
                                <option key={hei.id} value={hei.id}>
                                    {hei.name}
                                </option>
                            ))}
                        </select>
                        {errors.hei_id && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.hei_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            Password {account ? '(Optional)' : <span className="text-red-500">*</span>}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required={!account}
                                className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.password}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                            Confirm Password {account ? '(Optional)' : <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required={!account && data.password !== ''}
                            className="h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600/10 focus-visible:border-blue-500 font-medium shadow-sm transition-all"
                        />
                    </div>

                    <DialogFooter className="pt-6 flex gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl h-11 px-6 font-bold uppercase tracking-wider text-xs border-slate-200 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="rounded-xl h-11 px-8 font-black uppercase tracking-wider text-xs bg-[#003468] text-white hover:bg-[#002850] shadow-md shadow-blue-900/10 transition-all"
                        >
                            {processing 
                                ? (account ? 'Updating...' : 'Creating...') 
                                : (account ? 'Update Account' : 'Create Account')}
                        </Button>
                    </DialogFooter>
                </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateFacultyAccountModal;
