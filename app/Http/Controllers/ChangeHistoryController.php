<?php

namespace App\Http\Controllers;

use App\Models\ChangeHistory;
use App\Http\Resources\ChangeHistoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChangeHistoryController extends Controller
{
    /**
     * Display a listing of change histories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ChangeHistory::with('user')
            ->orderBy('created_at', 'desc');

        // Filter by entity type
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filter by entity id
        if ($request->filled('entity_id')) {
            $query->where('entity_id', $request->entity_id);
        }

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in entity type
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('entity_type', 'like', "%{$search}%")
                  ->orWhere('entity_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->get('per_page', 15);
        $histories = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => ChangeHistoryResource::collection($histories),
            'meta' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ]);
    }

    /**
     * Mostrar el historial de cambios especificado.
     */
    public function show(ChangeHistory $changeHistory): JsonResponse
    {
        $changeHistory->load('user');

        return response()->json([
            'success' => true,
            'data' => new ChangeHistoryResource($changeHistory),
        ]);
    }

    /**
     * Mostrar el historial de cambios para una entidad específica.
     */
    public function getEntityHistory(Request $request, string $entityType, int $entityId): JsonResponse
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $histories = ChangeHistory::with('user')
            ->where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

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
     * Mostrar estadísticas sobre los cambios.
     */
    public function statistics(Request $request): JsonResponse
    {
        $query = ChangeHistory::query();

        // Apply date filters if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $totalChanges = $query->count();
        $changesByAction = (clone $query)->selectRaw('action, count(*) as count')
            ->groupBy('action')
            ->pluck('count', 'action');

        $changesByEntity = (clone $query)->selectRaw('entity_type, count(*) as count')
            ->groupBy('entity_type')
            ->pluck('count', 'entity_type');

        $topUsers = (clone $query)->with('user')
            ->selectRaw('user_id, count(*) as changes_count')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('changes_count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'user_id' => $item->user_id,
                    'user_name' => $item->user?->name,
                    'user_email' => $item->user?->email,
                    'changes_count' => $item->changes_count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_changes' => $totalChanges,
                'changes_by_action' => $changesByAction,
                'changes_by_entity' => $changesByEntity,
                'top_users' => $topUsers,
            ],
        ]);
    }

    /**
     * Mostrar los cambios recientes.
     */
    public function recent(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);

        $histories = ChangeHistory::with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => ChangeHistoryResource::collection($histories),
        ]);
    }
}