<?php

namespace App\Http\Controllers;

use App\Models\ConsultationSpecific;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ConsultationSpecificResource;
use App\Http\Requests\SpecificConsultRequest;

class ConsultationSpecificController extends Controller
{
    /**
     * Listar todas las consultas específicas con paginación
     */
    public function index(Request $request)
    {
        $query = ConsultationSpecific::with(['consultation']);
        
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('consultation', function($consultationQuery) use ($searchTerm) {
                $consultationQuery->where('name', 'LIKE', "%{$searchTerm}%");
               });
            });
        }

        $specifics = $query->paginate(10);

        return response()->json([
            'message'       => 'Consultas específicas obtenidas con éxito',
            'specifics' => ConsultationSpecificResource::collection($specifics),
            'pagination'    => [
                'current_page'        => $specifics->currentPage(),
                'total_pages'         => $specifics->lastPage(),
                'per_page'            => $specifics->perPage(),
                'total_consultations' => $specifics->total(),
                'next_page_url'       => $specifics->nextPageUrl(),
                'prev_page_url'       => $specifics->previousPageUrl(),
            ],
        ], Response::HTTP_OK);
    }
    
    // Trae solo consultas
    public function active(Request $request)
    {
        $consultations = ConsultationSpecific::active()->paginate(10);

        return response()->json([
            'message'       => 'Consultas especificas activas obtenidas con éxito',
            'consultationspecific' => ConsultationSpecificResource::collection($consultations),
            'pagination'    => [
                'current_page'          => $consultations->currentPage(),
                'total_pages'           => $consultations->lastPage(),
                'per_page'              => $consultations->perPage(),
                'total_consultations'        => $consultations->total(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Crear una nueva consulta específica
     */
    public function store(SpecificConsultRequest $request)
    {
        $specific = ConsultationSpecific::create($request->all());

        return response()->json([
            'message' => 'Consulta especifica creada correctamente',
            'specific' => new ConsultationSpecificResource($specific)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(string $id)
    {
        $specific = ConsultationSpecific::find($id);

        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new ConsultationSpecificResource($specific);
    }

    /**
     * Actualizar una consulta específica
     */
    public function update(SpecificConsultRequest $request, $id)
    {
        $specific = ConsultationSpecific::findOrFail($id);
        $specific->update($request->all());

        return response()->json([
            'succes' => true,
            'message' => 'Consults especifica actualizada con exito',
            'specific' => new ConsultationSpecificResource($specific)
        ]);
    }

    /**
     * Activar/Desactivar (toggle) una consulta específica
     */
    public function destroy(string $id)
    {
        $specific = ConsultationSpecific::find($id);
        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $specific->update(['is_active' => $specific->is_active ? 0 : 1]);

        return response()->json(['message' => 'Consulta específica actualizada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contar todas las consultas específicas
     */
    public function count()
    {
        $count = ConsultationSpecific::count();

        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
