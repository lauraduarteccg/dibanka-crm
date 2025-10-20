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
                    'id'    => $this->user->id,
                    'name'  => $this->user->name,
                    'email' => $this->user->email,
                    'is_active' => $this->user->is_active
                ];
            }),
            
            'wolkvox_id' => $this->wolkvox_id,

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
                    'campaign'              => $this->contact->campaign,
                    'is_active'             => $this->contact->is_active
                ];
            }),

            // Consulta relacionada
            'consultation' => $this->whenLoaded('consultation', function () {
                return [
                    'id'                    => $this->consultation->id,
                    'name'   => $this->consultation->name,
                    'is_active'             => $this->consultation->is_active
                ];
            }),

            // Consulta especifica relacionada
            'specific' => $this->whenLoaded('specific', function () {
                return[
                    'id'                => $this->specific->id,
                    'name'              => $this->specific->name,
                    'is_active'         => $this->specific->is_active
                ];
            }),
            
            // tipo de gestion relacionada
            'type_management' => $this->whenLoaded('type_management', function () {
                return[
                    'id'                => $this->specific->id,
                    'name'              => $this->specific->name,
                    'is_active'         => $this->specific->is_active
                ];
            }),            
            'comments'  => $this->comments,
            'solution_date' => $this->solution_date,

            // Seguimiento relacionada
            'monitoring' => $this->whenLoaded('monitoring', function () {
                return [
                    'id'            => $this->monitoring->id,
                    'name'          => $this->monitoring->name,
                    'solution_date' => $this->monitoring->solution_date,
                    'is_active'     => $this->monitoring->is_active
                ];
            }),
            
            'sms'       => $this->sms,
            'wsp'       => $this->wsp,

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
