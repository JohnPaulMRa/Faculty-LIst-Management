import { Head, Link, usePage, router } from '@inertiajs/react'; // Added 'router'
import { useEffect } from 'react'; // Added 'useEffect'
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    // FIX: Automatically redirect logged-in users to the Faculty Profile
    useEffect(() => {
        if (auth.user) {
            router.visit(dashboard());
        }
    }, [auth.user]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                
                {/* HEADER SECTION */}
                <header className="w-full bg-[#003468] shadow-md">
                    <div className="relative flex h-19 w-full items-center justify-between px-6 lg:px-20">
                        
                        {/* LEFT SIDE: Logo & Text */}
                        <div className="flex items-center gap-5">
                            <img
                                src="/favicon.svg.png" 
                                alt="CHED Logo"
                                className="h-14 w-14 rounded-full bg-white object-contain p-0.5"
                            />
                            
                            <div className="flex flex-col justify-center text-white">
                                <h1 className="text-sm font-bold uppercase leading-tight tracking-wide md:text-base">
                                    Commission on Higher Education Region XII
                                </h1>
                                <p className="text-[11px] font-medium uppercase tracking-wider opacity-90 md:text-xs">
                                     Faculty List Profile
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Navigation */}
                        <nav className="flex items-center justify-end gap-4">
                            {auth.user ? (
                                // This button remains visible briefly before the redirect happens, 
                                // or if the user navigates back manually.
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-white/20 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/50"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-white hover:border-white/20"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-sm border border-white/20 px-5 py-1.5 text-sm leading-normal text-white hover:border-white/50"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-335px flex-col-reverse lg:max-w-4xl lg:flex-row">
                        {/* Main content goes here */}
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}