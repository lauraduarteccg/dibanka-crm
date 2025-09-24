<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpecialCasesRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\SpecialCases;
use App\Http\Resources\SpecialCasesResource;

class SpecialCasesController extends Controller
{
    // Obtener todos los casos especiales
    public function index(Request $request) 
    {
        $query = SpecialCases::with(['user', 'contact']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

                $query->where(function($q) use ($searchTerm) {
                    $q->where('id', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('management_messi', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('id_call', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('id_messi', 'LIKE', "%{$searchTerm}%");
                    
                    // Para buscar en relaciones
                    $q->orWhereHas('user', function($userQuery) use ($searchTerm) {
                        $userQuery->where('name', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('email', 'LIKE', "%{$searchTerm}%");
                    });

                $q->orWhereHas('contact', function($contactQuery) use ($searchTerm) {
                    $contactQuery->where('name', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('identification_number', 'LIKE', "%{$searchTerm}%")
                                ->orWhere('phone', 'LIKE', "%{$searchTerm}%")
                                ->orWhereHas('payroll', function($payrollQuery) use ($searchTerm) {
                                    $payrollQuery->where('name', 'LIKE', "%{$searchTerm}%");
                                });
                });
            });
        }

        $specialcases = $query->paginate(10);

        return response()->json([
            'message'       => 'Casos especiales obtenidos con éxito',
            'specialcases' => SpecialCasesResource::collection($specialcases),
            'pagination'    => [
                'current_page'          => $specialcases->currentPage(),
                'total_pages'           => $specialcases->lastPage(),
                'per_page'              => $specialcases->perPage(),
                'total_special_cases'   => $specialcases->total(),
            ]
        ]);
    }

    // Obtener un caso especial en especifico
    public function show($id)
    {
        $specialCase = SpecialCases::with(['user', 'contact'])->findOrFail($id);
        return response()->json([
            'message' => 'Caso especial encontrado',
            'special_case' => new SpecialCasesResource($id)
        ]);
    }

    // Crear nuevo caso especial
    public function store(SpecialCasesRequest $request)
    {
        $specialcases = SpecialCases::create($request->all());

        return response()->json([
            'message' => 'Caso especial creado correctamente',
            'special case' => new SpecialCasesResource($specialcases)
        ], Response::HTTP_CREATED)  ;
    }

    // Actualizar caso especial
    public function update(Request $request, $id)
    {
        $specialcase = SpecialCases::findOrFail($id);
        $specialcase->update($request->all());

        return response()->json([
            'succes' => true,
            'message' => 'Caso especial actualizado con exito',
            'special case' => new SpecialCasesResource($specialcase)
        ]);
    }

    // Activar o desactivar un caso especial
    public function destroy($id)
    {
        $specialcase = SpecialCases::findOrFail($id);
        $specialcase->update(['is_active' => !$specialcase->is_active]);

        return response()->json([
            'message' => $specialcase->is_active
                        ? 'Caso especial activado correctamente'
                        : 'Caso especial desactivado correctamente',
            'special case' => new SpecialCasesResource($specialcase)
        ]);
    }
}
