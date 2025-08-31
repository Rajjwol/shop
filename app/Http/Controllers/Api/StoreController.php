<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    // Show all products
    public function index()
    {
        $products = Product::all();

        return response()->json($products);
    }

    // Show single product detail
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json($product);
    }
}
