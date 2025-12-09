<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            
            // Check if user has Member role
            $hasMemberRole = $user->roles()->where('name', 'Member')->exists();
            
            if ($hasMemberRole && $request->is('dashboard')) {
                return redirect('/member/dashboard');
            }
            
            // Check if user has admin roles trying to access member dashboard
            $hasAdminRole = $user->roles()->whereIn('name', ['Admin', 'Manager'])->exists();
            
            if ($hasAdminRole && $request->is('member/dashboard')) {
                return redirect('/dashboard');
            }
        }
        
        return $next($request);
    }
}
