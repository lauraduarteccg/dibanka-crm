<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeManagementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this ->id,
            'campaign' => $this->whenLoaded('campaign', function () {
                return [
                    'id'    => $this->campaign->id,
                    'name'  => $this->campaign->name,
                ];
            }),
            'name' => $this->name,
            'is_active' => $this->is_active
        ];
    }
}
