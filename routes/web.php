<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\AdminDashboardController;

// ------------------ Public route ------------------
Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

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
