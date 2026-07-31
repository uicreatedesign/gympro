<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * Fields that should not be sanitized (e.g., password fields).
     */
    protected array $except = [
        'password',
        'password_confirmation',
        'current_password',
        'new_password',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value, $key) {
            if (!in_array($key, $this->except) && is_string($value)) {
                $value = $this->sanitize($value);
            }
        });

        $request->merge($input);

        return $next($request);
    }

    /**
     * Sanitize the given value.
     *
     * We intentionally do NOT call htmlspecialchars() here.
     * Reasons:
     *   1. Laravel's query builder uses PDO prepared statements — there is no
     *      SQL injection risk from raw string values.
     *   2. Encoding at storage time (middleware) causes double-encoding when
     *      React renders the value (React auto-escapes HTML on output), and
     *      it corrupts search queries, PDF invoices, and CSV exports.
     *   3. HTML encoding is the view layer's responsibility, not storage.
     *
     * We only remove null bytes, which are a genuine storage attack vector
     * (they can truncate strings in C-based libraries).
     */
    protected function sanitize(string $value): string
    {
        // Remove null bytes — the only true string-level threat for PHP/MySQL.
        return str_replace(chr(0), '', $value);
    }
}
