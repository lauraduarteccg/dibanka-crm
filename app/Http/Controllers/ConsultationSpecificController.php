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

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('consultation', function ($consultationQuery) use ($searchTerm) {
                    $consultationQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $specifics = $query->paginate(10);

        log_activity('ver_listado', 'Consultas  Espefica', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas especifica.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado'
            ]
        ], $request);

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

        log_activity('ver_activas', 'Consultas Especificas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas especifica activas.",
        ], $request);
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

        log_activity('crear', 'Consultas Especificas', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva consulta especifica.",
   
            
            'consulta_id' => $specific->id
        ], $request);

        return response()->json([
            'message' => 'Consulta especifica creada correctamente',
            'specific' => new ConsultationSpecificResource($specific)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(Request $request, string $id)
    {
        $specific = ConsultationSpecific::find($id);

        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Consultas especificas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle de una consulta.",
            'consulta_id' => $id,
        ], $request);

        return response()->json([
            'message' => 'Consulta específica encontrada',
            'specific' => new ConsultationSpecificResource($specific)
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar una consulta específica
     */
    public function update(SpecificConsultRequest $request, $id)
    {
        $specific = ConsultationSpecific::findOrFail($id);
        $dataBefore = $specific->toArray();

        $specific->update($request->all());

        log_activity('actualizar', 'Consultas especificas', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una consulta.",
            'cambios' => [
                'antes' => $dataBefore,
                'despues' => $specific->toArray(),
            ],
            'consulta_id' => $specific->id,
        ], $request);
        return response()->json([
            'succes' => true,
            'message' => 'Consults especifica actualizada con exito',
            'specific' => new ConsultationSpecificResource($specific)
        ], Response::HTTP_OK);
    }

    /**
     * Activar/Desactivar (toggle) una consulta específica
     */
    public function destroy(Request $request, string $id)
    {
        $specific = ConsultationSpecific::find($id);

        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $specific->update(['is_active' => $specific->is_active ? 0 : 1]);


        log_activity(
            $specific->is_active ? 'activar consulta' : 'desactivar consulta',
            'Consultas',
            [
                "message" => "Se ha" . $specific->is_active ? 'activado' : 'desactivado' . " una consulta",
            ],
            $request
        );
        return response()->json(['message' => 'Consulta específica actualizada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contar todas las consultas específicas
     */
    public function count()
    {
        $count = ConsultationSpecific::where('is_active', 1)->count();

        return response()->json(['estadisticas' => $count], Response::HTTP_OK);
    }
}
