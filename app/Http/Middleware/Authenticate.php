<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Si el usuario no está autenticado, devolvemos JSON (no redirección).
     */
    protected function redirectTo($request): ?string
    {
        if (! $request->expectsJson()) {
            abort(response()->json([
                'message' => 'Inicia sesión para acceder a este recurso.',
                'error' => 'Unauthorized',
            ], 401));
        }

        return null;
    }
}
