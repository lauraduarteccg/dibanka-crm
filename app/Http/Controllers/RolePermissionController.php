<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Response;

class RolePermissionController extends Controller
{
    public function index(Request $request)
    {
        log_activity('ver_permisos', 'Roles y Permisos', [
            'mensaje' => "El usuario {$request->user()->name} consultó la lista completa de permisos disponibles."
        ], $request);
        return response()->json([
            'permissions' => Permission::all()
        ], Response::HTTP_OK);
    }

    public function roles(Request $request)
    {
        $roles = Role::with('permissions')->get();

        log_activity('ver_roles_con_permisos', 'Roles y Permisos', [
            'mensaje' => "El usuario {$request->user()->name} visualizó todos los roles con sus respectivos permisos."
        ], $request);

        return response()->json([
            'mensaje' => 'Roles obtenidos con éxito',
            'roles' => $roles
        ], Response::HTTP_OK);
    }

    public function togglePermission(Request $request)
    {
        $role = Role::findOrFail($request->role_id);

        if ($request->checked) {
            // ✅ Asignar permiso
            $role->givePermissionTo($request->permission);
            log_activity('asignar_permiso', 'Roles y Permisos', [
                'mensaje' => "El usuario {$request->user()->name} asignó el permiso '{$request->permission}' al rol '{$role->name}'.",
                'rol' => $role->name,
                'permiso' => $request->permission,
                'asignado' => true
            ], $request);
        } else {
            // ❌ Quitar permiso
            $role->revokePermissionTo($request->permission);
            log_activity('revocar_permiso', 'Roles y Permisos', [
                'mensaje' => "El usuario {$request->user()->name} revocó el permiso '{$request->permission}' del rol '{$role->name}'.",
                'rol' => $role->name,
                'permiso' => $request->permission,
                'asignado' => false
            ], $request);
        }


        return response()->json(['success' => true], Response::HTTP_OK);
    }
    public function show(Request $request, $id)
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
  log_activity('ver_permisos_por_rol', 'Roles y Permisos', [
            'mensaje' => "El usuario {$request->user()->name} consultó los permisos asociados al rol '{$role->name}'.",
            'id_rol' => $role->id,
            'nombre_rol' => $role->name,
            'total_módulos' => $modules->count()
        ], $request);

        return response()->json([
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'modules' => $modules
            ]
        ], Response::HTTP_OK);
    }
}
