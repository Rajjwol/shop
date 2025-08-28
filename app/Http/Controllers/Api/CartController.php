<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\CartItem;
use App\Models\Purchase;

class CartController extends Controller
{
    /**
     * Add product to cart
     */
    public function add(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to add items to cart.'
            ], 401);
        }

        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['product_id']);

        if ($data['quantity'] > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => "Only {$product->stock} items available."
            ], 400);
        }

        // Either update or create new cart item
        $cartItem = CartItem::firstOrNew([
            'user_id'    => $user->id,
            'product_id' => $product->id,
        ]);

        $cartItem->quantity = ($cartItem->exists ? $cartItem->quantity : 0) + $data['quantity'];

        // cap quantity at stock
        if ($cartItem->quantity > $product->stock) {
            $cartItem->quantity = $product->stock;
        }

        $cartItem->save();

        return response()->json([
            'success'  => true,
            'message'  => 'Product added to cart!',
            'cartItem' => $cartItem->load('product'),
        ]);
    }

    /**
     * Show current user cart
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $items = CartItem::with('product')
            ->where('user_id', $user->id)
            ->get();

        $cartItems = $items->map(function ($item) {
            return [
                'id'       => $item->product->id,
                'name'     => $item->product->name,
                'price'    => $item->product->price,
                'quantity' => $item->quantity,
                'total'    => $item->quantity * $item->product->price,
                'image'    => $item->product->image,
                'stock'    => $item->product->stock,
            ];
        });

        return response()->json([
            'success'   => true,
            'cartItems' => $cartItems,
            'cartTotal' => $cartItems->sum('total'),
        ]);
    }

    /**
     * Remove product from cart
     */
    public function remove(Request $request, $productId)
    {
        $user = $request->user();

        $deleted = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Product removed from cart.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Product not found in cart.'
        ], 404);
    }

    /**
     * Complete purchase and clear cart
     */
    public function purchase(Request $request)
    {
        $user = $request->user();
        $items = CartItem::with('product')
            ->where('user_id', $user->id)
            ->get();

        if ($items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty!'
            ], 400);
        }

        foreach ($items as $item) {
            $product = $item->product;

            if ($product->stock < $item->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Not enough stock for {$product->name}."
                ], 400);
            }

            // deduct stock
            $product->decrement('stock', $item->quantity);

            // record purchase
            Purchase::create([
                'user_id'    => $user->id,
                'product_id' => $product->id,
                'quantity'   => $item->quantity,
                'price'      => $product->price,
                'total'      => $product->price * $item->quantity,
            ]);
        }

        // clear cart
        CartItem::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase completed successfully!'
        ]);
    }
}
