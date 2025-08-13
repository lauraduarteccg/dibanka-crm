<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ConsultationResource;

class ConsultationController extends Controller
{
    /**
     * Listar todas las consultas con paginación
     */
    public function index()
    {
        $consultations = Consultation::paginate(10);

        return response()->json([
            'message'               => 'Consultas obtenidas con éxito',
            'consultations'         => ConsultationResource::collection($consultations),
            'pagination'            => [
                'current_page'          => $consultations->currentPage(),
                'total_pages'           => $consultations->lastPage(),
                'per_page'              => $consultations->perPage(),
                'total_consultations'   => $consultations->total(),
                'next_page_url'         => $consultations->nextPageUrl(),
                'prev_page_url'         => $consultations->previousPageUrl(),
            ]
        ], Response::HTTP_OK);
    }

    /**
     * Crear una nueva consulta
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'motivo_consulta'   => 'required|string|max:255',
            'motivo_especifico' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $consultation = Consultation::create($request->all());

        return response()->json([
            'message'       => 'Consulta creada con éxito',
            'consultation'  => new ConsultationResource($consultation)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show($id)
    {
        $consultation = Consultation::find($id);

        if (!$consultation) {
            return response()->json([
                'message' => 'Consulta no encontrada'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message'       => 'Consulta encontrada',
            'consultation'  => new ConsultationResource($consultation)
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar una consulta
     */
    public function update(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);

        $consultation->update($request->only(['motivo_consulta', 'motivo_especifico']));

        return response()->json([
            'success' => true,
            'message' => 'Consulta actualizada con éxito',
            'data' => $consultation
        ], 200);
    }


    /**
     * Eliminar una consulta
     */
    public function destroy($id)
    {
        $consultation = Consultation::findOrFail($id);
        $consultation->update(['is_active' => $consultation->is_active ? false : true]);
        return response()->json(['message' => 'Consulta desactivada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contar todas las consultas
     */
    public function count()
    {
        $count = Consultation::count();

        return response()->json([
            'count' => $count
        ], Response::HTTP_OK);
    }
}
