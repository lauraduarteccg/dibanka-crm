<?php

namespace App\Http\Controllers;

use App\Models\Management;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\ManagementResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ManagementController extends Controller
{
    /**
     * Obtener todas las gestiones con información relacionada (paginado).
     */

    public function index(Request $request)
    {
        try {
            $query = Management::with(['usuario', 'campaign', 'consultation', 'contact']);
            $q = $request->input('search');

            if (!empty($q)) {
                $query->where(function($subquery) use ($q) {
                    // Búsqueda por IDs
                    if (is_numeric($q)) {
                        $subquery   ->where   ('id', $q)
                                    ->orWhere('usuario_id', $q)
                                    ->orWhere('campaign_id', $q)
                                    ->orWhere('consultation_id', $q)
                                    ->orWhere('contact_id', $q);
                    }

                    // Búsqueda en relaciones
                    $subquery->orWhereHas('usuario', function($userQuery) use ($q) {
                        $userQuery  ->where     ('name', 'LIKE', "%{$q}%")
                                    ->orWhere   ('email', 'LIKE', "%{$q}%");
                    })
                    ->orWhereHas('contact', function($contactQuery) use ($q) {
                        $contactQuery   ->where     ('name', 'LIKE', "%{$q}%")
                                        ->orWhere   ('email', 'LIKE', "%{$q}%")
                                        ->orWhere   ('phone', 'LIKE', "%{$q}%")
                                        ->orWhere   ('update_phone', 'LIKE', "%{$q}%")
                                        ->orWhere   ('identification_type', 'LIKE', "%{$q}%")
                                        ->orWhere   ('identification_number', 'LIKE', "%{$q}%");
                    })
                    ->orWhereHas('campaign', function($campaignQuery) use ($q) {
                        $campaignQuery->where('name', 'LIKE', "%{$q}%");
                    })
                    ->orWhereHas('consultation', function($consultationQuery) use ($q) {
                        $consultationQuery->where('reason_consultation', 'LIKE', "%{$q}%");
                    });
                });
            }

            $management = $query->orderBy('created_at', 'asc')->paginate(10);

            return ManagementResource::collection($management);
            
        } catch (\Throwable $e) {
            Log::error('Index management error: '.$e->getMessage());
            return response()->json(['message' => 'Error interno del servidor.'], 500);
        }
    }

    /**
     * Guardar una nueva gestión en la base de datos.
     */
    public function store(Request $request)
    {
        $rules = [
            'usuario_id'        => 'required|exists:users,id',
            'campaign_id'       => 'required|exists:campaigns,id',
            'consultation_id'   => 'required|exists:consultations,id',
            'contact_id'        => 'required|exists:contacts,id',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Use only validated fields to avoid mass assignment of extra inputs
        $data = $request->only(array_keys($rules));

        $management = Management::create($data);

        // Carga relaciones para devolverlas en el resource
        $management->load(['usuario', 'campaign', 'consultation', 'contact']);

        return (new ManagementResource($management))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
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
            'usuario_id'        => 'sometimes|exists:users,id',
            'campaign_id'       => 'sometimes|exists:campaigns,id',
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
        $management->load(['usuario', 'campaign', 'consultation', 'contact']);

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
