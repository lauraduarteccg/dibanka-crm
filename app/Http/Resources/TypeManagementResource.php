<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeManagementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'campaigns' => $this->whenLoaded('campaigns', function () {
                return $this->campaigns->map(function ($c) {
                    return ['id' => $c->id, 'name' => $c->name];
                });
            }),
            'name' => $this->name,
            'is_active' => $this->is_active,
        ];
    }
}
