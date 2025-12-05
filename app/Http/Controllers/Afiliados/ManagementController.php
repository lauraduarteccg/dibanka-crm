<?php

namespace App\Http\Controllers\Afiliados;

use App\Http\Controllers\Controller;
use App\Http\Requests\Afiliados\ManagementRequest;
use App\Http\Requests\UpdateMonitoringRequest;
use App\Models\Afiliados\Management;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\Afiliados\ManagementResource;
use Illuminate\Support\Facades\Validator;

class ManagementController extends Controller
{
    /**
     * Obtener todas las gestiones con información relacionada (paginado).
     */

    public function index(Request $request)
    {
        $query = Management::with(['user', 'payroll', 'consultation', 
        'contact', 'specific', 'monitoring', 'type_management']);

        // 🔎 Buscar directamente por identification_number en la relación contact
        if ($request->has('identification_number') && !empty($request->identification_number)) {
            $query->whereHas('contact', function ($q) use ($request) {
                $q->where('identification_number', $request->identification_number);
            });
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                // Búsqueda en campos principales
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('wolkvox_id', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('solution_date', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('sms', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('wsp', 'LIKE', "%{$searchTerm}%");

                // Búsqueda en relaciones usando un array para evitar repetición
                $relations = [
                    'user' => ['id', 'name', 'email'],
                    'payroll' => ['name'],
                    'consultation' => ['name'],
                    'specific' => ['name'],
                    'type_management' => ['name'],
                    'contact' => [
                        'name',
                        'phone',
                        'update_phone',
                        'email',
                        'identification_type',
                        'identification_number'
                    ]
                ];

                foreach ($relations as $relation => $fields) {
                    $q->orWhereHas($relation, function ($subQuery) use ($searchTerm, $fields) {
                        $subQuery->where(function ($innerQuery) use ($searchTerm, $fields) {
                            foreach ($fields as $field) {
                                $innerQuery->orWhere($field, 'LIKE', "%{$searchTerm}%");
                            }
                        });
                    });
                }
            });
        }

        $management = $query->paginate(10);

        log_activity('ver_listado', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el listado de gestiones" .
                ($request->filled('search') ? " aplicando el filtro: '{$request->search}'" : ""),
            'criterios' => [
                'búsqueda' => $request->search ?? null,
                'identification_number' => $request->identification_number ?? null,
            ]
        ], $request);

        return response()->json([
            'message'       => 'Gestiones obtenidas con éxito',
            'managements'   => ManagementResource::collection($management),
            'pagination'    => [
                'current_page'          => $management->currentPage(),
                'total_pages'           => $management->lastPage(),
                'per_page'              => $management->perPage(),
                'total_management'   => $management->total(),
            ]
        ]);
    }
    /**
     * Obtener una gestión específica con toda su información relacionada.
     */
    public function show(Request $request, $id)
    {
        $management = Management::with([
            'user', 
            'payroll', 
            'consultation', 
            'contact', 
            'specific', 
            'monitoring', 
            'type_management'
        ])->find($id);

        if (!$management) {
            return response()->json([
                'message' => 'Gestión no encontrada'
            ], Response::HTTP_NOT_FOUND);
        }

        log_activity('ver_detalle', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el detalle de la gestión ID {$management->id}.",
            'management_id' => $management->id
        ], $request);

        return response()->json([
            'message' => 'Gestión encontrada',
            'management' => new ManagementResource($management)
        ], Response::HTTP_OK);
    }

    /**
     * Guardar una nueva gestión en la base de datos.
     */
    public function store(ManagementRequest $request)
    {
        $management = Management::create($request->all());

        // Carga relaciones para devolverlas en el resource
        $management->load(['user', 'payroll', 'consultation', 'contact', 'specific', 'monitoring']);

        log_activity('crear', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva gestión.",

            'management_id' => $management->id
        ], $request);

        return response()->json([
            'message' => 'Gestión creada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_CREATED);
    }

    /**
     * Actualizar una gestión existente.
     */
    public function update(Request $request, $id)
    {
        $management = Management::find($id);
        $dataBefore = $management->toArray();

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $management->update($request->all());

        // Recargar relaciones para devolver la info actualizada
        $management->load(['user', 'payroll', 'consultation', 'specific', 'contact', 'monitoring']);
        
        log_activity('actualizar', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una gestión.",
            'cambios' => [
                'anterior' => $dataBefore,
                'despues' => $management->toArray(),
            ]
        ], $request);

        return response()->json([
            'message' => 'Gestión actualizada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_OK);
    }

    // Actualiza unicamente estos dos campos
    public function updateMonitoring(Request $request, $id)
    {
        $management = Management::findOrFail($id);
        $dataBefore = $management->toArray();
        $management->update($request->only(['solution_date', 'monitoring_id']));

        log_activity('actualizar', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una gestión.",
            'detalles' => [
                'antes' => $dataBefore,
                'despues' => $management->toArray()
            ]
        ], $request);


        return response()->json([
            'message' => 'Gestión actualizada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_OK);
    }

    /**
     * Eliminar una gestión.
     */
    public function destroy(Request $request,$id)
    {
        $management = Management::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $management->delete();

       log_activity(
            $management->is_active ? 'activar consulta' : 'desactivar gestion',
            'Gestiones',
            [
                "message" => "Se ha" . $management->is_active ? 'activado' : 'desactivado' . " una gestion",
            ],
            $request
        );
        return response()->json(['message' => 'Gestión eliminada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contador total de gestiones.
     */
    public function count()
    {
        $count = Management::count();

        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
