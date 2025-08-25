<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request)
    {
        return Inertia::render('Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // Authenticate user
        $request->authenticate();

        // Regenerate session to prevent fixation
        $request->session()->regenerate();

        $user = Auth::user();

        // Return Inertia response with user info
        return Inertia::render('dashboard', [
            'auth' => [
                'user' => $user,  // <-- send user info to frontend
            ],
            'roleRedirect' => $user->role === 'admin' ? '/Admin/Dashboard' : '/dashboard',
        ]);
    }

    /**
     * Destroy an authenticated session (logout).
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();               // Log out user
        $request->session()->invalidate();          // Clear session
        $request->session()->regenerateToken();     // Regenerate CSRF token

        return redirect('/');                        // Redirect to homepage
    }
}
