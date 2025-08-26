import AdminLayout from '@/layouts/AdminLayout';
import { Link, usePage } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string | null; // optional image
}



interface Flash {
  success?: string;
  error?: string;
}


export default function Index() {
    const page = usePage();
    const { products = [], flash } = page.props as { products?: Product[]; flash?: Flash };

    return (
        <AdminLayout title="Products">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Products</h1>

                <Link href={route('admin.products.create')} className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                    + Add Product
                </Link>
            </div>

            {/* Flash message */}
            {flash?.success && <div className="mb-4 rounded bg-green-100 p-3 text-green-800">{flash.success}</div>}

            {/* Product Table */}
            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                Stock
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                        {product.image ? (
                                            <img src={`/storage/${product.image}`} alt={product.name} className="h-12 w-12 rounded object-cover" />
                                        ) : (
                                            'No image'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">${product.price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{product.stock}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
