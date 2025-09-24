<?php

namespace App\Http\Controllers;

use App\Models\TypeManagement;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\TypeManagementResource;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\TypeManagementRequest;

class TypeManagementController extends Controller
{
    // Consultar todos los tipos de gestión
    public function index(Request $request)
    {
        $query = TypeManagement::with(('payroll'));

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");
                
                // Para buscar en relaciones
                $q->orWhereHas('payroll', function($userQuery) use ($searchTerm) {
                $userQuery->where('name', 'LIKE', "%{$searchTerm}%");
               });
            });
        }

        $typeManagement = $query->paginate(10);

        return response()->json([
            'message' => 'Tipos de gestion obtenidas con éxito',
            'typeManagement' => TypeManagementResource::collection($typeManagement),
            'pagination' => [
                'current_page' => $typeManagement->currentPage(),
                'total_pages' => $typeManagement->lastPage(),
                'per_page' => $typeManagement->perPage(),
                'total_managements' => $typeManagement->total(),
            ]
        ], Response::HTTP_OK);
    }

    //Crear tipo de gestion
    public function store(TypeManagementRequest $request)
    {
        $typeManagement = TypeManagement::create($request->all());

        return response()->json([
            'message' => 'Tipo de gestion creada con éxito',
            'typeManagement' => new TypeManagementResource($typeManagement)
        ], Response::HTTP_CREATED);
    }
    
    // Trae solo tipos de gestion
    public function active(Request $request)
    {
        $managements = TypeManagement::where('is_active', 1)->paginate(10);

        return response()->json([
            'message'    => 'Gestiones activas obtenidas con éxito',
            'typeManagement'       => TypeManagementResource::collection($managements),
            'pagination' => [
                'current_page' => $managements->currentPage(),
                'total_pages'  => $managements->lastPage(),
                'per_page'     => $managements->perPage(),
                'total'        => $managements->total(),
            ],
        ], Response::HTTP_OK);
    }


    // Ver un tipo de gestion en especifico
    public function show(string $id)
    {
        $management = TypeManagement::find($id);

        if (! $management) {
            return response()->json(['message' => 'Tipo de gestion no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return new TypeManagementResource($management);
    }

    // Actualizar tipo de gestion
    public function update(TypeManagementRequest $request, string $id)
    {
        $management = TypeManagement::findOrFail($id);
        $management->update($request->all());

        return response()->json([
            'succes' => true,
            'message' => 'Consults especifica actualizada con exito',
            'specific' => new TypeManagementResource($management)
        ]);
    }

    // Desactivar un tipo de gestion
    public function destroy(string $id)
    {
        $management = TypeManagement::find($id);
        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }
        $management->update(['is_active' => $management->is_active ? false : true]);
        return response()->json(['message' => 'Tipo de gestión desactivado correctamente'], Response::HTTP_OK);
    }
}