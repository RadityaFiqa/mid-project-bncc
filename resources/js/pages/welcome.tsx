import { Head, Link, usePage } from '@inertiajs/react';

import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div
                className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 text-white"
                style={{
                    background:
                        'linear-gradient(160deg, #050508 0%, #0a0a0f 25%, #060618 50%, #080810 75%, #000 100%)',
                }}
            >
                <h1 className="mb-10 text-center text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                    BNCC Mid Project
                </h1>
                <h1 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                    Crafted by Raditya Firman S with ❤️
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
                                >
                                    Register
                                </Link>
                            )}
                            <Link
                                href={login()}
                                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
