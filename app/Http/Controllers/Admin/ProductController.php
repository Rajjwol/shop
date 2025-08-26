<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display the product list page.
     */
    public function index()
    {
        // later you can fetch products from DB
        // $products = Product::all();

        return Inertia::render('Admin/Products/Index', [
            // 'products' => $products,
        ]);
    }

    /**
     * Show form to create new product.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    /**
     * Store new product in database.
     */
    public function store(Request $request)
    {
        // validate input
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048', // max 2MB
        ]);
            // Handle image upload
    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('products', 'public');
        $validated['image'] = $path;}

        // Example: if you have a Product model
        // Product::create($validated);
        

        return redirect()->route('admin.products.index')
                         ->with('success', 'Product created successfully!');
    }
}
