<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // ✅ Add this line

class DatabaseSeeder extends Seeder
{
 public function run(): void
{
    User::create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'role' => 'admin',
        'password' => Hash::make('password123'),
    ]);

    User::create([
        'name' => 'Customer User',
        'email' => 'customer@example.com',
        'role' => 'customer',
        'password' => Hash::make('password123'),
    ]);
}
}
