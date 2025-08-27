<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Purchase;
class CartController extends Controller
{
    /**
     * Add a product to the session cart
     */
    public function add(Request $request)
    {
        if (!$request->user()) {
            return back()->with('error', 'You must be logged in to add items to the cart.');
        }

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = session()->get('cart', []);

        $productId = $request->product_id;
        $quantity = $request->quantity;

        // Add or update quantity
        $cart[$productId] = ($cart[$productId] ?? 0) + $quantity;

        session()->put('cart', $cart);

        return back()->with('success', 'Product added to cart successfully!');
    }

    /**
     * Show cart page
     */
    public function index()
    {
        $cart = session()->get('cart', []);

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

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            'cartTotal' => $cartItems->sum('total'),
        ]);
    }

    /**
     * Remove a product from cart
     */
    public function remove(Request $request, $productId)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);
            return back()->with('success', 'Product removed from cart.');
        }

        return back()->with('error', 'Product not found in cart.');
    }

    /**
     * Complete the purchase
     */
public function purchase(Request $request)
{
    $cart = session()->get('cart', []);

    if (empty($cart)) {
        return back()->with('error', 'Cart is empty!');
    }

    $products = Product::whereIn('id', array_keys($cart))->get();

    foreach ($products as $product) {
        $quantity = $cart[$product->id];

        if ($product->stock < $quantity) {
            return back()->with('error', "Not enough stock for {$product->name}.");
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

    return back()->with('success', 'Purchase completed successfully!');
}
}
