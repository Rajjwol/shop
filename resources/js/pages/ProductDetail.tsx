import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';

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
    flash?: {
        success?: string;
        error?: string;
    };
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role?: string;
        } | null;
    };
};

export default function ProductDetail({ product }: { product: Product }) {
    // ✅ Get flash and auth inside component
    const { flash, auth } = usePage<PageProps>().props;

    // Setup Inertia form
    const { post, processing } = useForm({ product_id: product.id, quantity: 1 });

    const addToCart = () => {
        post(route('cart.add'), {
            onSuccess: () => {
                console.log(`${product.name} added to cart!`);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="container mx-auto px-4 py-10">
                {/* Flash Messages */}
                {flash?.success && <div className="mb-4 rounded bg-green-100 p-4 text-center text-green-700">{flash.success}</div>}
                {flash?.error && <div className="mb-4 rounded bg-red-100 p-4 text-center text-red-700">{flash.error}</div>}

                <div className="flex flex-col gap-8 overflow-hidden rounded-lg bg-white shadow-lg md:flex-row dark:bg-gray-800">
                    {/* Product Image */}
                    <div className="relative md:w-1/2">
                        {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full rounded-l-lg object-cover" />
                        ) : (
                            <div className="flex h-96 w-full items-center justify-center rounded-l-lg bg-gray-200 dark:bg-gray-700">
                                <span className="text-lg text-gray-400 dark:text-gray-300">No Image</span>
                            </div>
                        )}
                        {product.badge && (
                            <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between p-6 md:w-1/2">
                        <div>
                            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100">{product.name}</h1>
                            <p className="mb-3 text-3xl font-bold text-indigo-600">${product.price}</p>
                            <p className={`mb-6 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `Available: ${product.stock} in stock` : 'Currently unavailable'}
                            </p>
                            {product.description && <p className="leading-relaxed text-gray-700 dark:text-gray-300">{product.description}</p>}
                        </div>

                        <button
                            onClick={() => {
                                if (!auth?.user) {
                                    alert('Please login to add items to cart.');
                                    return;
                                }
                                if (product.stock === 0 || processing) return;

                                addToCart();
                            }}
                            className="mt-8 w-full rounded-lg bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
