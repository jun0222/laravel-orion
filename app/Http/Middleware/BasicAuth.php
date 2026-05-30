<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BasicAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = config('app.basic_auth_user');
        $password = config('app.basic_auth_password');

        if (! $user || ! $password) {
            return $next($request);
        }

        if ($request->getUser() === $user && $request->getPassword() === $password) {
            return $next($request);
        }

        return response('Unauthorized', 401, [
            'WWW-Authenticate' => 'Basic realm="Restricted"',
        ]);
    }
}