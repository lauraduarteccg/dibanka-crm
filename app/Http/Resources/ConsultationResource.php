<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultationResource extends JsonResource
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
            'motivo_consulta' => $this->motivo_consulta,
            'motivo_especifico' => $this->motivo_especifico,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
