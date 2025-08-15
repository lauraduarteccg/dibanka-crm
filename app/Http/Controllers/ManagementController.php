<?php

namespace App\Http\Controllers;

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
    public function index()
    {
        // Trae las gestiones con relaciones y pagina (10 por página)
        $management = Management::with(['usuario', 'campaign', 'consultation', 'contact'])->paginate(10);

        // Laravel Resource automatically includes pagination meta when you return a paginated collection
        return ManagementResource::collection($management);
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
        $management = Management::with(['usuario', 'campaign', 'consultation', 'contact'])->find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new ManagementResource($management);
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
