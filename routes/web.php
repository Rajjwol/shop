<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\CartController;

// ------------------ Public route ------------------
Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

// ------------------ store route ------------------
Route::get('/', [StoreController::class, 'index'])->name('home');
Route::get('/products/{id}', [StoreController::class, 'show'])->name('products.show');
// ------------------ cart route ------------------
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/purchase', [CartController::class, 'purchase'])->name('cart.purchase');
 Route::post('/dashboard/cart/add', [CartController::class, 'add'])->name('dashboard.cart.add');
Route::delete('/cart/{product}', [CartController::class, 'remove'])->name('cart.remove');
// ------------------ Authentication ------------------
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// ------------------ Logout ------------------
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// ------------------ Protected user routes ------------------
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// ------------------ Admin routes ------------------
Route::prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();

        // Check role from database
        if ($user && $user->role === 'admin') {
            return app(AdminDashboardController::class)->index();
        }

        // Not admin: redirect to homepage
        return redirect('/'); // or use abort(403) if you prefer
    })->name('dashboard');

});
// ------------------ Admin routes ------------------
Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update'); // ✅ fixed
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});


