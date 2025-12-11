<?php

namespace App\Http\Controllers;

use App\Models\TypeManagement;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\TypeManagementResource;
use App\Http\Requests\TypeManagementRequest;

class TypeManagementController extends Controller
{
    // Listar tipos de gestión con paginación y búsqueda
    public function index(Request $request)
    {
        $query = TypeManagement::with('payrolls');

        if ($request->filled('search')) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Buscar también en payrolls
                $q->orWhereHas('payrolls', function ($p) use ($searchTerm) {
                    $p->where('name', 'LIKE', "%{$searchTerm}%");
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

    // Crear tipo de gestión
    public function store(TypeManagementRequest $request)
    {
        $typeManagement = TypeManagement::create($request->validated());

        // Si vienen payrolls, asociarlos
        if ($request->has('payrolls')) {
            $typeManagement->payrolls()->sync($request->payrolls);
        }

        log_activity('crear', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} creó un tipo de gestión.",
            'typeManagement_id' => $typeManagement->id
        ], $request);

        return response()->json([
            'message' => 'Tipo de gestion creada con éxito',
            'typeManagement' => new TypeManagementResource($typeManagement)
        ], Response::HTTP_CREATED);
    }

    // Tipos de gestión activos (sin paginación)
    public function active(Request $request)
    {
        $managements = TypeManagement::with('payrolls')
            ->where('is_active', 1)
            ->get();

        log_activity('ver_activos', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} consultó los tipos de gestión activos."
        ], $request);

        return response()->json([
            'message' => 'Tipos de gestiones activas obtenidas con éxito',
            'typeManagement' => TypeManagementResource::collection($managements)
        ], Response::HTTP_OK);
    }

    // Mostrar un tipo de gestión específico
    public function show(Request $request, string $id)
    {
        $management = TypeManagement::with('payrolls')->find($id);

        if (!$management) {
            return response()->json(['message' => 'Tipo de gestion no encontrado'], Response::HTTP_NOT_FOUND);
        }

        log_activity('ver_detalle', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle del tipo de gestión ID {$management->id}.",
            'id' => $management->id
        ], $request);

        return response()->json([
            'message' => 'Tipo de gestion encontrada',
            'typeManagement' => new TypeManagementResource($management)
        ], Response::HTTP_OK);
    }

    // Actualizar un tipo de gestión
    public function update(Request $request, string $id)
    {
        $management = TypeManagement::with('payrolls')->findOrFail($id);

        // Estado antes de actualizar
        $before = $management->toArray();

        // Primero sincronizamos la tabla pivote si vienen payrolls
        if ($request->has('payrolls')) {
            $management->payrolls()->sync($request->payrolls);
        }

        // Actualizar los campos normales del modelo
        $management->update($request->except('payrolls'));

        // Estado completo después del update y sync
        $after = $management->fresh()->load('payrolls')->toArray();

        log_activity('actualizar', 'Tipo de Gestión', [
            'mensaje' => "El usuario {$request->user()->name} actualizó el tipo de gestión ID {$management->id}.",
            'cambios' => [
                'antes' => $before,
                'después' => $after
            ],
            'type_management_id' => $management->id
        ], $request);

        return response()->json([
            'success' => true,
            'message' => 'Tipo de gestión actualizada con éxito',
            'typeManagement' => new TypeManagementResource($management->fresh())
        ], Response::HTTP_OK);
    }

    // Activar / desactivar tipo de gestión
    public function destroy(Request $request, string $id)
    {
        $management = TypeManagement::findOrFail($id);

        // Nuevo estado (toggle)
        $newState = $management->is_active ? 0 : 1;

        // Actualizar estado
        $management->update(['is_active' => $newState]);

        // Si se DESACTIVA → eliminar relaciones de la tabla pivote
        if ($newState === 0) {
            \DB::table('type_management_payroll')
                ->where('type_management_id', $management->id)
                ->delete();
        }

        log_activity(
            $newState ? 'activar tipo gestión' : 'desactivar tipo gestión',
            'Tipo de Gestión',
            [
                "mensaje" => "Se ha " . ($newState ? "activado" : "desactivado") . " un tipo de gestión",
                "type_management_id" => $management->id
            ],
            $request
        );

        return response()->json([
            'message' => $newState
                ? 'Tipo de gestión activado correctamente'
                : 'Tipo de gestión desactivado correctamente (relaciones eliminadas)',
            'typeManagement' => new TypeManagementResource($management)
        ], Response::HTTP_OK);
    }

    // Contar tipos de gestiones
    public function count()
    {
        // Contar solo las tipos de gestiones activas
        $total = TypeManagement::where('is_active', 1)->count();


        // Retornar respuesta JSON
        return response()->json([
            'count' => $total
        ], Response::HTTP_OK);
    }

}
