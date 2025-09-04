<?php

namespace App\Http\Controllers;

use App\Models\TypeManagement;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\TypeManagementResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\TypeManagementRequest;

class TypeManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = TypeManagement::with(('payroll'));

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");
                
                // Para buscar en relaciones
                $q->orWhereHas('payroll', function($userQuery) use ($searchTerm) {
                $userQuery->where('name', 'LIKE', "%{$searchTerm}%")
                         ->orWhere('type', 'LIKE', "%{$searchTerm}%");
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
                'total_payroll' => $typeManagement->total(),
            ]
        ], Response::HTTP_OK);
    }

    public function store(TypeManagementRequest $request)
    {
        $created = DB::transaction(function () use ($request) {
            
            $type = TypeManagement::create([
                'name'      => $request->input('name'),
                'is_active' => 1,
            ]);

            $type->payroll()->sync($request->input('payroll_id', []));

            return $type->load('payroll');
        });

        return (new TypeManagementResource($created))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(string $id)
    {
        $management = TypeManagement::with(['user', 'contact'])->findOrFail($id);
        return response()->json([
            'message' => 'Tipo de gestion encontrada',
            'management type' => new TypeManagementResource($id)
        ]);

        return new TypeManagementResource($management);
    }

    public function update(TypeManagementRequest $request, string $id)
    {
        $management = TypeManagement::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        // Actualizar datos del tipo
        $management->update([
            'name' => $request['name'],
            'is_active' => $request['is_active'] ?? $management->is_active,
        ]);

        // Si vienen payroll_id, sincronizamos la relación
        if (!empty($validated['payroll_id'])) {
            $management->payroll()->sync($request['payroll_id']);
        }

        return new TypeManagementResource($management->load('payroll'));
    }

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