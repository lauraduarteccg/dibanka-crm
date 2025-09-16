<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Consultation;
use Illuminate\Validation\Rule;

class ConsultationRequest extends FormRequest
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
        $consultID = $this->route('consultations') ?->id;

        return [
            'name'          => 'required|string|max:255|min:1',
            'payroll_id'    => 'required|integer|exists:payrolls,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo motivo de consulta es obligatorio.',
            'name.string'   => 'El campo motivo de consulta debe ser una cadena de texto.',
            'name.max'      => 'El campo motivo de consulta no debe exceder los 255 caracteres.',

            'payroll_id.required' => 'La pagaduria es obligatoria.',
            'payroll_id.exists' => 'La pagaduria seleccionada no existe.'
        ];
    }
}
