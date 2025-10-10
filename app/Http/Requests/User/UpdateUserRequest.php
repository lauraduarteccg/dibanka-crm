<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado para hacer esta solicitud.
     * Se verifica que tenga el permiso "user.update".
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Define las reglas de validación para actualizar un usuario.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'     => 'sometimes|required|string|max:255',
            'email'    => [
                'sometimes',
                'required',
                'email',
                // Rule::unique('users', 'email')->ignore($this->route('user')),
            ],
            'password' => 'nullable|string|min:8',
            'role'     => 'sometimes|required|integer|exists:roles,id',
            'is_active'=> 'sometimes|boolean',
        ];
    }

    /**
     * Mensajes personalizados para los errores de validación.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required'     => 'El nombre es obligatorio.',
            'name.string'       => 'El nombre debe ser una cadena de caracteres.',
            'name.max'          => 'El nombre no debe exceder 255 caracteres.',
            'email.required'    => 'El correo electrónico es obligatorio.',
            'email.email'       => 'El correo electrónico debe tener un formato válido.',
            'email.unique'      => 'El correo electrónico ya ha sido registrado.',
            'password.string'   => 'La contraseña debe ser una cadena de caracteres.',
            'password.min'      => 'La contraseña debe tener al menos 8 caracteres.',
            'role.required'     => 'El rol es obligatorio.',
            'role.integer'      => 'El rol debe ser un número entero.',
            'role.exists'       => 'El rol seleccionado no existe.',
            'is_active.boolean' => 'El campo de estado debe ser verdadero o falso.',
        ];
    }
}
