import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
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
    auth?: { user?: { id: number; name: string } | null };
};

export default function HomePage() {
    const { products = [], flash, auth } = usePage<PageProps>().props;
    const [heroImage, setHeroImage] = useState('');

    const { post, processing, setData } = useForm<{ product_id: number; quantity: number }>({
        product_id: 0,
        quantity: 1,
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setHeroImage('/images/hero-morning.jpg');
        else if (hour >= 12 && hour < 18) setHeroImage('/images/hero-afternoon.jpg');
        else setHeroImage('/images/hero-evening.jpg');
    }, []);

    // ✅ Fix: addToCart only handles adding
    const addToCart = (productId: number) => {
        if (!auth?.user) {
            alert('Please login to add items to cart.');
            return;
        }

        setData({ product_id: productId, quantity: 1 });

        post(route('dashboard.cart.add'), {
            onSuccess: () => alert('Product added to cart!'),
            onError: (errors) => {
                console.error(errors);
                alert('Failed to add product to cart.');
            },
        });
    };

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
                    <h1 className="animate-fadeIn mb-2 text-3xl font-bold md:text-5xl">
                        Welcome! Explore Our Wonderful Products
                    </h1>
                    <p className="animate-fadeIn mb-4 text-lg delay-200 md:text-xl">
                        We’re delighted to help you find exactly what you need.
                    </p>
                    <a
                        href="#featured"
                        className="animate-fadeIn inline-block rounded bg-indigo-600 px-6 py-3 font-semibold transition delay-400 hover:bg-indigo-700"
                    >
                        Shop Now
                    </a>
                </div>
            </div>

            {/* Flash Messages */}
            {flash?.success && <div className="mb-4 rounded bg-green-100 p-4 text-center text-green-700">{flash.success}</div>}
            {flash?.error && <div className="mb-4 rounded bg-red-100 p-4 text-center text-red-700">{flash.error}</div>}

            {/* Products */}
            <div id="featured" className="container mx-auto px-4 py-6">
                <h2 className="mb-4 text-center text-2xl font-bold">Featured Products</h2>
                <div className="scrollbar-hide flex gap-4 overflow-x-auto py-2">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[220px] transform cursor-pointer rounded-lg border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800"
                            onClick={() => (window.location.href = `/products/${product.id}`)}
                        >
                            <div className="relative">
                                {product.image ? (
                                    <img src={`/storage/${product.image}`} alt={product.name} className="h-40 w-full rounded-t-lg object-cover" />
                                ) : (
                                    <div className="flex h-40 w-full items-center justify-center rounded-t-lg bg-gray-200 dark:bg-gray-700">
                                        <span className="text-gray-400 dark:text-gray-300">No Image</span>
                                    </div>
                                )}
                                {product.badge && (
                                    <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col p-3">
                                <h3 className="text-md font-semibold">{product.name}</h3>
                                <p className="mt-1 font-bold text-indigo-600">${product.price}</p>
                                <p className={`mt-1 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `Available: ${product.stock} in stock` : 'Currently unavailable'}
                                </p>
                                <button
                                    disabled={!auth?.user || product.stock === 0 || processing}
                                    onClick={(e) => {
                                        e.stopPropagation(); // important
                                        addToCart(product.id);
                                    }}
                                    className="mt-3 w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
