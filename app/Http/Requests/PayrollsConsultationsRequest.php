<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Payroll;
use App\Models\Consultation;

class PayrollsConsultationsRequest extends FormRequest
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
            'consultation_id'   => ['exists:consultations,id', 'required', 'numeric'],
            'payroll_id'        => ['exists:payrolls,id', 'required', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return[
            'consultation_id.exists'    => 'La consulta no existe en la base de datos',
            'consultation_id.required'  => 'La consulta es requerida',
            'consultation_id.numeric'   => 'La consulta debe ser numerica',

            'payroll_id.exists'         => 'La pagaduria no existe en la base de datos',
            'payroll_id.required'       => 'La pagaduria es requerida',
            'payroll_id.numeric'        => 'La pagaduria debe ser numerica'
        ];   
    }
}
