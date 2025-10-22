<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id'    => $this->user->id,
                    'name'  => $this->user->name,
                    'email' => $this->user->email,
                    'is_active' => $this->user->is_active
                ];
            }),
            'action'        => $this->action,
            'entity_type'   => $this->entity_type,
            'changes'       => $this->changes,
            'ip_address'    => $this->ip_address,
            'user_agent'    => $this->user_agent,
            'created_at'    => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
