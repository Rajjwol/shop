<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Purchase;

class CartController extends Controller
{
    /**
     * Add a product to the cart (API)
     */
    public function add(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'You must be logged in to add items to the cart.'], 401);
        }

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Store cart in session (for now, could also use DB)
        $cart = session()->get('cart', []);

        $productId = $request->product_id;
        $quantity = $request->quantity;

        // Add or update quantity
        $cart[$productId] = ($cart[$productId] ?? 0) + $quantity;

        session()->put('cart', $cart);

        return response()->json([
            'message' => 'Product added to cart successfully!',
            'cart' => $cart
        ]);
    }

    /**
     * View cart items (API)
     */
    public function index(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return response()->json(['cartItems' => [], 'cartTotal' => 0]);
        }

        $products = Product::whereIn('id', array_keys($cart))->get();

        $cartItems = $products->map(function ($product) use ($cart) {
            $quantity = $cart[$product->id];
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'total' => $product->price * $quantity,
                'image' => $product->image,
                'stock' => $product->stock,
            ];
        });

        return response()->json([
            'cartItems' => $cartItems,
            'cartTotal' => $cartItems->sum('total'),
        ]);
    }

    /**
     * Remove a product from cart (API)
     */
    public function remove(Request $request, $productId)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);

            return response()->json(['message' => 'Product removed from cart.', 'cart' => $cart]);
        }

        return response()->json(['error' => 'Product not found in cart.'], 404);
    }

    /**
     * Complete purchase (API)
     */
    public function purchase(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return response()->json(['error' => 'Cart is empty!'], 400);
        }

        $products = Product::whereIn('id', array_keys($cart))->get();

        foreach ($products as $product) {
            $quantity = $cart[$product->id];

            if ($product->stock < $quantity) {
                return response()->json(['error' => "Not enough stock for {$product->name}."], 400);
            }

            // Deduct stock
            $product->stock -= $quantity;
            $product->save();

            // Record purchase
            Purchase::create([
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
                'total' => $product->price * $quantity,
            ]);
        }

        // Clear cart
        session()->forget('cart');

        return response()->json(['message' => 'Purchase completed successfully!']);
    }
}
