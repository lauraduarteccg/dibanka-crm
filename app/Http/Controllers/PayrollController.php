<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PayrollResource;
use App\Http\Requests\PayrollRequest;

class PayrollController extends Controller
{
    // Obtener todas las pagadurías con paginación y búsqueda
    public function index(Request $request)
    {
        $query = Payroll::query();

        // Si hay término de búsqueda, aplicar filtro
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('type', 'LIKE', "%{$searchTerm}%");
            });
        }

        $payrolls = $query->paginate(10);

        return response()->json([
            'message'    => 'Pagadurías obtenidas con éxito',
            'payrolls'   => PayrollResource::collection($payrolls),
            'pagination' => [
                'current_page'   => $payrolls->currentPage(),
                'total_pages'    => $payrolls->lastPage(),
                'per_page'       => $payrolls->perPage(),
                'total_payrolls' => $payrolls->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Trae solo pagadurias
    public function active(Request $request)
    {
        $payrolls = Payroll::active()->paginate(10);

        return response()->json([
            'message'       => 'Pagadurias activas obtenidas con éxito',
            'payrolls' => PayrollResource::collection($payrolls),
            'pagination'    => [
                'current_page'          => $payrolls->currentPage(),
                'total_pages'           => $payrolls->lastPage(),
                'per_page'              => $payrolls->perPage(),
                'total_payrolls'        => $payrolls->total(),
            ],
        ], Response::HTTP_OK);

    }

    // Crear una nueva pagaduría
    public function store(PayrollRequest $request)
    {
        $payroll = Payroll::create($request->only(['name', 'type', 'is_active']));

        return response()->json([
            'message' => 'Pagaduría creada con éxito',
            'payroll' => new PayrollResource($payroll)
        ], Response::HTTP_CREATED);
    }

    // Obtener una pagaduría específica
    public function show(Payroll $payroll)
    {
        return response()->json([
            'message' => 'Pagaduría encontrada',
            'payroll' => new PayrollResource($payroll)
        ], Response::HTTP_OK);
    }

    // Actualizar una pagaduría
    public function update(Request $request, $id)
    {
        $payroll = Payroll::findOrFail($id);

        $payroll->update($request->only(['name', 'type', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Pagaduría actualizada con éxito',
            'payroll' => new PayrollResource($payroll)
        ], Response::HTTP_OK);
    }

    // Activar/Desactivar una pagaduría
    public function destroy($id)
    {
        $payroll = Payroll::findOrFail($id);
        $payroll->update(['is_active' => !$payroll->is_active]);

        return response()->json([
            'message' => $payroll->is_active 
                        ? 'Pagaduría activada correctamente' 
                        : 'Pagaduría desactivada correctamente',
            'payroll' => new PayrollResource($payroll)
        ], Response::HTTP_OK);
    }

    // Contar pagadurías
    public function count()
    {
        return response()->json([
            'count' => Payroll::count()
        ], Response::HTTP_OK);
    }
}