<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Response;

class RoleController extends Controller
{
public function index(Request $request)
{
    // 📌 Capturar el término de búsqueda (si existe)
    $search = $request->input('search');

    // 📌 Query base con relaciones
    $query = Role::with('permissions');

    // 📌 Si hay búsqueda, filtrar por nombre
    if ($search) {
        $query->where('name', 'LIKE', "%{$search}%");
    }

    // 📌 Paginar (por defecto 10 por página)
    $roles = $query->paginate(10);

    // 📌 Registrar la actividad
    log_activity('ver_listado', 'Roles', [
        'mensaje' => "El usuario {$request->user()->name} visualizó el listado de roles.",
        'busqueda' => $search,
        'total_roles' => $roles->total()
    ], $request);

    // 📌 Devolver respuesta
    return response()->json([
        'roles' => $roles->items(),
        'pagination' => [
            'current_page' => $roles->currentPage(),
            'total_pages' => $roles->lastPage(),
            'total_items' => $roles->total(),
            'per_page' => $roles->perPage(),
        ],
    ], Response::HTTP_OK);
}


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'required|array|min:1',
        ]);

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($data['permissions']);
        log_activity('crear', 'Roles', [
            'mensaje' => "El usuario {$request->user()->name} creó un nuevo rol.",
            'nombre' => $role->name,
            'permisos_asignados' => $data['permissions']
        ], $request);

        return response()->json([
            'message' => 'Rol creado correctamente',
            'role' => $role->load('permissions'),
        ], Response::HTTP_CREATED);
    }
    public function show(Request $request, $id)
    {
        $role = Role::with('permissions')->findOrFail($id);


        log_activity('ver_detalle', 'Roles', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle del rol '{$role->name}'.",
            'id_rol' => $role->id
        ], $request);

        return response()->json([
            'mensaje' => 'Rol encontrado',
            'rol' => [
                'id' => $role->id,
                'nombre' => $role->name,
                'permisos' => $role->permissions->pluck('name'),
            ],
        ], Response::HTTP_OK);
    }


    public function update(Request $request, Role $role)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array|min:1',
        ]);
        $dataBefore = $role->toArray();
        if (isset($data['name'])) {
            $role->update(['name' => $data['name']]);
        }

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }
        log_activity('actualizar', 'Roles', [
            'mensaje' => "El usuario {$request->user()->name} actualizó el rol '{$role->name}'.",
            'cambios' => [
                'antes' => $dataBefore,
                'después' => [
                    'nombre' => $role->name,
                    'permisos' => $role->permissions->pluck('name')->toArray(),
                ],
            ]
        ], $request);

        return response()->json([
            'message' => 'Rol actualizado correctamente',
            'role' => $role->load('permissions'),
        ], Response::HTTP_OK);
    }

    public function destroy(Request $request, Role $role)
    {
        $role->delete();
        log_activity('eliminar', 'Roles', [
            'mensaje' => "El usuario {$request->user()->name} eliminó el rol '{$role->name}'."
        ], $request);
        return response()->json(['message' => 'Rol eliminado.'], Response::HTTP_OK);
    }

    public function getPermissions(Request $request)
    {
        $permissions = Permission::all();

        log_activity('ver_permisos', 'Roles', [
            'mensaje' => "El usuario {$request->user()->name} consultó la lista completa de permisos."

        ], $request);

        return response()->json(['permissions' => $permissions], Response::HTTP_OK);
    }
}
