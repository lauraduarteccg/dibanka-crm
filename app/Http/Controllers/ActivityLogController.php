<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Http\Response;
use Carbon\Carbon;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        $logs = ActivityLog::with('user')
            ->when($startDate, function ($q) use ($startDate) {
                $start = Carbon::createFromFormat('Y-m-d H:i:s', $startDate, 'America/Bogota')->setTimezone(config('app.timezone'));
                $q->where('created_at', '>=', $start->format('Y-m-d H:i:s'));
            })
            ->when($endDate, function ($q) use ($endDate) {
                $end = Carbon::createFromFormat('Y-m-d H:i:s', $endDate, 'America/Bogota')->setTimezone(config('app.timezone'));
                $q->where('created_at', '<=', $end->format('Y-m-d H:i:s'));
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'message'    => 'Logs obtenidos con éxito',
            'data'       => ActivityLogResource::collection($logs),
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'total_pages'  => $logs->lastPage(),
                'per_page'     => $logs->perPage(),
                'total_logs'   => $logs->total(),
            ],
        ], Response::HTTP_OK);
    }
}
