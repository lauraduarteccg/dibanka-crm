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
        $payrollID = $this->route('payroll') ?->id;
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique(Payroll::class)->ignore($payrollID)],
            'description' => 'required|string|max:255',
            'img_payroll' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'image',
                'mimes:jpeg,png,gif',
                'max:1000',
            ],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'El campo pagaduría es obligatorio.',
            'name.string'   => 'El campo pagaduría debe ser una cadena de texto.',
            'name.max'      => 'El campo pagaduría no debe exceder los 255 caracteres.',
            'name.unique'   => 'Esta pagaduría ya está en uso. Por favor, elige otro.',

            'description.required' => 'El campo descripción es obligatorio.',
            'description.string'   => 'El campo descripción debe ser una cadena de texto.',
            'description.max'      => 'El campo descripción no debe exceder los 255 caracteres.',
            
            'img_payroll.image'     => 'La imagen adjunto no es una imagen',
            'img_payroll.mimes'     => 'La imagen debe ser tipo jpeg, png o gif',
            'img_payroll.max'       => 'La imagen excede los 1000 mb',
            'img_payroll.required'  => 'La imagen es obligatoria.',
        ];
    }
}
