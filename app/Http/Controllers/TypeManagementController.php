<?php

namespace App\Http\Controllers;

use App\Models\TypeManagement;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\TypeManagementResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TypeManagementController extends Controller
{
    public function index()
    {
        $typeManagement = TypeManagement::with('campaigns')->paginate(10);

        return response()->json([
            'message' => 'Tipos de gestion obtenidas con éxito',
            'typeManagement' => TypeManagementResource::collection($typeManagement),
            'pagination' => [
                'current_page' => $typeManagement->currentPage(),
                'total_pages' => $typeManagement->lastPage(),
                'per_page' => $typeManagement->perPage(),
                'total_campaigns' => $typeManagement->total(),
            ]
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $rules = [
            'campaign_id'   => 'required|array|min:1',
            'campaign_id.*' => 'integer|exists:campaigns,id',
            'name'          => 'required|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $created = DB::transaction(function () use ($request) {
            // Crear UN solo tipo de gestión
            $type = TypeManagement::create([
                'name' => $request->input('name'),
                'is_active' => 1,
            ]);

            // Sincronizar las campañas en la tabla pivote
            $type->campaigns()->sync($request->input('campaign_id'));

            return $type->load('campaigns');
        });

        return (new TypeManagementResource($created))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(string $id)
    {
        $management = TypeManagement::with(['campaigns'])->find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new TypeManagementResource($management);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'campaign_id'   => 'nullable|array',
            'campaign_id.*' => 'integer|exists:campaigns,id',
            'is_active'     => 'boolean',
        ]);

        $management = TypeManagement::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        // Actualizar datos del tipo
        $management->update([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'] ?? $management->is_active,
        ]);

        // Si vienen campaign_id, sincronizamos la relación
        if (!empty($validated['campaign_id'])) {
            $management->campaigns()->sync($validated['campaign_id']);
        }

        return new TypeManagementResource($management->load('campaigns'));
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