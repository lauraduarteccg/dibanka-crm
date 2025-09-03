<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PayrollResource;
use App\Http\Requests\PayrollRequest;

class PayrollController extends Controller
{
    // Obtener todas las pagadurías con paginación
    public function index()
    {
        $payrolls = Payroll::paginate(10);

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

    // Crear una nueva pagaduría
    public function store(PayrollRequest $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'type'      => 'nullable|string',
        ]);

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
