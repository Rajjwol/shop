import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    price: '',
    stock: '',
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'image' && e.target.files) {
      setData('image', e.target.files[0]);
    } else {
      setData(e.target.name as keyof typeof data, e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.products.store'), { forceFormData: true });
  };

  return (
    <AdminLayout title="Add Product">
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          Add New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition"
              placeholder="Enter product name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition"
                placeholder="Enter price"
                required
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={data.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white transition"
                placeholder="Enter stock quantity"
                required
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="block w-full text-gray-700 dark:text-gray-200 file:border file:border-gray-300 dark:file:border-gray-600 file:px-4 file:py-2 file:rounded-lg file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-white hover:file:bg-gray-200 dark:hover:file:bg-gray-600 transition"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
