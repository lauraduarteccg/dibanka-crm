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

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('payroll', function ($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $typeManagement = $query->paginate(10);
        log_activity('ver_listado', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el listado de tipos de gestión" .
                ($request->filled('search') ? " con filtro '{$request->search}'" : ""),
            'criterios' => ['búsqueda' => $request->search ?? null]
        ], $request);

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
        log_activity('ver_activos', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} consultó los tipos de gestión activos.",
            'typeManagement_id' => $typeManagement->id
        ], $request);
        return response()->json([
            'message' => 'Tipo de gestion creada con éxito',
            'typeManagement' => new TypeManagementResource($typeManagement)
        ], Response::HTTP_CREATED);
    }

    // Trae solo tipos de gestion activos sin paginacion
    public function active(Request $request)
    {
        $managements = TypeManagement::where('is_active', 1)->get();

        log_activity('ver_activos', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} consultó los tipos de gestión activos."
        ], $request);

        return response()->json([
            'message'    => 'Tipos de gestiones activas obtenidas con éxito',
            'typeManagement'       => TypeManagementResource::collection($managements)
        ], Response::HTTP_OK);
    }


    // Ver un tipo de gestion en especifico
    public function show(Request $request, string $id)
    {
        $management = TypeManagement::find($id);

        if (! $management) {
            return response()->json(['message' => 'Tipo de gestion no encontrado'], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle del tipo de gestión ID {$management->id}.",
            'management_id' => $management->id
        ], $request);

        return response()->json([
            'message' => 'Tipo de gestion encontrada',
            'specific' => new TypeManagementResource($management)
        ], Response::HTTP_OK);
    }

    // Actualizar tipo de gestion
    public function update(TypeManagementRequest $request, string $id)
    {
        $management = TypeManagement::findOrFail($id);
        $management->update($request->all());
        $dataBefore = $management->toArray();

        log_activity('actualizar', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} actualizó el tipo de gestión ID {$management->id}.",
            'cambios' => [
                'antes' => $dataBefore,
                'después' => $management->toArray()
            ]
        ], $request);
        return response()->json([
            'succes' => true,
            'message' => 'Consults especifica actualizada con exito',
            'specific' => new TypeManagementResource($management)
        ], Response::HTTP_OK);
    }

    // Desactivar un tipo de gestion
    public function destroy(Request $request,string $id)
    {
        $management = TypeManagement::find($id);


        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }
        log_activity(
            $management->is_active ? 'activar' : 'desactivar',
            'Tipo de Gestión',
            [
                'mensaje' => "El usuario {$request->user()->name} " .
                    ($management->is_active ? 'activó' : 'desactivó') .
                    " el tipo de gestión ID {$management->id}.",
                'tipo_gestión_id' => $id,

            ],
            $request
        );
        $management->update(['is_active' => $management->is_active ? false : true]);
        return response()->json(['message' => 'Tipo de gestión desactivado correctamente'], Response::HTTP_OK);
    }
}
