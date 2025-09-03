<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\TypeManagement;

class TypeManagementRequest extends FormRequest
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
        $typeManagementID = $this->route('type_management') ?->id;
        return [
            'name'      => ['required', 'string', 'max:255', Rule::unique(TypeManagement::class)->ignore($typeManagementID)],
            'payroll_id' => 'required|array|min:1',        
            'payroll_id.*' => 'integer|exists:payrolls,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'El campo tipo de gestion es obligatorio.',
            'name.string'       => 'El campo tipo de gestion debe ser una cadena de texto.',
            'name.max'          => 'El campo tipo de gestion no debe exceder los 255 caracteres.',
            'name.unique'       => 'El tipo de gestion ya está en uso. Por favor, elige otro.',
            'payroll_id.required' => 'Debe seleccionar al menos una pagaduría',
            'payroll_id.*.exists' => 'La pagaduría seleccionada no existe',
        ];
    }
}
