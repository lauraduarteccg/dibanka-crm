<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ConsultationResource;

class ConsultationController extends Controller
{
    /**
     * Listar todas las consultas con paginación
     */
    public function index()
    {
        // Construir query y eager-load de relación opcional 'specifics' si existe en el modelo
        $query = Consultation::query();
        if (method_exists(new Consultation, 'specifics')) {
            $query->with('specifics');
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

    /**
     * Crear una nueva consulta
     * Permite opcionalmente sincronizar la relación con 'specifics' (tabla pivote) si se provee
     */
    public function store(Request $request)
    {
        $rules = [
            'reason_consultation'   => 'required|string|max:255',
            'is_active'             => 'sometimes|boolean',
            // campo opcional para sincronizar pivote si la relación 'specifics' existe
            'specific_id'           => 'sometimes|array|min:1',
            'specific_id.*'         => 'integer|exists:consultation_specifics,id',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $created = DB::transaction(function () use ($request) {
            $consultation = Consultation::create([
                'reason_consultation' => $request->input('reason_consultation'),
                'is_active'           => $request->boolean('is_active', true),
            ]);

            // Si la relación 'specifics' existe y vienen specific_id, sincronizamos (pivote)
            if ($request->filled('specific_id') && method_exists($consultation, 'specifics')) {
                $sync = collect($request->input('specific_id'))
                    ->mapWithKeys(fn ($id) => [$id => ['is_active' => 1]])
                    ->toArray();

                $consultation->specifics()->sync($sync);
            }

            return $consultation->load(method_exists(new Consultation, 'specifics') ? 'specifics' : []);
        });

        return (new ConsultationResource($created))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
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
    public function update(Request $request, string $id)
    {
        $rules = [
            'reason_consultation'   => 'required|string|max:255',
            'is_active'             => 'sometimes|boolean',
            'specific_id'           => 'sometimes|array',
            'specific_id.*'         => 'integer|exists:consultation_specifics,id',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $consultation = Consultation::find($id);
        if (! $consultation) {
            return response()->json(['message' => 'Consulta no encontrada'], Response::HTTP_NOT_FOUND);
        }

        DB::transaction(function () use ($request, $consultation) {
            $consultation->update([
                'reason_consultation' => $request->input('reason_consultation', $consultation->reason_consultation),
                'is_active'           => $request->has('is_active') ? $request->boolean('is_active') : $consultation->is_active,
            ]);

            // Si vienen specific_id y la relación existe, sincronizamos
            if ($request->filled('specific_id') && method_exists($consultation, 'specifics')) {
                $sync = collect($request->input('specific_id'))
                    ->mapWithKeys(fn ($id) => [$id => ['is_active' => 1]])
                    ->toArray();

                $consultation->specifics()->sync($sync);
            }
        });

        return new ConsultationResource($consultation->load(method_exists($consultation, 'specifics') ? 'specifics' : []));
    }

    /**
     * Activar/Desactivar (toggle) una consulta
     */
    public function destroy(string $id)
    {
        $consultation = Consultation::find($id);
        if (! $consultation) {
            return response()->json(['message' => 'Consulta no encontrada'], Response::HTTP_NOT_FOUND);
        }

        // Toggle entre 1 y 0
        $consultation->update(['is_active' => $consultation->is_active ? 0 : 1]);

        return response()->json(['message' => 'Consulta actualizada correctamente'], Response::HTTP_OK);
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
