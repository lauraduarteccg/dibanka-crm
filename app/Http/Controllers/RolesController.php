<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Response;
use Exception;

class RolesController extends Controller
{
    public function index()
    {
        try {
            $roles = Role::select('id', 'name')->paginate(5);

            return response()->json([
                'message'    => 'Roles obtenidos correctamente.',
                'roles'      => $roles->items(), // registros de la página actual
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
