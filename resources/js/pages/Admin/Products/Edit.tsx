import AdminLayout from '@/layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string | null;
}

interface EditProps {
    product: Product;
}

export default function Edit({ product }: EditProps) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;

    const [preview, setPreview] = useState<string | null>(null);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const { data, setData, processing, errors } = useForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: null as File | null,
    });

    // Client-side validation rules
    const validate = () => {
        const errs: Record<string, string> = {};
        if (!data.name || data.name.trim().length < 3) {
            errs.name = 'Name must be at least 3 characters.';
        }
        if (!data.price || data.price <= 0) {
            errs.price = 'Price must be greater than 0.';
        }
        if (data.stock < 0) {
            errs.stock = 'Stock cannot be negative.';
        }
        if (data.image && data.image.size > 2 * 1024 * 1024) {
            errs.image = 'Image must be less than 2MB.';
        }
        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files, type } = e.target;

        if (type === 'file' && files) {
            const file = files[0];
            setData('image', file);

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);

            setClientErrors((prev) => {
                const newErrors = { ...prev };

                if (file.size > 2 * 1024 * 1024) {
                    newErrors.image = 'Image must be less than 2MB.';
                } else {
                    delete newErrors.image; // ✅ remove key instead of setting undefined
                }

                return newErrors;
            });
        } else {
            const newValue = type === 'number' ? Number(value) : value;
            setData(name as keyof typeof data, newValue);

            // Live validation
            setClientErrors((prev) => {
                const newErrors = { ...prev };

                if (name === 'name') {
                    if (!newValue || (newValue as string).trim().length < 3) {
                        newErrors.name = 'Name must be at least 3 characters.';
                    } else {
                        delete newErrors.name;
                    }
                }

                if (name === 'price') {
                    if (!newValue || (newValue as number) <= 0) {
                        newErrors.price = 'Price must be greater than 0.';
                    } else {
                        delete newErrors.price;
                    }
                }

                if (name === 'stock') {
                    if ((newValue as number) < 0) {
                        newErrors.stock = 'Stock cannot be negative.';
                    } else {
                        delete newErrors.stock;
                    }
                }

                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return; // stop if client validation fails

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        formData.append('stock', String(data.stock));

        if (data.image) {
            formData.append('image', data.image);
        }

        formData.append('_method', 'PUT');

        router.post(route('admin.products.update', product.id), formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Edit Product">
            <div className="mx-auto max-w-4xl p-4 md:p-8">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-left md:text-3xl dark:text-gray-100">Edit Product</h1>

                {/* Flash messages */}
                {flash?.success && <div className="mb-4 rounded bg-green-100 p-3 text-green-800">{flash.success}</div>}
                {flash?.error && <div className="mb-4 rounded bg-red-100 p-3 text-red-800">{flash.error}</div>}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 space-y-6 rounded-xl bg-white p-6 shadow md:grid-cols-2 md:p-8 lg:grid-cols-3 dark:bg-gray-800"
                >
                    {/* Name */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2 focus:ring-2 ${
                                clientErrors.name || errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {(clientErrors.name || errors.name) && <div className="mt-1 text-sm text-red-600">{clientErrors.name || errors.name}</div>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={data.price}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2 focus:ring-2 ${
                                clientErrors.price || errors.price ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {(clientErrors.price || errors.price) && (
                            <div className="mt-1 text-sm text-red-600">{clientErrors.price || errors.price}</div>
                        )}
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={data.stock}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2 focus:ring-2 ${
                                clientErrors.stock || errors.stock ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {(clientErrors.stock || errors.stock) && (
                            <div className="mt-1 text-sm text-red-600">{clientErrors.stock || errors.stock}</div>
                        )}
                    </div>

                    {/* Image Preview */}
                    {(product.image || preview) && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <label className="mb-2 block text-sm font-medium">{preview ? 'New Image Preview' : 'Current Image'}</label>
                            <img
                                src={preview || `/storage/${product.image}`}
                                alt={product.name}
                                className="h-32 w-32 rounded-lg border object-cover shadow-sm"
                            />
                        </div>
                    )}

                    {/* Replace Image */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <label className="mb-1 block text-sm font-medium">Replace Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                            className="w-full text-gray-700 dark:text-gray-200"
                        />
                        {(clientErrors.image || errors.image) && (
                            <div className="mt-1 text-sm text-red-600">{clientErrors.image || errors.image}</div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="col-span-1 flex justify-between gap-4 md:col-span-2 md:justify-end lg:col-span-3">
                        <button
                            type="button"
                            onClick={() => router.visit(route('admin.products.index'))}
                            className="rounded-lg bg-gray-300 px-6 py-2 text-gray-800 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || Object.keys(clientErrors).length > 0}
                            className="rounded-lg bg-yellow-500 px-6 py-2 text-white transition hover:bg-yellow-600 disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
