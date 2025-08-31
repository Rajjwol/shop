<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Api\Auth\ApiLoginController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\CartController;

// ------------------ Public API routes ------------------

// Store / Products
Route::get('/products', [StoreController::class, 'index']); // All products
Route::get('/products/{id}', [StoreController::class, 'show']); // Single product

// Cart
Route::post('/cart/add', [CartController::class, 'add']);
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart/purchase', [CartController::class, 'purchase']);
Route::delete('/cart/{product}', [CartController::class, 'remove']);

// ------------------ Authentication ------------------
// For APIs, we usually return JSON instead of views
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [ApiLoginController::class, 'store']);
Route::post('/logout', [ApiLoginController::class, 'destroy'])
    ->middleware('auth:sanctum');

// ------------------ User ------------------
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ------------------ Protected user routes ------------------
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to your dashboard!',
            'user' => Auth::user()
        ]);
    });
});

// ------------------ Admin routes ------------------
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});
