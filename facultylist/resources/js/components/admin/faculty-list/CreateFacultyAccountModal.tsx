import { FC, useState, useEffect } from 'react';
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
import { Eye, EyeOff } from 'lucide-react';

interface School {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    schools: School[];
}

const CreateFacultyAccountModal: FC<Props> = ({ isOpen, onOpenChange, schools }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        school_id: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.faculty.create-account'), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px]"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl">Create Faculty Login Account</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Provide a username, assign a school, and set a password for the new faculty member.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-sm font-semibold">User name <span className="text-red-500">*</span></Label>
                        <Input
                            id="username"
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Enter user name"
                            required
                            className="h-10"
                        />
                        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="school" className="text-sm font-semibold">School <span className="text-red-500">*</span></Label>
                        <select
                            id="school"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.school_id}
                            onChange={(e) => setData('school_id', e.target.value)}
                            required
                        >
                            <option value="">Select a school</option>
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                        {errors.school_id && <p className="text-sm text-red-500">{errors.school_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-semibold">Password <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="h-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold">Confirm Password <span className="text-red-500">*</span></Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            className="h-10"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Account'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateFacultyAccountModal;
