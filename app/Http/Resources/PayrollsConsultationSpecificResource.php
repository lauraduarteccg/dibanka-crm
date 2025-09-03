<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollsConsultationSpecificResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                        => $this->id,
            'consultation_specific'  => $this->whenLoaded('consultation_specific', function () {
                return [
                    'id'                    => $this->consultation_specific->id,
                    'specific_reason'       => $this->consultation_specific->specific_reason,
                    'is_active'             => $this->consultation_specific->is_active,
                ];
            }),
            
            // Campaña relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'    => $this->payroll->id,
                    'name'  => $this->payroll->name,
                    'is_active'             => $this->payroll->is_active,
                ];
            }),

            'is_active'                 => $this->is_active,
            'created_at'                => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
