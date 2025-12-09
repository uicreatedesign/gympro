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
            
            // Check if user has admin roles first
            $hasAdminRole = $user->roles()->whereIn('name', ['Admin', 'Manager', 'Trainer', 'Viewer'])->exists();
            
            if ($hasAdminRole && $request->is('member/*')) {
                return redirect('/dashboard');
            }
            
            // Check if user has Member role only
            $hasMemberRole = $user->roles()->where('name', 'Member')->exists();
            
            if ($hasMemberRole && !$hasAdminRole && $request->is('dashboard')) {
                return redirect('/member/dashboard');
            }
        }
        
        return $next($request);
    }
}
