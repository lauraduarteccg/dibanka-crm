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
            'payroll' => $this->whenLoaded('payroll', function () {
                return $this->payroll->map(function ($c) {
                    return ['id' => $c->id, 'name' => $c->name];
                });
            }),
            'name' => $this->name,
            'is_active' => $this->is_active,
        ];
    }
}
