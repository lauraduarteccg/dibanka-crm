<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ConsultationSpecific;
use Illuminate\Validation\Rule;

class SpecificConsultRequest extends FormRequest
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
        $specificConsultID = $this->route('consultation_specifics') ?->id;
        return [
            'specific_reason'   => ['required', 'string', 'max:255', Rule::unique(ConsultationSpecific::class)->ignore($specificConsultID)],
        ];
    }

    public function messages(): array
    {
        return [
            'specific_reason.required' => 'El motivo especifico es obligatorio.',
            'specific_reason.string'   => 'El motivo especifico debe ser una cadena de texto.',
            'specific_reason.max'      => 'El motivo especifico no debe exceder los 255 caracteres.',
            'specific_reason.unique'   => 'Este motivo especifico ya está en uso. Por favor, elige otro.',
        ];
    }
}
