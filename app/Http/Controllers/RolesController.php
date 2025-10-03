<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Response;
use Exception;
use Carbon\Carbon;

class RolesController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::select('id', 'name', 'created_at')->paginate(5);


            $rolesFormatted = $roles->getCollection()->map(function ($role) {
                return [
                    'id'         => $role->id,
                    'name'       => $role->name,

                    'created_at' => $role->created_at->format('d/m/Y H:i:s'),
                ];
            });

            return response()->json([
                'message'    => 'Roles obtenidos correctamente.',
                'roles'      => $rolesFormatted,
                'pagination' => [
                    'current_page'  => $roles->currentPage(),
                    'total_pages'   => $roles->lastPage(),
                    'per_page'      => $roles->perPage(),
                    'total_roles'   => $roles->total(),
                    'next_page_url' => $roles->nextPageUrl(),
                    'prev_page_url' => $roles->previousPageUrl(),
                ]
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los roles.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
   
}
