<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Monitoring;
use App\Http\Resources\MonitoringResource;

class MonitoringController extends Controller
{
    /**
     * Listar todas las seguimientos con paginación
     */
    public function index(Request $request)
    {
        $query = Monitoring::query();

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");
            });
        }

        $monitoring = $query->paginate(10);

        return response()->json([
            'message'       => 'Seguimientos obtenidos con éxito',
            'monitorings' => MonitoringResource::collection($monitoring),
            'pagination'    => [
                'current_page'          => $monitoring->currentPage(),
                'total_pages'           => $monitoring->lastPage(),
                'per_page'              => $monitoring->perPage(),
                'total_monitorings'   => $monitoring->total(),
                'next_page_url'         => $monitoring->nextPageUrl(),
                'prev_page_url'         => $monitoring->previousPageUrl(),
            ],
        ], Response::HTTP_OK);
    }
    // Trae solo consultas
    public function active()
    {
        $monitoring = Monitoring::active()->paginate(10);

        return response()->json([
            'message'       => 'Seguimientos activos obtenidos con éxito',
            'monitorings' => MonitoringResource::collection($monitoring),
            'pagination'    => [
                'current_page'          => $monitoring->currentPage(),
                'total_pages'           => $monitoring->lastPage(),
                'per_page'              => $monitoring->perPage(),
                'total_monitoring'   => $monitoring->total(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Crear una nueva consulta
     */
    public function store(Request $request)
    {
        $monitoring = Monitoring::create($request->all());

        return response()->json([
            'message' => 'Seguimiento creado con éxito',
            'monitoring' => new MonitoringResource($monitoring)
        ], Response::HTTP_CREATED);
    }

    
    /**
     * Mostrar un seguimiento específico
     */
    public function show(string $id)
    {
        $monitoring = Monitoring::find($id);

        if (!$monitoring) {
            return response()->json([
                'message' => 'Contacto no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message' => 'Consulta encontrada',
            'contact' => new MonitoringResource($monitoring)
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar una consulta
     */
    public function update(Request $request, $id)
    {
        $monitoring = Monitoring::findOrFail($id);

        $monitoring->update($request->all());

        return response()->json([
            'message' => 'Consulta actualizada con exito',
            'monitoring' => new MonitoringResource($monitoring)
        ]);
    }

    /**
     * Activar/Desactivar un seguimiento
     */
    public function destroy($id)
    {
        $monitoring = Monitoring::findOrFail($id);

        $monitoring->update(['is_active' => !$monitoring->is_active]);

        return response()->json([
            'message' => $monitoring->is_active
                        ? 'Seguimiento activado correctamente'
                        : 'Seguimiento desactivado correctamente',
            'monitoring' => new MonitoringResource($monitoring)
            
        ], Response::HTTP_OK);
        
    }
}
