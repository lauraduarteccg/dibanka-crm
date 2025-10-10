<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PayrollResource;
use App\Http\Requests\PayrollRequest;
use Illuminate\Support\Facades\Storage;

class PayrollController extends Controller
{
    // Obtener todas las pagadurías con paginación y búsqueda
    public function index(Request $request)
    {
        $query = Payroll::query();

        // Si hay término de búsqueda, aplicar filtro
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        $payrolls = $query->paginate(10);

        return response()->json([
            'message'    => 'Pagadurías obtenidas con éxito',
            'data'   => PayrollResource::collection($payrolls),
            'pagination' => [
                'current_page'   => $payrolls->currentPage(),
                'total_pages'    => $payrolls->lastPage(),
                'per_page'       => $payrolls->perPage(),
                'total_payrolls' => $payrolls->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Trae solo pagadurias activas
    public function active()
    {
        $payrolls = Payroll::active()->paginate(10);

        return response()->json([
            'message'       => 'Pagadurias activas obtenidas con éxito',
            'data' => PayrollResource::collection($payrolls),
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
        // Guardar los datos básicos
        $payroll = Payroll::create($request->all());

        if ($request->hasFile('img_payroll')) {
            $path = $request->file('img_payroll')->store('img_payroll', 'public');

            // Guardar la ruta en la BD (asegúrate de que tu tabla tenga una columna img_payroll)
            $payroll->img_payroll = $path;
            $payroll->save();
        }

        return response()->json([
            'message' => 'Pagaduría creada con éxito',
            'data' => new PayrollResource($payroll)
        ], Response::HTTP_CREATED);
    }

    // Obtener una pagaduría específica
    public function show(Payroll $payroll)
    {
        return response()->json([
            'message' => 'Pagaduría encontrada',
            'data' => new PayrollResource($payroll)
        ], Response::HTTP_OK);
    }

    // Actualizar una pagaduría
    public function update(Request $request, $id)
    {
        $payroll = Payroll::findOrFail($id);

        $payroll->name = $request->name;
        $payroll->description = $request->description;

        // 🔹 Si viene un archivo nuevo, lo guardamos
        if ($request->hasFile('img_payroll')) {
            // Borrar imagen anterior si existe
            if ($payroll->img_payroll && \Storage::disk('public')->exists($payroll->img_payroll)) {
                \Storage::disk('public')->delete($payroll->img_payroll);
            }

            $path = $request->file('img_payroll')->store('img_payroll', 'public');
            $payroll->img_payroll = $path;
        }

        // 🔹 Si NO viene archivo, conservamos el string actual (no hacemos nada)

        $payroll->save();

        return response()->json([
            'message' => 'Pagaduría actualizada correctamente',
            'payroll' => $payroll,
        ], 200);
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
