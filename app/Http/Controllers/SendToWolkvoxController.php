<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SendToWolkvoxController extends Controller
{
    public function sendWhatsApp(Request $request)
    {
        // Validación
        $request->validate([
            'nombre' => 'required',
            'telefono' => 'required',
            'id_wolkvox' => 'required',
            'pagaduria' => 'required',
        ]);

        // Configuración
        $server = env('WOLKVOX_SERVER', '0006');
        $token = env('WOLKVOX_TOKEN');
        $campaignWA = env('WVK_CAMPAIGN_WA', '39159');

        // Datos
        $nombre = $request->nombre;
        $telefono = preg_replace('/\D/', '', $request->telefono);
        $idWolkvox = $request->id_wolkvox;
        $pagaduria = $request->pagaduria;
        $countryCode = $request->country_code ?? '57';
        $telCompleto = $countryCode . $telefono;

        // Payload
        $payload = [[
            'customer_name' => $nombre,
            'customer_last_name' => '',
            'id_type' => '',
            'customer_id' => $idWolkvox,
            'age' => '',
            'gender' => '',
            'country' => '',
            'state' => '',
            'city' => '',
            'zone' => '',
            'address' => '',
            'opt1' => $pagaduria,
            'opt2' => '',
            'opt3' => '',
            'opt4' => '',
            'opt5' => '',
            'opt6' => '',
            'opt7' => '',
            'opt8' => '',
            'opt9' => '',
            'opt10' => '',
            'opt11' => '',
            'opt12' => '',
            'tel1' => $telCompleto,
            'tel2' => '',
            'tel3' => '',
            'tel4' => '',
            'tel5' => '',
            'tel6' => '',
            'tel7' => '',
            'tel8' => '',
            'tel9' => '',
            'tel10' => '',
            'tel_extra' => '',
            'email' => '',
            'recall_date' => '',
            'recall_telephone' => '',
        ]];

        $url = "https://wv{$server}.wolkvox.com/api/v2/campaign.php?api=add_record&type_campaign=predictive&campaign_id={$campaignWA}&campaign_status=start";
        
        // Enviar a WhatsApp
        $response = Http::withHeaders([
            'wolkvox-token' => $token,
            'wolkvox_server' => $server,
        ])->post($url, $payload);

        return response()->json([
            'ok' => $response->successful(),
            'channel' => 'whatsapp',
            'response' => $response->json(),
        ]);
    }

    public function sendSMS(Request $request)
    {
        // Validación
        $request->validate([
            'nombre' => 'required',
            'telefono' => 'required',
            'id_wolkvox' => 'required',
            'pagaduria' => 'required',
        ]);

        // Configuración
        $server = env('WOLKVOX_SERVER', '0006');
        $token = env('WOLKVOX_TOKEN');
        $campaignSMS = env('WVK_CAMPAIGN_SMS', '39650');

        // Datos
        $nombre = $request->nombre;
        $telefono = preg_replace('/\D/', '', $request->telefono);
        $idWolkvox = $request->id_wolkvox;
        $pagaduria = $request->pagaduria;
        $countryCode = $request->country_code ?? '99';
        $telCompleto = $countryCode . $telefono;

        // Payload
        $payload = [[
            'customer_name' => $nombre,
            'customer_last_name' => '',
            'id_type' => '',
            'customer_id' => $idWolkvox,
            'age' => '',
            'gender' => '',
            'country' => '',
            'state' => '',
            'city' => '',
            'zone' => '',
            'address' => '',
            'opt1' => $pagaduria,
            'opt2' => '',
            'opt3' => '',
            'opt4' => '',
            'opt5' => '',
            'opt6' => '',
            'opt7' => '',
            'opt8' => '',
            'opt9' => '',
            'opt10' => '',
            'opt11' => '',
            'opt12' => '',
            'tel1' => $telCompleto,
            'tel2' => '',
            'tel3' => '',
            'tel4' => '',
            'tel5' => '',
            'tel6' => '',
            'tel7' => '',
            'tel8' => '',
            'tel9' => '',
            'tel10' => '',
            'tel_extra' => '',
            'email' => '',
            'recall_date' => '',
            'recall_telephone' => '',
        ]];

        $url = "https://wv{$server}.wolkvox.com/api/v2/campaign.php?api=add_record&type_campaign=predictive&campaign_id={$campaignSMS}&campaign_status=start";
        
        // Enviar SMS
        $response = Http::withHeaders([
            'wolkvox-token' => $token,
            'wolkvox_server' => $server,
        ])->post($url, $payload);

        return response()->json([
            'ok' => $response->successful(),
            'channel' => 'sms',
            'response' => $response->json(),
        ]);
    }
}