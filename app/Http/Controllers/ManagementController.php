<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManagementRequest;
use App\Http\Requests\UpdateMonitoringRequest;
use App\Models\Management;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\ManagementResource;
use Illuminate\Support\Facades\Validator;

class ManagementController extends Controller
{
    /**
     * Obtener todas las gestiones con información relacionada (paginado).
     */

    public function index(Request $request)
    {
        $query = Management::with(['user', 'payroll', 'consultation', 'contact', 'specific', 'monitoring', 'type_management']);
        
        // 🔎 Buscar directamente por identification_number en la relación contact
        if ($request->has('identification_number') && !empty($request->identification_number)) {
            $query->whereHas('contact', function($q) use ($request) {
                $q->where('identification_number', $request->identification_number);
            });
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            
            $query->where(function($q) use ($searchTerm) {
                // Búsqueda en campos principales
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                ->orWhere('wolkvox_id', 'LIKE', "%{$searchTerm}%")
                ->orWhere('solution_date', 'LIKE', "%{$searchTerm}%")
                ->orWhere('sms', 'LIKE', "%{$searchTerm}%")
                ->orWhere('wsp', 'LIKE', "%{$searchTerm}%");
                
                // Búsqueda en relaciones usando un array para evitar repetición
                $relations = [
                    'user' => ['name', 'email'],
                    'payroll' => ['name'],
                    'monitoring' => ['name'],
                    'consultation' => ['name'],
                    'specific' => ['name'],
                    'type_management' => ['name'],
                    'contact' => [
                        'name', 'phone', 'update_phone', 'email', 
                        'identification_type', 'identification_number'
                    ]
                ];
                
                foreach ($relations as $relation => $fields) {
                    $q->orWhereHas($relation, function($subQuery) use ($searchTerm, $fields) {
                        $subQuery->where(function($innerQuery) use ($searchTerm, $fields) {
                            foreach ($fields as $field) {
                                $innerQuery->orWhere($field, 'LIKE', "%{$searchTerm}%");
                            }
                        });
                    });
                }
            });
        }
        
        $management = $query->paginate(10);

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
     * Guardar una nueva gestión en la base de datos.
     */
    public function store(ManagementRequest $request)
    {
        $management = Management::create($request->all());

        // Carga relaciones para devolverlas en el resource
        $management->load(['user', 'payroll', 'consultation', 'contact', 'specific', 'monitoring']);

        return response()->json([
            'message' => 'Gestión creada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_CREATED)  ;
    }

    /**
     * Mostrar una gestión específica.
     */
    public function show($id)
    {       
    }

    /**
     * Actualizar una gestión existente.
     */
    public function update(ManagementRequest $request, $id)
    {
        $management = Management::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $data = $request->all();

        $management->update($data);

        // Recargar relaciones para devolver la info actualizada
        $management->load(['usuario', 'payroll', 'consultation', 'contact', 'monitoring']);

        return (new ManagementResource($management))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    // Actualiza unicamente estos dos campos
    public function updateMonitoring(UpdateMonitoringRequest $request, $id)
    {
        $management = Management::findOrFail($id);
        $management->update($request->only(['solution_date', 'monitoring_id']));
        return response()->json($management, 200);
    }

    /**
     * Eliminar una gestión.
     */
    public function destroy($id)
    {
        $management = Management::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $management->delete();

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
