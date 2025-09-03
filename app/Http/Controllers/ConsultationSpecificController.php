<?php

namespace App\Http\Controllers;

use App\Models\ConsultationSpecific;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ConsultationSpecificResource;
use App\Http\Requests\SpecificConsultRequest;

class ConsultationSpecificController extends Controller
{
    /**
     * Listar todas las consultas específicas con paginación
     */
    public function index(Request $request)
    {
        $query = ConsultationSpecific::query();
        
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            
            $query->where(function($q) use ($searchTerm) {
                $q->where('specific_reason', 'LIKE', "%{$searchTerm}%");
            });
        }

        $specifics = $query->paginate(10);

        return response()->json([
            'message'       => 'Consultas específicas obtenidas con éxito',
            'consultations' => ConsultationSpecificResource::collection($specifics),
            'pagination'    => [
                'current_page'        => $specifics->currentPage(),
                'total_pages'         => $specifics->lastPage(),
                'per_page'            => $specifics->perPage(),
                'total_consultations' => $specifics->total(),
                'next_page_url'       => $specifics->nextPageUrl(),
                'prev_page_url'       => $specifics->previousPageUrl(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Crear una nueva consulta específica
     */
    public function store(SpecificConsultRequest $request)
    {
        $validator = Validator::make($request->all());
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $created = DB::transaction(function () use ($request) {
            $specific = ConsultationSpecific::create([
                'specific_reason' => $request->input('specific_reason'),
                'is_active'       => $request->boolean('is_active', true),
            ]);

            return $specific;
        });

        return (new ConsultationSpecificResource($created))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(string $id)
    {
        $specific = ConsultationSpecific::find($id);

        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new ConsultationSpecificResource($specific);
    }

    /**
     * Actualizar una consulta específica
     */
    public function update(Request $request, string $id)
    {
        $rules = [
            'specific_reason' => 'required|string|max:255',
            'is_active'       => 'sometimes|boolean',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $specific = ConsultationSpecific::find($id);
        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        DB::transaction(function () use ($request, $specific) {
            $specific->update([
                'specific_reason' => $request->input('specific_reason', $specific->specific_reason),
                'is_active'       => $request->has('is_active')
                    ? $request->boolean('is_active')
                    : $specific->is_active,
            ]);
        });

        return new ConsultationSpecificResource($specific);
    }

    /**
     * Activar/Desactivar (toggle) una consulta específica
     */
    public function destroy(string $id)
    {
        $specific = ConsultationSpecific::find($id);
        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $specific->update(['is_active' => $specific->is_active ? 0 : 1]);

        return response()->json(['message' => 'Consulta específica actualizada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contar todas las consultas específicas
     */
    public function count()
    {
        $count = ConsultationSpecific::count();

        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
