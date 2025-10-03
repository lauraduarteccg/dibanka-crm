<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    public function index()
    {
        return response()->json([
            'permissions' => Permission::all()
        ]);
    }

    public function roles()
    {
        return response()->json([
            'roles' => Role::with('permissions')->get()
        ]);
    }

    public function togglePermission(Request $request)
    {
        $role = Role::findOrFail($request->role_id);

        if ($request->checked) {
            // ✅ Asignar permiso
            $role->givePermissionTo($request->permission);
        } else {
            // ❌ Quitar permiso
            $role->revokePermissionTo($request->permission);
        }

        return response()->json(['success' => true]);
    }
     public function show($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        // Agrupamos los permisos por módulo
        $modules = $role->permissions->groupBy(function ($perm) {
            return explode('.', $perm->name)[0]; // prefijo = módulo
        })->map(function ($perms, $module) {
            return [
                'module' => ucfirst($module),
                'permissions' => $perms->map(function ($perm) {
                    $action = explode('.', $perm->name)[1] ?? $perm->name;
                    return [
                        'id' => $perm->id,
                        'name' => $perm->name,
                        'action' => $action,
                    ];
                })->values()
            ];
        })->values();

        return response()->json([
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'modules' => $modules
            ]
        ]);
    }

}
