<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response; // ✅ Add this

class EnsureUserIsAdmin
{
public function handle(Request $request, Closure $next)
{
    if (!auth()->check() || auth()->user()->role !== 'admin') {
        abort(403, 'Access denied.');
    }

    return $next($request);
}

}
