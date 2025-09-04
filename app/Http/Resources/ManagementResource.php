<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ManagementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            // Usuario relacionado 
            'user' => $this->whenLoaded('user', function () {
                return [
                    'name'  => $this->user->name,
                    'email' => $this->user->email,
                    'is_active' => $this->user->is_active
                ];
            }),

            // Campaña relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'    => $this->payroll->id,
                    'name'  => $this->payroll->name,
                    'is_active' => $this->payroll->is_active
                ];
            }),

            'solution'  => $this->solution,

            // Contacto relacionado
            'contact' => $this->whenLoaded('contact', function () {
                return [
                    'id'                    => $this->contact->id,
                    'name'                  => $this->contact->name,
                    'identification_type'   => $this->contact->identification_type,
                    'identification_number' => $this->contact->identification_number,
                    'phone'                 => $this->contact->phone,
                    'update_phone'          => $this->contact->update_phone,
                    'email'                 => $this->contact->email,
                    'is_active'             => $this->contact->is_active
                ];
            }),

            // Consulta relacionada
            'consultation' => $this->whenLoaded('consultation', function () {
                return [
                    'id'                    => $this->consultation->id,
                    'reason_consultation'   => $this->consultation->reason_consultation,
                    'is_active'             => $this->consultation->is_active
                ];
            }),

            // Consulta especifica relacionada
            'specific' => $this->whenLoaded('specific', function () {
                return[
                    'id'                => $this->specific->id,
                    'specific_reason'   => $this->specific->specific_reason,
                    'is_active'         => $this->specific->is_active
                ];
            }),
            'comments'  => $this->comments,
            'sms'       => $this->sms,
            'wsp'       => $this->wsp,

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
