<?php

namespace App\Providers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
            Inertia::share([
        'cartCount' => function () {
            $cart = session()->get('cart', []);
            return array_sum($cart); // total quantity of items
        },
    ]);
    }
}
