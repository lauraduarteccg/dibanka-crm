<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campaign;
use App\Http\Resources\CampaignResource;
use Illuminate\Http\Response;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::all();
        
        return response()->json([
            'message'       => 'Campañas obtenidos con éxito',
            'campaign' => CampaignResource::collection($campaigns),
        ], Response::HTTP_OK);
    }
}
