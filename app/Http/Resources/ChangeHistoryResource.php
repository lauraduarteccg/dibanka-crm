<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChangeHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'entity_type' => $this->entity_type,
            'entity_id' => $this->entity_id,
            'action' => $this->action,
            'changes' => $this->getFormattedChanges(),
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ],
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'created_at_human' => $this->created_at?->diffForHumans(),
        ];

        // Only include old_values and new_values based on action
        if ($this->action === 'created') {
            $data['new_values'] = $this->new_values;
        } elseif ($this->action === 'deleted') {
            $data['old_values'] = $this->old_values;
        } else {
            $data['old_values'] = $this->old_values;
            $data['new_values'] = $this->new_values;
        }

        return $data;
    }

    /**
     * Get formatted changes comparing old and new values
     */
    private function getFormattedChanges(): array
    {
        if ($this->action === 'created') {
            return $this->formatCreatedChanges();
        }

        if ($this->action === 'deleted') {
            return $this->formatDeletedChanges();
        }

        return $this->formatUpdatedChanges();
    }

    /**
     * Format changes for created action
     */
    private function formatCreatedChanges(): array
    {
        $changes = [];
        
        foreach ($this->new_values ?? [] as $field => $value) {
            if ($this->shouldSkipField($field)) {
                continue;
            }

            $changes[] = [
                'field' => $field,
                'value' => $value,
                'display_value' => $this->formatValue($value, $field),
            ];
        }

        return $changes;
    }

    /**
     * Format changes for deleted action
     */
    private function formatDeletedChanges(): array
    {
        $changes = [];
        
        foreach ($this->old_values ?? [] as $field => $value) {
            if ($this->shouldSkipField($field)) {
                continue;
            }

            $changes[] = [
                'field' => $field,
                'value' => $value,
                'display_value' => $this->formatValue($value, $field),
            ];
        }

        return $changes;
    }

    /**
     * Format changes for updated action
     */
    private function formatUpdatedChanges(): array
    {
        $changes = [];
        
        foreach ($this->new_values ?? [] as $field => $newValue) {
            if ($this->shouldSkipField($field)) {
                continue;
            }

            $oldValue = $this->old_values[$field] ?? null;

            $changes[] = [
                'field' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
                'display_old' => $this->formatValue($oldValue, $field),
                'display_new' => $this->formatValue($newValue, $field),
            ];
        }

        return $changes;
    }

    /**
     * Check if field should be skipped
     */
    private function shouldSkipField(string $field): bool
    {
        $skipFields = ['password', 'remember_token', 'updated_at'];
        return in_array($field, $skipFields);
    }

    /**
     * Format value for display
     */
    private function formatValue($value, string $field = null): string
    {
        if (is_null($value)) {
            return 'N/A';
        }

        if (is_bool($value)) {
            return $value ? 'Sí' : 'No';
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        // Try to resolve foreign key relationships
        if ($field && $this->isForeignKey($field)) {
            $relatedValue = $this->resolveRelationship($field, $value);
            if ($relatedValue) {
                return $relatedValue;
            }
        }

        return (string) $value;
    }

    /**
     * Check if field is a foreign key
     */
    private function isForeignKey(string $field): bool
    {
        return str_ends_with($field, '_id');
    }

    /**
     * Resolve relationship value
     */
    private function resolveRelationship(string $field, $id): ?string
    {
        try {
            // Remove '_id' suffix to get relation name
            $relationName = str_replace('_id', '', $field);
            
            // Get the model class from entity_type
            $modelClass = $this->entity_type;
            
            if (!class_exists($modelClass)) {
                return null;
            }

            // Create a temporary instance to check if relation exists
            $model = new $modelClass;
            
            if (!method_exists($model, $relationName)) {
                return $this->resolveByModelName($relationName, $id);
            }

            // Try to get the related model
            $relation = $model->$relationName();
            $relatedModel = $relation->getRelated();
            $relatedInstance = $relatedModel->find($id);

            if (!$relatedInstance) {
                return null;
            }

            // Try common name fields
            return $this->getDisplayName($relatedInstance);

        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Resolve by guessing model name
     */
    private function resolveByModelName(string $relationName, $id): ?string
    {
        try {
            // Convert relation name to model class (e.g., 'payroll' -> 'Payroll')
            $modelName = 'App\\Models\\' . ucfirst(\Illuminate\Support\Str::camel($relationName));
            
            if (!class_exists($modelName)) {
                return null;
            }

            $relatedInstance = $modelName::find($id);
            
            if (!$relatedInstance) {
                return null;
            }

            return $this->getDisplayName($relatedInstance);

        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get display name from model instance
     */
    private function getDisplayName($instance): string
    {
        // Try common name fields in order of preference
        $nameFields = ['name', 'title', 'description', 'email', 'code', 'number'];
        
        foreach ($nameFields as $field) {
            if (isset($instance->$field) && !empty($instance->$field)) {
                return (string) $instance->$field;
            }
        }

        // Fallback to ID
        return "ID: {$instance->id}";
    }
}