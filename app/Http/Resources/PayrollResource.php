<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'img_payroll' => $this->img_payroll 
                ? asset('storage/' . $this->img_payroll) 
                : null,
            'i_title' => $this->i_title,
            'i_description' => $this->i_description,
            'i_phone' => $this->i_phone,
            'i_email' => $this->i_email,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}