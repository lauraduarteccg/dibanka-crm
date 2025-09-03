<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Consultation;
use Illuminate\Validation\Rule;

class ConsultRequest extends FormRequest
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
            'reason_consultation'   => ['required', 'string', 'max:255', 'min:1', Rule::unique(Consultation::class)->ignore($consultID)],
            'specific_id'           => 'required|array|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'reason_consultation.required' => 'El campo motivo de consulta es obligatorio.',
            'reason_consultation.string'   => 'El campo motivo de consulta debe ser una cadena de texto.',
            'reason_consultation.max'      => 'El campo motivo de consulta no debe exceder los 255 caracteres.',
            'reason_consultation.unique'   => 'El motivo de consulta ya está en uso. Por favor, elige otro.',

            'specific_id.required' => 'Debe seleccionar al menos un motivo específico',
            'specific_id.*.exists' => 'El motivo específico seleccionado no existe',
            'specific_id.array'   => 'El campo motivo específico debe ser un arreglo',
            'specific_id.min'     => 'Debe seleccionar al menos un motivo específico',
        ];
    }
}
