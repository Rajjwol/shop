<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // Display all products
    public function index()
    {
        $products = Product::orderBy('id')->get(); // Order by ID
        return Inertia::render('Admin/Products/Index', compact('products'));
    }

    // Show form to create a new product
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    // Store new product (reuse deleted IDs)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048', // optional image
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Find lowest available ID
        $lowestId = DB::table('products')
            ->selectRaw('MIN(id + 1) AS next_id')
            ->whereRaw('id + 1 NOT IN (SELECT id FROM products)')
            ->first()->next_id;

        if ($lowestId) {
            $product = new Product($validated);
            $product->id = $lowestId;
            $product->save();
        } else {
            Product::create($validated);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
    }

    // Show edit form for a product
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', compact('product'));
    }

    // Update product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }

    // Delete a product
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        // Re-sequence all IDs
        $products = Product::orderBy('id')->get();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // Disable foreign key checks temporarily

        $newId = 1;
        foreach ($products as $p) {
            DB::table('products')->where('id', $p->id)->update(['id' => $newId]);
            $newId++;
        }

        // Reset auto-increment
        DB::statement("ALTER TABLE products AUTO_INCREMENT = " . $newId);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // Enable foreign key checks

        return redirect()->route('admin.products.index')->with('success', 'Product deleted and IDs fixed successfully!');
    }
}
