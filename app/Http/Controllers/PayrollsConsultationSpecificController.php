<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PayrollsConsultationSpecificResource;;
use App\Models\PayrollsConsultationSpecific;
use App\Http\Requests\PayrollsConsultationSpecificRequest;

class PayrollsConsultationSpecificController extends Controller
{
    // Obtener todas las pagadurias con las consultas especificas
    public function index()
    {
        $payrollConsultationSpecific = PayrollsConsultationSpecific::with(['payroll', 'consultation_specific'])->paginate(10);
        return response()->json([
            'message' => 'Pagadurias y consultas especificas obtenidas con éxito',
            'payrollsconsultation'    => PayrollsConsultationSpecificResource::collection($payrollConsultationSpecific),
            'pagination' => [
                'current_page'   => $payrollConsultationSpecific->currentPage(),
                'total_pages'    => $payrollConsultationSpecific->lastPage(),
                'per_page'       => $payrollConsultationSpecific->perPage(),
                'total_payrolls' => $payrollConsultationSpecific->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Obtener una pagaduría y consulta específica
    public function show(PayrollsConsultationSpecific $payrollConsultationSpecific)
    {
        return response()->json([
            'message' => 'Pagaduría y consulta especifica encontrada',
            'payroll' => new PayrollsConsultationSpecificResource($payrollConsultationSpecific)
        ], Response::HTTP_OK);
    }

    //Crear una pagaduría y consulta especifica
    public function store(Request  $request){
    $payrollConsultationSpecific = PayrollsConsultationSpecific::create(
        $request->only(['consultation_specific_id', 'payroll_id', 'is_active'])
    );
        
    // Recargar con relaciones
    $payrollConsultationSpecific->load(['payroll', 'consultation_specific']);
        
        return response()->json([
            'message' => 'Pagaduría y consulta especifica creada con éxito',
            'payrollConsultationSpecific' => new PayrollsConsultationSpecificResource($payrollConsultationSpecific)
        ], Response::HTTP_CREATED);
    }

    //Actualizar una pagaduría y consulta
    public function update(Request $request, $id){
        $payrollConsultationSpecific = PayrollsConsultationSpecific::findOrFail($id);

        $payrollConsultationSpecific->update($request->only(['payroll_id', 'consultation_specific_id', 'is_active']));
        
        $payrollConsultationSpecific->load(['consultation_specific', 'payroll']);
        
        return response()->json([
            'succes' => true,
            'message' => 'Pagaduría y consulta specifica actualizada con éxito',
            'payrollConsultationSpecific' => new PayrollsConsultationSpecificResource($payrollConsultationSpecific)
        ], Response::HTTP_OK);
    }

    //Desactivar una pagaduría y consulta
    public function destroy($id){
        $payrollConsultationSpecific = PayrollsConsultationSpecific::findOrFail($id);
        $payrollConsultationSpecific->update(['is_active' => !$payrollConsultationSpecific->is_active]);

        return response()->json([
            'success' => true,
            'message' => $payrollConsultationSpecific->is_active 
                            ? 'Pagaduría y consulta especifica activada con éxito' 
                            : 'Pagaduría y consulta especifica desactivada con éxito',
        ], Response::HTTP_OK);
    }
}
