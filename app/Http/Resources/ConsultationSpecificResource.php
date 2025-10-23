<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultationSpecificResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'consultation' => [
                'id' => optional($this->consultation)->id,
                'name' => optional($this->consultation)->name,
                'payroll' => [
                    'id' => optional($this->consultation?->payroll)->id,
                    'name' => optional($this->consultation?->payroll)->name,
                ],
            ],
            'name' => $this->name,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
