import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

type Props = {
    title?: string;
    children: React.ReactNode;
};

export default function AdminLayout({ title, children }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Head title={title ?? 'Admin'} />

            {/* Sidebar */}
            <aside className="flex w-64 flex-col border-r bg-white p-6 dark:bg-gray-800">
                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-gray-100">Admin Panel</h2>
                <nav className="flex flex-1 flex-col gap-3">
                    <Link href={route('admin.dashboard')} className="rounded px-4 py-2 transition hover:bg-indigo-500 hover:text-white">
                        Dashboard
                    </Link>
                    {/* Add more links here */}
                    <Link
                        href={route('admin.products.index')} // make sure this route exists in Laravel
                        className="rounded px-4 py-2 transition hover:bg-green-500 hover:text-white"
                    >
                        Products
                    </Link>
                </nav>

                <form onSubmit={handleLogout} className="mt-auto">
                    <button className="w-full rounded px-4 py-2 text-red-600 transition hover:bg-red-100 dark:hover:bg-red-700">Logout</button>
                </form>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
