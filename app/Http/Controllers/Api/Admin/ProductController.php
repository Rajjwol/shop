<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // List all products
    public function index()
    {
        $products = Product::orderBy('id')->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    // Store a new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Find lowest available ID (optional)
        $lowestId = DB::table('products')
            ->selectRaw('MIN(id + 1) AS next_id')
            ->whereRaw('id + 1 NOT IN (SELECT id FROM products)')
            ->first()->next_id;

        if ($lowestId) {
            $product = new Product($validated);
            $product->id = $lowestId;
            $product->save();
        } else {
            $product = Product::create($validated);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully!',
            'data' => $product,
        ]);
    }

    // Show single product
    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    // Update product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully!',
            'data' => $product,
        ]);
    }

    // Delete product
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        // Re-sequence IDs (optional)
        $products = Product::orderBy('id')->get();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $newId = 1;
        foreach ($products as $p) {
            DB::table('products')->where('id', $p->id)->update(['id' => $newId]);
            $newId++;
        }

        DB::statement("ALTER TABLE products AUTO_INCREMENT = " . $newId);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return response()->json([
            'success' => true,
            'message' => 'Product deleted and IDs fixed successfully!',
        ]);
    }
}
