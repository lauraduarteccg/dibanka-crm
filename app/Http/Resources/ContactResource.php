<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo_identificacion' => $this->tipo_identificacion,
            'numero_identificacion' => $this->numero_identificacion,
            'telefono' => $this->telefono,
            'celular_actualizado' => $this->celular_actualizado,
            'correo' => $this->correo,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'is_active' => $this->is_active
        ];
    }
}
