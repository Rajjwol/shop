import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";

export default function Create() {
  const [data, setData] = useState({
    name: "",
    price: "",
    stock: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image" && e.target.files) {
      setData({ ...data, image: e.target.files[0] });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    if (data.image) formData.append("image", data.image);

    router.post(route("admin.products.store"), formData);
  };

  return (
    <AdminLayout title="Add Product">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Add Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-gray-700 dark:text-gray-200">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200">Price</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200">Stock</label>
          <input
            type="number"
            name="stock"
            value={data.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full"
            accept="image/*"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </form>
    </AdminLayout>
  );
}
