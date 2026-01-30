import { Form, Head, Link, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login} from '@/routes';
import { store } from '@/routes/register';
import { type SharedData } from '@/types';

export default function Register() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Register" />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                

                {/* --- MAIN CONTENT: REGISTER FORM --- */}
                <div className="flex grow flex-col items-center justify-center p-6 lg:p-8">
                    
                    <div className="w-full max-w-md space-y-8">
                        
                        {/* BIG LOGO & TITLE */}
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Link 
                                href="/" 
                                className="mb-4 transition-opacity hover:opacity-80 focus:outline-none"
                            >
                                <img 
                                    src="/favicon.svg.png" 
                                    alt="CHED Logo" 
                                    className="h-40 w-40 object-contain" 
                                />
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-[#003468] dark:text-[#EDEDEC]">
                                Create an account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your details below to create your account
                            </p>
                        </div>

                        {/* FORM */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                name="name"
                                                placeholder="Full name"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Confirm password"
                                            />
                                            <InputError
                                                message={errors.password_confirmation}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-2 h-11 w-full text-base font-medium"
                                            tabIndex={5}
                                            data-test="register-user-button"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner className="mr-2" />}
                                            Create account
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <TextLink href={login()} tabIndex={6}>
                                            Log in
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}