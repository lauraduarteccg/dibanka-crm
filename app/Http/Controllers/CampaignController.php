<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\CampaingResource;
class CampaignController extends Controller
{
    // Obtener todas las campañas con paginación
    public function index()
    {
        $campaigns = Campaign::paginate(10);
        return response()->json([
            'message' => 'Campañas obtenidas con éxito',
            'campaigns' => CampaingResource::collection($campaigns),
            'pagination' => [
                'current_page' => $campaigns->currentPage(),
                'total_pages' => $campaigns->lastPage(),
                'per_page' => $campaigns->perPage(),
                'total_campaigns' => $campaigns->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Crear una nueva campaña
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $campaign = Campaign::create($request->all());

        return response()->json([
            'message' => 'Campaña creada con éxito',
        ], Response::HTTP_CREATED);
    }

    // Obtener una campaña específica
    public function show(Campaign $campaign)
    {
        return response()->json([
            'message' => 'Campaña encontrada',
            'campaign' => new CampaingResource($campaign)
        ], Response::HTTP_OK);
    }

    // Actualizar una campaña
    public function update(Request $request, Campaign $campaign)
    {
        $campaign->update($request->all());

        return response()->json([
            'message' => 'Campaña actualizada con éxito'
        ], Response::HTTP_OK);
    }

    // Eliminar una campaña
    public function destroy($id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->update(['is_active' => $campaign->is_active ? false : true]);
        return response()->json(['message' => 'campaña desactivado correctamente'], Response::HTTP_OK);
    }

    // Contar campañas
    public function count()
    {
        return response()->json(['count' => Campaign::count()]);
    }
}
