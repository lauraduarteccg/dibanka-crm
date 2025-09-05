<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManagementRequest;
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
        $query = Management::with(['user', 'payroll', 'consultation', 'contact', 'specific']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('solution', 'LIKE'. "%{$searchTerm}%")
                    ->orWhere('comments', 'LIKE'. "%{$searchTerm}%")
                    ->orWhere('sms', 'LIKE'. "%{$searchTerm}%")
                    ->orWhere('wsp', 'LIKE'. "%{$searchTerm}%");
                
                // Para buscar en relaciones
                $q->orWhereHas('user', function($userQuery) use ($searchTerm) {
                $userQuery->where('name', 'LIKE', "%{$searchTerm}%")
                         ->orWhere('email', 'LIKE', "%{$searchTerm}%");
               });

                $q->orWhereHas('payroll', function($userQuery) use ($searchTerm) {
                $userQuery->where('name', 'LIKE', "%{$searchTerm}%")
                         ->orWhere('type', 'LIKE', "%{$searchTerm}%");
               });

                $q->orWhereHas('consultation', function($userQuery) use ($searchTerm) {
                $userQuery->where('reason_consultation', 'LIKE', "%{$searchTerm}%");
               });
               
                $q->orWhereHas('contact', function($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('phone', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('update_phone', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('identification_type', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('identification_number', 'LIKE', "%{$searchTerm}%");
               });
               
                $q->orWhereHas('specific', function($userQuery) use ($searchTerm) {
                $userQuery->where('specific_reason', 'LIKE', "%{$searchTerm}%")
                         ->orWhere('consultation_id', 'LIKE', "%{$searchTerm}%");
               });
            });
        }
        
        $management = $query->paginate(10);

        return response()->json([
            'message'       => 'Gestiones obtenida con exito',
            'managements'   => ManagementResource::collection($management),
            'pagination'    => [
                'current_page'          => $management->currentPage(),
                'total_pages'           => $management->lastPage(),
                'per_page'              => $management->perPage(),
                'total_special_cases'   => $management->total(),
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
        $management->load(['user', 'payroll', 'consultation', 'contact', 'specific']);

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
    public function update(Request $request, $id)
    {
        $management = Management::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $rules = [
            'user_id'        => 'sometimes|exists:users,id',
            'payroll_id'       => 'sometimes|exists:payroll,id',
            'consultation_id'   => 'sometimes|exists:consultations,id',
            'contact_id'        => 'sometimes|exists:contacts,id',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $data = $request->only(array_keys($rules));

        $management->update($data);

        // Recargar relaciones para devolver la info actualizada
        $management->load(['usuario', 'payroll', 'consultation', 'contact']);

        return (new ManagementResource($management))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
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
