<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ManagementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // Usuario relacionado (solo si la relación fue cargada)
            'usuario' => $this->whenLoaded('usuario', function () {
                return [
                    'id'    => $this->usuario->id,
                    'name'  => $this->usuario->name,
                    'email' => $this->usuario->email,
                ];
            }),

            // Campaña relacionada
            'campaign' => $this->whenLoaded('campaign', function () {
                return [
                    'id'    => $this->campaign->id,
                    'name'  => $this->campaign->name,
                ];
            }),

            // Consulta relacionada
            'consultation' => $this->whenLoaded('consultation', function () {
                return [
                    'id'                    => $this->consultation->id,
                    'reason_consultation'   => $this->consultation->reason_consultation,
                    'specific_reason'       => $this->consultation->specific_reason,
                ];
            }),

            // Contacto relacionado
            'contact' => $this->whenLoaded('contact', function () {
                return [
                    'id'                    => $this->contact->id,
                    'name'                  => $this->contact->name,
                    'identification_type'   => $this->contact->identification_type,
                    'identification_number' => $this->contact->identification_number,
                    'phone'                 => $this->contact->phone,
                    // incluir update_phone solo si existe y no es null
                    'update_phone'          => $this->contact->update_phone ?? null,
                    'email'                 => $this->contact->email,
                ];
            }),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
