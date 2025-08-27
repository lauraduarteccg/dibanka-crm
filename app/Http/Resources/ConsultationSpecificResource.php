<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultationSpecificResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'specific_reason'       => $this->specific_reason,
            'is_active'             => $this->is_active,
            'created_at'            => $this->created_at->format('Y-m-d H:i:s')
        ];
    }
}
