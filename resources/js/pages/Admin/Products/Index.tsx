import AdminLayout from '@/layouts/AdminLayout';
import { Link, usePage, router } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string | null;
}

interface Flash {
  success?: string;
  error?: string;
}

export default function Index() {
  const page = usePage();
  const { products = [], flash } = page.props as { products?: Product[]; flash?: Flash };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(route('admin.products.destroy', id));
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Products</h1>
        <Link
          href={route('admin.products.create')}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white font-semibold hover:bg-indigo-700 transition"
        >
          + Add Product
        </Link>
      </div>

      {flash?.success && <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-800">{flash.success}</div>}
      {flash?.error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-800">{flash.error}</div>}

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr className="text-gray-700 dark:text-gray-200 uppercase text-sm tracking-wide">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Stock</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                >
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-center">
                    {product.image ? (
                      <img
                        src={`/storage/${product.image}`}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">${product.price}</td>
                  <td className="px-6 py-4 text-right">{product.stock}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <Link
                      href={route('admin.products.edit', product.id)}
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
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
