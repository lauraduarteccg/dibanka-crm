<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManagementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id'           => 'required|integer|exists:users,id',
            'payroll_id'        => 'required|integer|exists:payrolls,id',
            'contact_id'        => 'required|integer|exists:contacts,id',
            'consultation_id'   => 'required|integer|exists:consultations,id',
            'specific_id'       => 'required|integer|exists:consultation_specifics,id',

            'solution'          => 'required|string',
            'comments'          => 'required|string',
            'sms'               => 'required|string',
            'wsp'               => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            // Validaciones agentes
            'user_id.required'  => 'El agente es requerido',
            'user_id.exists'    => 'El agente seleccionado no existe',
            'user_id_.integer'  => 'El agente debe ser un numero',
            
            // Validaciones pagadurias
            'payroll_id.required'  => 'La pagaduria es requerida',
            'payroll_id.exists'    => 'La pagaduria seleccionada no existe',
            'payroll_id_.integer'  => 'La pagaduria debe ser un numero',
            
            // Validaciones contacto/cliente
            'contact_id.required'  => 'El cliente es requerido',
            'contact_id.exists'    => 'El cliente seleccionado no existe',
            'contact_id_.integer'  => 'El cliente debe ser un numero',
            
            // Validaciones para consultas
            'consultation_id.required'  => 'La consulta es requerida',
            'consultation_id.exists'    => 'La consulta seleccionada no existe',
            'consultation_id_.integer'  => 'La consulta debe ser un numero',
            
            // Validaciones para consultas especificas
            'specific_id.required'  => 'La consulta especifica es requerida',
            'specific_id.exists'    => 'La consulta especifica seleccionada no existe',
            'specific_id_.integer'  => 'La consulta especifica debe ser un numero',

            // Validaciones para el resto de las columnas
            'solution.required'     => 'La solucion es requerida',
            'solution.string'       => 'La solucion debe ser una cadena de texto',

            'comments.required'     => 'La solucion es requerida',
            'comments.string'       => 'La solucion debe ser una cadena de texto',
            
            'sms.required'     => 'El campo SMS es requerido',
            'sms.string'       => 'El campo SMS debe ser una cadena de texto',
            
            'wsp.required'     => 'El campo Whatsap es requerido',
            'wsp.string'       => 'El campo Whatsap debe ser una cadena de texto',

        ];
    }
}
