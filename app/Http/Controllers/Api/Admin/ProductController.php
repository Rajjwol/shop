<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // Get all products (ordered by ID)
    public function index()
    {
        $products = Product::orderBy('id')->get();
        return response()->json($products);
    }

    // Store new product (reuse deleted IDs)
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
            'message' => 'Product created successfully!',
            'product' => $product,
        ], 201);
    }

    // Show single product
    public function show(Product $product)
    {
        return response()->json($product);
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
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product,
        ]);
    }

    // Delete product and resequence IDs
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        $products = Product::orderBy('id')->get();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $newId = 1;
        foreach ($products as $p) {
            DB::table('products')->where('id', $p->id)->update(['id' => $newId]);
            $newId++;
        }

        DB::statement("ALTER TABLE products AUTO_INCREMENT = " . $newId);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return response()->json(['message' => 'Product deleted and IDs fixed successfully!']);
    }
}
