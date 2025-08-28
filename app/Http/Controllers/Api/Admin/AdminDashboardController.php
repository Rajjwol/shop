<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Purchase;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $usersCount = User::count();
        $ordersCount = Purchase::count();
        $revenue = Purchase::sum('total');

        // Latest 5 purchases
        $recentPurchases = Purchase::with(['user', 'product'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'user' => $purchase->user->name,
                    'product' => $purchase->product->name,
                    'quantity' => $purchase->quantity,
                    'total' => $purchase->total,
                    'created_at' => $purchase->created_at->format('Y-m-d H:i'),
                ];
            });

        return response()->json([
            'success' => true,
            'stats' => [
                'users' => $usersCount,
                'orders' => $ordersCount,
                'revenue' => $revenue,
            ],
            'recentPurchases' => $recentPurchases,
        ]);
    }
}
