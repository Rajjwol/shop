<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    // Show homepage with all products
    public function index()
    {
        $products = Product::all();

        return Inertia::render('dashboard', [
            'products' => $products,
        ]);
    }

    // Show single product detail
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('ProductDetail', [
            'product' => $product,
        ]);
    }

}
