<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PayrollsConsultationsResource;
use App\Models\PayrollsConsultations;
use App\Http\Requests\PayrollsConsultationsRequest;

class PayrollsConsultationsController extends Controller
{
    // Obtener todas las pagadurias con las consultas 
    public function index()
    {
        $payrollConsultations = PayrollsConsultations::with(['payroll', 'consultation'])->paginate(10);
        return response()->json([
            'message' => 'Pagadurias y consultas obtenidas con éxito',
            'payrollsconsultation'    => PayrollsConsultationsResource::collection($payrollConsultations),
            'pagination' => [
                'current_page'   => $payrollConsultations->currentPage(),
                'total_pages'    => $payrollConsultations->lastPage(),
                'per_page'       => $payrollConsultations->perPage(),
                'total_payrolls' => $payrollConsultations->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Obtener una pagaduría y consulta específica
    public function show(PayrollsConsultations $payrollconsultation)
    {
        return response()->json([
            'message' => 'Pagaduría y consulta encontrada',
            'payroll' => new PayrollsConsultationsResource($payrollconsultation)
        ], Response::HTTP_OK);
    }

    //Crear una pagaduría y consulta
    public function store(PayrollsConsultationsRequest  $request){
        $payrollconsultation = PayrollsConsultations::create($request->only(['consultation_id', 'payroll_id', 'is_active']));
        
        // Recargar con relaciones
        $payrollconsultation->load(['payroll', 'consultation']);
        
        return response()->json([
            'message' => 'Pagaduría y consulta creada con éxito',
            'payrollconsultation' => new PayrollsConsultationsResource($payrollconsultation)
        ], Response::HTTP_CREATED);
    }

    //Actualizar una pagaduría y consulta
    public function update(Request $request, $id){
        $payrollconsultation = PayrollsConsultations::findOrFail($id);

        $payrollconsultation->update($request->only(['payroll_id', 'consultation_id', 'is_active']));
        
        $payrollconsultation->load(['consultation', 'payroll']);
        
        return response()->json([
            'succes' => true,
            'message' => 'Pagaduría y consulta actualizada con éxito',
            'payrollconsultation' => new PayrollsConsultationsResource($payrollconsultation)
        ], Response::HTTP_OK);
    }

    //Desactivar una pagaduría y consulta
    public function destroy($id){
        $payrollconsultation = PayrollsConsultations::findOrFail($id);
        $payrollconsultation->update(['is_active' => !$payrollconsultation->is_active]);

        return response()->json([
            'success' => true,
            'message' => $payrollconsultation->is_active 
                            ? 'Pagaduría y consulta activada con éxito' 
                            : 'Pagaduría y consulta desactivada con éxito',
        ], Response::HTTP_OK);
    }
}
