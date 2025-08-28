<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\User;
//use App\Models\Product;
use App\Models\Purchase;
class AdminDashboardController extends Controller
{
    public function index()
    {
        // Calculate stats BEFORE returning
        $usersCount  = User::count();
        $ordersCount = Purchase::count();
        $revenue     = Purchase::sum('total');


        // Return Inertia page with stats
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Admin Dashboard',
            'stats' => [
                'users'   => $usersCount,
                'orders'  => $ordersCount,
                'revenue' => $revenue,
            ],
        ]);
    }
}
