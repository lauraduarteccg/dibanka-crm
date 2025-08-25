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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeManagement = TypeManagement::with('campaign')->paginate(10);

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
        return collect($request->input('campaign_id'))
            ->map(function ($id) use ($request) {
                return TypeManagement::create([
                    'campaign_id' => $id,
                    'name'        => $request->input('name'),
                ])->load('campaign');
            });
    });

    return TypeManagementResource::collection($created)
        ->response()
        ->setStatusCode(Response::HTTP_CREATED);
}



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $management = TypeManagement::with(['campaign'])->find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new TypeManagementResource($management);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validar los datos que llegan
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'campaign_id'   => 'nullable|exists:campaigns,id',
            'is_active'     => 'boolean',
        ]);

        // Buscar el registro
        $management = TypeManagement::find($id);

        if (!$management) {
            return response()->json(
                ['message' => 'Gestión no encontrada'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Actualizar con los datos validados
        $management->update($validated);

        // Retornar el recurso actualizado
        return new TypeManagementResource($management);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $management = TypeManagement::find($id);
        $management->update(['is_active' => $management->is_active ? false : true]);
        return response()->json(['message' => 'Tipo de gestión desactivado correctamente'], Response::HTTP_OK);
    }
}
