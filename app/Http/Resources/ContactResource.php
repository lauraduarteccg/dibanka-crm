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
            'campaign' => $this->campaign,
            // Campaña relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'    => $this->payroll->id,
                    'name'  => $this->payroll->name,
                ];
            }),
            'name' => $this->name,
            'identification_type' => $this->identification_type,
            'identification_number' => $this->identification_number,
            'phone' => $this->phone,
            'update_phone' => $this->update_phone,
            'email' => $this->email,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'is_active' => $this->is_active
        ];
    }
}
