<?php

namespace App\Http\Controllers;

use App\Models\ChangeHistory;
use App\Http\Resources\ChangeHistoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ChangeHistoryController extends Controller
{
    /**
     * Listar todos los historiales de cambios con filtros opcionales.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ChangeHistory::with('user')->orderBy('created_at', 'desc');

        // Aplicar filtros
        $this->applyFilters($query, $request);

        $perPage = $request->integer('per_page', 15);
        $histories = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ChangeHistoryResource::collection($histories),
            'pagination' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ]);
    }

    /**
     * Obtener historial de todos los registros de un tipo de entidad.
     */
    public function getEntityTypeHistory(
        Request $request, 
        string $entityType
    ): JsonResponse {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $fullEntityType = $this->resolveEntityType($entityType);

        if (!$fullEntityType) {
            return response()->json([
                'success' => false,
                'message' => 'Tipo de entidad no válido',
            ], 404);
        }

        $perPage = $request->integer('per_page', 15);
        
        $histories = ChangeHistory::with('user')
            ->where('entity_type', $fullEntityType)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ChangeHistoryResource::collection($histories),
            'pagination' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ]);
    }

    /**
     * Obtener historial de un registro específico de una entidad.
     */
    public function getEntityHistory(
        Request $request, 
        string $entityType, 
        int $entityId
    ): JsonResponse {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $fullEntityType = $this->resolveEntityType($entityType);

        if (!$fullEntityType) {
            return response()->json([
                'success' => false,
                'message' => 'Tipo de entidad no válido',
            ], 404);
        }

        $perPage = $request->integer('per_page', 15);
        
        $histories = ChangeHistory::with('user')
            ->where('entity_type', $fullEntityType)
            ->where('entity_id', $entityId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ChangeHistoryResource::collection($histories),
            'pagination' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ]);
    }

    /**
     * Aplicar filtros a la consulta.
     */
    private function applyFilters($query, Request $request): void
    {
        // Filtrar por tipo de entidad
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filtrar por ID de entidad
        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->entity_id);
        }

        // Filtrar por acción
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filtrar por usuario
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filtrar por rango de fechas
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Búsqueda general
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('entity_type', 'like', "%{$search}%")
                  ->orWhere('entity_id', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($userQuery) => 
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                  );
            });
        }
    }

    /**
     * Resolver tipo de entidad de kebab-case a namespace completo.
     * Ejemplo: "afiliados-management" -> "App\Models\Afiliados\Management"
     */
    private function resolveEntityType(string $entityType): ?string
    {
        // Si ya es un namespace completo, retornarlo
        if (str_starts_with($entityType, 'App\\Models\\')) {
            return $entityType;
        }

        // Convertir kebab-case a namespace
        $namespace = collect(explode('-', $entityType))
            ->map(fn($part) => Str::studly($part))
            ->implode('\\');

        $fullNamespace = 'App\\Models\\' . $namespace;

        // Verificar que la clase existe
        return class_exists($fullNamespace) ? $fullNamespace : null;
    }
}