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

            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('payroll', function($payrolQuery) use ($searchTerm) {
                $payrolQuery->where('name', 'LIKE', "%{$searchTerm}%");
               });
            });
            
        }

        $consultations = $query->paginate(10);

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

        return response()->json([
            'message' => 'Consulta creada con éxito',
            'consultation' => new ConsultationResource($consultation)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(string $id)
    {
        $query = Consultation::query();
        if (method_exists(new Consultation, 'specifics')) {
            $query->with('specifics');
        }

        $consultation = $query->find($id);

        if (! $consultation) {
            return response()->json(['message' => 'Consulta no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new ConsultationResource($consultation);
    }

    /**
     * Actualizar una consulta
     * Permite actualizar y re-sincronizar la tabla pivote opcionalmente
     */
    public function update(ConsultationRequest $request, $id)
    {
        $consultation = Consultation::findOrFail($id);

        $consultation->update($request->all());

        return response()->json([
            'message' => 'Consulta actualizada con exito',
            'consultation' => new ConsultationResource($consultation)
        ]);
    }

    /**
     * Activar/Desactivar (toggle) una consulta
     */
    public function destroy($id)
    {
        $consultation = Consultation::findOrFail($id);

        $consultation->update(['is_active' => !$consultation->is_active]);

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
    public function count()
    {
        $count = Consultation::count();

        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
