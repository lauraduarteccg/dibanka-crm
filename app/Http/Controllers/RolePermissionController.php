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

}
