import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage, useForm } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    hei,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    hei?: any;
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        hei_contact_number: hei?.contact_number || '',
        hei_email: hei?.email || '',
        hei_address: hei?.address || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile', {
            preserveScroll: true,
        });
    };

    return (
        <SettingsLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your profile and institution information"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                name="name"
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                name="email"
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.email}
                            />
                        </div>

                        {hei && (
                            <>
                                <div className="pt-6 pb-2 border-t border-gray-100 dark:border-neutral-800">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Institution Information</h3>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hei_name">Institution Name</Label>
                                    <Input
                                        id="hei_name"
                                        className="mt-1 block w-full bg-gray-100 dark:bg-neutral-800"
                                        defaultValue={hei.name || ''}
                                        disabled
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hei_code">Institution Code</Label>
                                        <Input
                                            id="hei_code"
                                            className="mt-1 block w-full bg-gray-100 dark:bg-neutral-800"
                                            defaultValue={hei.hei_code || ''}
                                            disabled
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="hei_type">Institution Type</Label>
                                        <Input
                                            id="hei_type"
                                            className="mt-1 block w-full bg-gray-100 dark:bg-neutral-800 capitalize"
                                            defaultValue={hei.type || ''}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hei_contact_number">Contact Number</Label>
                                        <Input
                                            id="hei_contact_number"
                                            name="hei_contact_number"
                                            className="mt-1 block w-full"
                                            value={data.hei_contact_number}
                                            onChange={(e) => setData('hei_contact_number', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors?.hei_contact_number as string} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="hei_email">Email Address</Label>
                                        <Input
                                            id="hei_email"
                                            name="hei_email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.hei_email}
                                            onChange={(e) => setData('hei_email', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors?.hei_email as string} />
                                    </div>
                                </div>

                                <div className="grid gap-2 mb-4">
                                    <Label htmlFor="hei_address">Institution Address</Label>
                                    <Input
                                        id="hei_address"
                                        name="hei_address"
                                        className="mt-1 block w-full"
                                        value={data.hei_address}
                                        onChange={(e) => setData('hei_address', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors?.hei_address as string} />
                                </div>
                            </>
                        )}

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is
                                        unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status ===
                                        'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has
                                            been sent to your email
                                            address.
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
            </div>

            <DeleteUser />
        </SettingsLayout>
    );
}
