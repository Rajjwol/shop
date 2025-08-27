import { useForm } from '@inertiajs/react';
import React from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  // Setup Inertia form
  const { post, processing } = useForm({ product_id: product.id, quantity: 1 });

  // Add to cart function
  const addToCart = () => {
    post(route('cart.add'), {
      onSuccess: () => {
        alert(`${product.name} added to cart!`);
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to add to cart.');
      },
    });
  };

  return (
    <div className="product-card border p-4 rounded shadow-md text-center">
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="cursor-pointer mb-2"
        onClick={() => window.location.href = `/products/${product.id}`}
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-700 mb-2">${product.price}</p>
      <button
        onClick={addToCart}
        disabled={processing || product.stock === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
}
