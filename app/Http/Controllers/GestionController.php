<?php

namespace App\Http\Controllers;

use App\Models\Gestion;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class GestionController extends Controller
{
    /**
     * Obtener todas las gestiones con información relacionada.
     */
    public function index()
    {
        $gestions = Gestion::with(['usuario', 'campaign', 'consultation', 'contact'])->paginate(10);
        return response()->json($gestions, Response::HTTP_OK);
    }

    /**
     * Guardar una nueva gestión en la base de datos.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'usuario_id'        => 'required|exists:users,id',
            'campaign_id'       => 'required|exists:campaigns,id',
            'consultation_id'   => 'required|exists:consultations,id',
            'contact_id'        => 'required|exists:contacts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $gestion = Gestion::create($request->all());

        return response()->json(['message' => 'Gestión creada exitosamente', 'gestion' => $gestion], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una gestión específica.
     */
    public function show($id)
    {
        $gestion = Gestion::with(['usuario', 'campaign', 'consultation', 'contact'])->find($id);

        if (!$gestion) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($gestion, Response::HTTP_OK);
    }

    /**
     * Actualizar una gestión existente.
     */
    public function update(Request $request, $id)
    {
        $gestion = Gestion::find($id);

        if (!$gestion) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'usuario_id'        => 'sometimes|exists:users,id',
            'campaign_id'       => 'sometimes|exists:campaigns,id',
            'consultation_id'   => 'sometimes|exists:consultations,id',
            'contact_id'        => 'sometimes|exists:contacts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $gestion->update($request->all());

        return response()->json(['message' => 'Gestión actualizada correctamente', 'gestion' => $gestion], Response::HTTP_OK);
    }

    /**
     * Eliminar una gestión.
     */
    public function destroy($id)
    {
        $gestion = Gestion::find($id);

        if (!$gestion) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $gestion->delete();

        return response()->json(['message' => 'Gestión eliminada correctamente'], Response::HTTP_OK);
    }
    public function count()
    {
        $count = Gestion::count();
        return response()->json(['count' => $count], 200);
    }
    
}
