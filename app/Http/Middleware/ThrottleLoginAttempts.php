<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ThrottleLoginAttempts
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    public function handle(Request $request, Closure $next, int $maxAttempts = 5, int $decayMinutes = 1): Response
    {
        $key = $this->resolveRequestSignature($request);

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            $seconds = $this->limiter->availableIn($key);
            
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . ceil($seconds / 60) . ' minutes.',
                'retry_after' => $seconds,
            ], 429);
        }

        $this->limiter->hit($key, $decayMinutes * 60);

        $response = $next($request);

        // Clear rate limit on successful login
        if ($response->isSuccessful() && $request->user()) {
            $this->limiter->clear($key);
        }

        return $response;
    }

    protected function resolveRequestSignature(Request $request): string
    {
        $email = $request->input('email', '');
        $ip = $request->ip();
        
        return 'login_attempts:' . sha1($email . '|' . $ip);
    }
}
