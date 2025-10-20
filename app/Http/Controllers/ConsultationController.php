<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ConsultationResource;
use App\Http\Requests\ConsultationRequest;

class ConsultationController extends Controller
{
    /**
     * Listar todas las consultas con paginación
     */
    public function index(Request $request)
    {
        $query = Consultation::with(['payroll']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('payroll', function ($payrolQuery) use ($searchTerm) {
                    $payrolQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $consultations = $query->paginate(10);
        log_activity('ver_listado', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado'
            ]
        ], $request);


        return response()->json([
            'message'       => 'Consultas obtenidas con éxito',
            'consultations' => ConsultationResource::collection($consultations),
            'pagination'    => [
                'current_page'          => $consultations->currentPage(),
                'total_pages'           => $consultations->lastPage(),
                'per_page'              => $consultations->perPage(),
                'total_consultations'   => $consultations->total(),
                'next_page_url'         => $consultations->nextPageUrl(),
                'prev_page_url'         => $consultations->previousPageUrl(),
            ],
        ], Response::HTTP_OK);
    }

    // Trae solo consultas
    public function active(Request $request)
    {
        $consultations = Consultation::active()->paginate(10);
        log_activity('ver_activas', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas activas.",

        ], $request);

        return response()->json([
            'message'       => 'Consultas activas obtenidas con éxito',
            'consultation' => ConsultationResource::collection($consultations),
            'pagination'    => [
                'current_page'          => $consultations->currentPage(),
                'total_pages'           => $consultations->lastPage(),
                'per_page'              => $consultations->perPage(),
                'total_consultations'        => $consultations->total(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Crear una nueva consulta
     */
    public function store(ConsultationRequest $request)
    {
        $consultation = Consultation::create($request->all());
        log_activity('crear', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva consulta.",
            'consulta_id' => $consultation->id
        ], $request);

        return response()->json([
            'message' => 'Consulta creada con éxito',
            'consultation' => new ConsultationResource($consultation)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(Request $request, string $id)
    {
        $query = Consultation::query();
        if (method_exists(new Consultation, 'specifics')) {
            $query->with('specifics');
        }

        $consultation = $query->find($id);

        if (! $consultation) {
            return response()->json(['message' => 'Consulta no encontrada'], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle de una consulta.",
            'consulta_id' => $id,
        ], $request);

        return response()->json([
            'message' => 'Consulta encontrada',
            'consultation' => new ConsultationResource($consultation)
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar una consulta
     * Permite actualizar y re-sincronizar la tabla pivote opcionalmente
     */
    public function update(ConsultationRequest $request, $id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultationBefore = $consultation->toArray();

        $consultation->update($request->all());

        log_activity('actualizar', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una consulta.",
            'cambios' => [
                'antes' => $consultationBefore,
                'después' => $consultation->toArray(),
            ],
            'consulta_id' => $consultation->id,
        ], $request);

        return response()->json([
            'message' => 'Consulta actualizada con exito',
            'consultation' => new ConsultationResource($consultation)
        ], Response::HTTP_OK);
    }

    /**
     * Activar/Desactivar (toggle) una consulta
     */
    public function destroy(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);


        $consultation->update(['is_active' => $consultation->is_active ? 0 : 1]);

        log_activity(
            $consultation->is_active ? 'activar consulta' : 'desactivar consulta',
            'Consultas',
            [
                "message" => "Se ha" . $consultation->is_active ? 'activado' : 'desactivado' . " una consulta",
            ],
            $request
        );

        return response()->json([
            'message' => $consultation->is_active
                ? 'Consulta activada correctamente'
                : 'Consulta desactivada correctamente',
            'consultation' => new ConsultationResource($consultation)

        ], Response::HTTP_OK);
    }

    /**
     * Contar todas las consultas
     */
    public function count(Request $request)
    {
        $count = Consultation::where('is_active', 1)->count();

        // Registrar acción en el log de auditoría
        log_activity('estadisticas', 'Consultas', [
            'message' => "Contar todas las consultas activas"

        ], $request);



        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
