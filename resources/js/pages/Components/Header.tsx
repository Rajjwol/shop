import { Link, router } from '@inertiajs/react';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { auth } = usePage().props;
    const authUser = auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="fixed z-50 w-full bg-white shadow-md dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            MyStore
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-6 md:flex">
                        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
                        <Link href="/products" className="hover:text-purple-600 dark:hover:text-purple-400">Products</Link>
                        <Link href="/categories" className="hover:text-purple-600 dark:hover:text-purple-400">Categories</Link>
                        <Link href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">About</Link>
                        <Link href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">Contact</Link>

                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white"
                        />

                        {/* User Actions */}
                        <div className="flex items-center space-x-4 relative">
                            {authUser ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                                        className="rounded px-3 py-1 transition-colors duration-200 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-700 dark:hover:text-purple-300"
                                    >
                                        Logout
                                    </button>

                                    {showLogoutConfirm && (
                                        <div className="absolute left-1/2 top-full z-10 mt-2 w-max -translate-x-1/2 rounded bg-black px-3 py-2 text-xs text-white dark:bg-gray-800">
                                            <p>Are you sure you want to logout?</p>
                                            <div className="mt-2 flex gap-2 justify-center">
                                                <button
                                                    onClick={handleLogout}
                                                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setShowLogoutConfirm(false)}
                                                    className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="rounded px-3 py-1 transition-colors duration-200 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-700 dark:hover:text-purple-300"
                                >
                                    Login
                                </Link>
                            )}

                            <Link href="/cart" className="relative">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    3
                                </span>
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-800 focus:outline-none dark:text-white">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="bg-white px-4 pt-4 pb-2 shadow-lg md:hidden dark:bg-gray-900">
                    <Link href="/" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
                    <Link href="/products" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">Products</Link>
                    <Link href="/categories" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">Categories</Link>
                    <Link href="/about" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">About</Link>
                    <Link href="/contact" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">Contact</Link>

                    {authUser ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
                                className="block w-full cursor-pointer border-none bg-transparent py-2 text-left hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                Logout
                            </button>

                            {showLogoutConfirm && (
                                <div className="mt-2 w-full rounded bg-black px-3 py-2 text-xs text-white dark:bg-gray-800">
                                    <p>Are you sure you want to logout?</p>
                                    <div className="mt-2 flex gap-2 justify-center">
                                        <button
                                            onClick={handleLogout}
                                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setShowLogoutConfirm(false)}
                                            className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">Login</Link>
                    )}

                    <Link href="/cart" className="block py-2 hover:text-purple-600 dark:hover:text-purple-400">Cart (3)</Link>
                </div>
            )}
        </header>
    );
}
