<?php

namespace App\Http\Resources\Aliados;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollConsultationResource extends JsonResource
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
            
            // Pagaduria relacionada
            'consultation' => $this->whenLoaded('consultations_aliados', function () {
                return [
                    'id'    => $this->consultation->id,
                    'name'  => $this->consultation->name,
                ];
            }),

            // Pagaduria relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'    => $this->payroll->id,
                    'name'  => $this->payroll->name,
                ];
            }),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
        ];
    }
}
