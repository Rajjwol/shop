import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string;
    image?: string;
    badge?: 'New' | 'Sale';
};

type PageProps = {
    products?: Product[];
    flash?: { success?: string; error?: string };
    auth?: { user?: { id: number; name: string; cart?: { product_id: number; quantity: number }[] } | null };
};

export default function HomePage() {
    const { products = [], flash, auth } = usePage<PageProps>().props;
    const [heroImage, setHeroImage] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setHeroImage('/images/hero-morning.jpg');
        else if (hour >= 12 && hour < 18) setHeroImage('/images/hero-afternoon.jpg');
        else setHeroImage('/images/.jpg');
    }, []);

    // Calculate total cart count from auth.user.cart
    const totalCartCount = auth?.user?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <AppLayout>
            <Head title="Welcome to Our Store" />

            {/* Hero Section */}
            <div
                className="relative flex h-80 w-full items-center justify-center bg-cover bg-center text-center md:h-96"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>
                <div className="relative px-4 text-white dark:text-gray-100">
                    <h1 className="animate-fadeIn mb-2 text-3xl font-bold md:text-5xl">Welcome! Explore Our Wonderful Products</h1>
                    <p className="animate-fadeIn mb-4 text-lg delay-200 md:text-xl">We’re delighted to help you find exactly what you need.</p>
                    <a
                        href="#featured"
                        className="animate-fadeIn inline-block rounded bg-indigo-600 px-6 py-3 font-semibold transition delay-400 hover:bg-indigo-700"
                    >
                        Shop Now
                    </a>

                    {/* Cart count display */}
                    {totalCartCount > 0 && (
                        <div className="mt-4 inline-block rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                            Cart Items: {totalCartCount}
                        </div>
                    )}
                </div>
            </div>

            {/* Flash Messages */}
            {flash?.success && <div className="mb-4 rounded bg-green-100 p-4 text-center text-green-700">{flash.success}</div>}
            {flash?.error && <div className="mb-4 rounded bg-red-100 p-4 text-center text-red-700">{flash.error}</div>}

            {/* Products */}
            {/* Products */}
            <div id="featured" className="container mx-auto px-4 py-6">
                <h2 className="mb-6 text-center text-2xl font-bold">Featured Products</h2>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="transform cursor-pointer overflow-hidden rounded-lg border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800"
                            onClick={() => (window.location.href = `/products/${product.id}`)}
                        >
                            <div className="relative">
                                {product.image ? (
                                    <img src={`/storage/${product.image}`} alt={product.name} className="h-48 w-full object-cover" />
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                        <span className="text-gray-400 dark:text-gray-300">No Image</span>
                                    </div>
                                )}
                                {product.badge && (
                                    <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col p-4">
                                <h3 className="text-md font-semibold">{product.name}</h3>
                                <p className="mt-2 font-bold text-indigo-600">${product.price}</p>
                                <p className={`mt-1 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `Available: ${product.stock} in stock` : 'Currently unavailable'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
