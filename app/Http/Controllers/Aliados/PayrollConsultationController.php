<?php

namespace App\Http\Controllers\Aliados;

use App\Http\Controllers\Controller;
use App\Models\Aliados\PayrollConsultation;
use App\Http\Resources\Aliados\PayrollConsultationResource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\Aliados\PayrollConsultationRequest;

class PayrollConsultationController extends Controller
{
    /**
     * Listar todas las consultas con paginación
    */
    public function index(Request $request)
    {
        $payrolls_consultations = PayrollConsultation::with('payroll', 'consultation_aliados')->paginate(10);
        
        log_activity('ver_listado', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado'
            ]
        ], $request);

        return response()->json([
            'message'       => 'Consultas obtenidas con éxito',
            'payrolls_consultations' => PayrollConsultationResource::collection($payrolls_consultations),
            'pagination'    => [
                'current_page'          => $payrolls_consultations->currentPage(),
                'total_pages'           => $payrolls_consultations->lastPage(),
                'per_page'              => $payrolls_consultations->perPage(),
                'total_payrolls_consultations'   => $payrolls_consultations->total(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Listar todas las consultas sin paginación
    */
    public function showAll(Request $request)
    {
        $payrolls_consultations = PayrollConsultation::with('payroll', 'consultations_aliados')->all();
        
        log_activity('ver_listado', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado'
            ]
        ], $request);

        return response()->json([
            'message'       => 'Consultas obtenidas con éxito',
            'payrolls_consultations' => PayrollConsultationResource::collection($payrolls_consultations),
        ], Response::HTTP_OK);
    }

    /* 
     * Crear Registro en tabla pivote Pagaduria y Consulta 
    */
    public function store(PayrollConsultationRequest $request)
    {
        $pivote = PayrollConsultation::create($request->validated());

        // Carga relaciones para devolverlas en el resource
        $pivote->load(['payroll', 'consultation_aliados']);

        return response()->json([
            'message' => 'Asignación creada correctamente',
            'data'    => new PayrollConsultationResource($pivote)
        ], Response::HTTP_CREATED);
    }

}
