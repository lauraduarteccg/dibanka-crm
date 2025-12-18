<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ChangeHistoryResource extends JsonResource
{
    /**
     * Transformar el recurso en un array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entity_type' => $this->formatEntityType($this->entity_type),
            'entity_type_full' => $this->entity_type,
            'entity_id' => $this->entity_id,
            'action' => $this->action,
            'changes' => $this->getFormattedChanges(),
            'user' => $this->when($this->user, [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
            ]),
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'created_at_human' => $this->created_at?->diffForHumans(),
            ...$this->getValuesBasedOnAction(),
        ];
    }

    /**
     * Obtener valores antiguos y nuevos según la acción.
     */
    private function getValuesBasedOnAction(): array
    {
        return match ($this->action) {
            'created' => ['new_values' => $this->new_values],
            'deleted' => ['old_values' => $this->old_values],
            default => [
                'old_values' => $this->old_values,
                'new_values' => $this->new_values,
            ],
        };
    }

    /**
     * Formatear tipo de entidad a kebab-case.
     * Ejemplos:
     * - App\Models\Contact -> contact
     * - App\Models\Afiliados\Management -> afiliados-management
     */
    private function formatEntityType(string $entityType): string
    {
        $path = str_replace('App\\Models\\', '', $entityType);
        $parts = explode('\\', $path);
        
        return collect($parts)
            ->map(fn($part) => Str::kebab($part))
            ->implode('-');
    }

    /**
     * Obtener cambios formateados comparando valores antiguos y nuevos.
     */
    private function getFormattedChanges(): array
    {
        return match ($this->action) {
            'created' => $this->formatCreatedChanges(),
            'deleted' => $this->formatDeletedChanges(),
            default => $this->formatUpdatedChanges(),
        };
    }

    /**
     * Formatear cambios para acción de creación.
     */
    private function formatCreatedChanges(): array
    {
        return $this->mapChanges($this->new_values ?? [], fn($field, $value) => [
            'field' => $field,
            'value' => $value,
            'display_value' => $this->formatValue($value, $field),
        ]);
    }

    /**
     * Formatear cambios para acción de eliminación.
     */
    private function formatDeletedChanges(): array
    {
        return $this->mapChanges($this->old_values ?? [], fn($field, $value) => [
            'field' => $field,
            'value' => $value,
            'display_value' => $this->formatValue($value, $field),
        ]);
    }

    /**
     * Formatear cambios para acción de actualización.
     */
    private function formatUpdatedChanges(): array
    {
        return $this->mapChanges($this->new_values ?? [], function($field, $newValue) {
            $oldValue = $this->old_values[$field] ?? null;

            return [
                'field' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
                'display_old' => $this->formatValue($oldValue, $field),
                'display_new' => $this->formatValue($newValue, $field),
            ];
        });
    }

    /**
     * Mapear cambios filtrando campos que deben omitirse.
     */
    private function mapChanges(array $values, callable $callback): array
    {
        return collect($values)
            ->reject(fn($value, $field) => $this->shouldSkipField($field))
            ->map(fn($value, $field) => $callback($field, $value))
            ->values()
            ->all();
    }

    /**
     * Verificar si el campo debe omitirse.
     */
    private function shouldSkipField(string $field): bool
    {
        return in_array($field, ['password', 'remember_token', 'updated_at']);
    }

    /**
     * Formatear valor para visualización.
     */
    private function formatValue($value, string $field = null): string
    {
        if (is_null($value)) {
            return 'N/A';
        }
        
        // Campo de estado activo/inactivo
        if ($field === 'is_active') {
            return in_array($value, [1, '1', true], true)
                ? 'Activo'
                : 'Inactivo';
        }
        
        // Campo de WHATSAP
        if ($field === 'wsp') {
            return in_array($value, [1, '1', true], true)
                ? 'Enviado'
                : 'No enviado';
        }

        // Campo de SMS
        if ($field === 'sms') {
            return in_array($value, [1, '1', true], true)
                ? 'Enviado'
                : 'No enviado';
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        // Intentar resolver relaciones de claves foráneas
        if ($field && $this->isForeignKey($field)) {
            return $this->resolveRelationship($field, $value) ?? (string) $value;
        }

        return (string) $value;
    }

    /**
     * Verificar si el campo es una clave foránea.
     */
    private function isForeignKey(string $field): bool
    {
        return str_ends_with($field, '_id');
    }

    /**
     * Resolver valor de relación.
     */
    private function resolveRelationship(string $field, $id): ?string
    {
        try {
            $relationName = str_replace('_id', '', $field);
            $modelClass = $this->entity_type;
            
            if (!class_exists($modelClass)) {
                return null;
            }

            $model = new $modelClass;
            
            // Si no existe el método de relación, intentar por nombre del modelo
            if (!method_exists($model, $relationName)) {
                return $this->resolveByModelName($relationName, $id);
            }

            // Obtener el modelo relacionado
            $relatedInstance = $model->$relationName()->getRelated()->find($id);

            return $relatedInstance ? $this->getDisplayName($relatedInstance) : null;

        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Resolver adivinando el nombre del modelo.
     */
    private function resolveByModelName(string $relationName, $id): ?string
    {
        try {
            $modelName = 'App\\Models\\' . Str::studly($relationName);
            
            if (!class_exists($modelName)) {
                return null;
            }

            $relatedInstance = $modelName::find($id);
            
            return $relatedInstance ? $this->getDisplayName($relatedInstance) : null;

        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Obtener nombre para mostrar de la instancia del modelo.
     */
    private function getDisplayName($instance): string
    {
        $nameFields = ['name', 'title', 'description', 'email', 'code', 'number'];
        
        foreach ($nameFields as $field) {
            if (!empty($instance->$field)) {
                return (string) $instance->$field;
            }
        }

        return "ID: {$instance->id}";
    }
}