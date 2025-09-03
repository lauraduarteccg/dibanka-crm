<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollsConsultationsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,

            // Consulta relacionada
            'consultations'   => $this->whenLoaded('consultation', function () {
                return [
                    'id'                    => $this->consultation->id,
                    'reason_consultation'   => $this->consultation->reason_consultation,
                    'is_active'             => $this->consultation->is_active,
                ];
            }),
            
            // Pagaduria relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'    => $this->payroll->id,
                    'name'  => $this->payroll->name,
                    'is_active'             => $this->consultation->is_active,
                ];
            }),
            'is_active'         => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
