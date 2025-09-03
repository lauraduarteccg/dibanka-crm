<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Payroll;
use Illuminate\Validation\Rule;

class PayrollRequest extends FormRequest
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
        $payrollID = $this->route('payrolls') ?->id;
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique(Payroll::class)->ignore($payrollID)],
            'type' => ['required', 'string', 'max:255'],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'El campo pagaduría es obligatorio.',
            'name.string'   => 'El campo pagaduría debe ser una cadena de texto.',
            'name.max'      => 'El campo pagaduría no debe exceder los 255 caracteres.',
            'name.unique'   => 'Esta pagaduría ya está en uso. Por favor, elige otro.',
            'type.required' => 'El campo tipo es obligatorio.',
            'type.string'   => 'El campo tipo debe ser una cadena de texto.',
            'type.max'      => 'El campo tipo no debe exceder los 255 caracteres.',
        ];
    }
}
