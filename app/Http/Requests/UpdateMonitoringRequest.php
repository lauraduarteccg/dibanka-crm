<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMonitoringRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'solution_date' => 'required|date',
            'monitoring_id' => 'required|integer|exists:monitoring,id',
        ];
    }

    public function messages(): array
    {
        return [
            'solution_date.required' => 'El campo es requerido',
            'solution_date.date' => 'El campo debe ser una fecha',

            'monitoring_id.required' => 'Debe seleccionar un tipo de seguimiento',
            'monitoring.integer' => 'El seguimiento debe ser un campo seleccionable'
        ];
    }
}
