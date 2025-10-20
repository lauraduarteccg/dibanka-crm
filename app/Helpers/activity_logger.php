<?php

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

if (!function_exists('log_activity')) {
    /**
     * Registra una acción del usuario en la tabla activity_logs.
     *
     * @param string $action       Acción realizada (create, update, delete, login, etc.)
     * @param mixed $model         Modelo afectado (opcional)
     * @param array|null $changes  Datos de los cambios (opcional)
     * @param Request|null $request Petición actual (opcional)
     */
    function log_activity(string $action, $model = null, $changes = null, Request $request = null)
    {
        $user = Auth::user();
        $ip = $request?->ip() ?? request()->ip();
        $agent = $request?->userAgent() ?? request()->userAgent();

        ActivityLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'entity_type' => $model ,
     
            'changes' => $changes,
            'ip_address' => $ip,
            'user_agent' => $agent,
        ]);
    }
}
