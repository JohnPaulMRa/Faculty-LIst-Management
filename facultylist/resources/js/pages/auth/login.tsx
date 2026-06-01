import { Form, Head, Link, usePage, router } from '@inertiajs/react'; // Added router
import { useEffect } from 'react'; // Added useEffect

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { type SharedData } from '@/types';

interface WelcomeProps {
    canResetPassword?: boolean;
    status?: string;
}

export default function Login({
    canResetPassword = true,
    status,
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    // FIX: Automatically redirect to Faculty Profile if logged in
    useEffect(() => {
        if (auth.user) {
            router.visit(dashboard());
        }
    }, [auth.user]);

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                
                {/* --- MAIN CONTENT: LOGIN FORM --- */}
                <div className="flex grow flex-col items-center justify-center p-6 lg:p-8">
                    
                    {/* Only show form if user is NOT logged in */}
                    {!auth.user ? (
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
                                    Login to your account
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your user name and password below to Login
                                </p>
                            </div>

                            {/* FORM */}
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">User Name</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="User Name"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">Password</Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="ml-auto text-sm"
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                />
                                                <Label htmlFor="remember">Remember me</Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-2 h-11 w-full text-base font-medium"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing && <Spinner className="mr-2" />}
                                                Login
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>

                            {/* Register Link / Status Message */}
                            <div className="space-y-4">


                                {status && (
                                    <div className="text-center text-sm font-medium text-green-600">
                                        {status}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Optional: Loading state while redirect happens
                        <div className="text-center">
                            <Spinner className="h-8 w-8 text-[#003468]" />
                            <p className="mt-2 text-[#003468]">Redirecting...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}