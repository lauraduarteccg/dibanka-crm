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
            'name' => $this->name,
            'payrolls' => [
                'id'    => optional($this->payroll)->id,
                'name'  => optional($this->payroll)->name,
            ], 
            'is_active' => $this->is_active,
        ];
    }
}
