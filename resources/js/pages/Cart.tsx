import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image?: string;
};

export default function Cart({ cartItems, cartTotal }: { cartItems: CartItem[], cartTotal: number }) {
    const { post, delete: destroy, processing } = useForm({});
    const [success, setSuccess] = useState('');

    const purchase = () => {
        post(route('cart.purchase'), {
            onSuccess: () => {
                setSuccess('Purchase completed successfully!');
            },
            onError: () => {
                alert('Purchase failed. Check stock.');
            },
        });
    };

  const deleteItem = (id: number) => {
    if (!confirm('Are you sure you want to remove this item from your cart?')) return;

    destroy(route('cart.remove', id), {
        onSuccess: () => {
            setSuccess('Item removed from cart.');
        },
        onError: () => {
            alert('Failed to remove item.');
        },
    });
};


    return (
        <AppLayout>
            <Head title="Your Cart" />

            <div className="container mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">Shopping Cart</h1>

                {success && (
                    <div className="bg-green-100 text-green-700 p-4 rounded mb-6 text-center">{success}</div>
                )}

                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-300 text-lg">Your cart is empty.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
                                    <img src={item.image ? `/storage/${item.image}` : '/placeholder.png'} alt={item.name} className="w-28 h-28 object-cover rounded"/>
                                    <div className="flex-1">
                                        <h2 className="font-bold text-xl mb-2">{item.name}</h2>
                                        <p className="text-gray-700 dark:text-gray-300">Price: <span className="font-semibold">${item.price}</span></p>
                                        <p className="text-gray-700 dark:text-gray-300">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                                        <p className="text-gray-700 dark:text-gray-300">Total: <span className="font-semibold">${item.total}</span></p>
                                    </div>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        disabled={processing}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Grand Total: <span className="text-indigo-600">${cartTotal}</span></h2>
                            <button
                                onClick={purchase}
                                disabled={processing}
                                className="mt-4 md:mt-0 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                Purchase
                            </button>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
