<?php
/**
 * wolkvox_proxy.php
 *
 * Recibe datos del front y realiza el consumo a las APIs de Wolkvox desde servidor.
 * Recomendado: proteger con Auth propia (token Bearer/IP allowlist).
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// Opcional: limitar métodos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
  exit;
}

/* ==========
   Config via ENV (recomendado)
   Exporta estas variables en tu hosting / vhost:
   ========== */
$WOLKVOX_SERVER   = getenv('WOLKVOX_SERVER')   ?: '0006';     
$WOLKVOX_TOKEN    = getenv('WOLKVOX_TOKEN')    ?: '7b69645f6469737472697d2d3230323530383236313533363231';
$CAMPAIGN_WHATSAPP= getenv('WVK_CAMPAIGN_WA')  ?: '39650';    
$CAMPAIGN_SMS     = getenv('WVK_CAMPAIGN_SMS') ?: '39159';    

$WVK_BASE = 'https://wv'.$WOLKVOX_SERVER.'.wolkvox.com/api/v2/campaign.php?api=add_record&type_campaign=predictive';


$raw = file_get_contents('php://input');
$in = [];
if ($raw && ($decoded = json_decode($raw, true)) && is_array($decoded)) {
  $in = $decoded;
} else {
  $in = $_POST;
}

// Helper: obtener campo con fallbacks
$get = function(string $key, $default = '') use ($in) {
  return isset($in[$key]) ? $in[$key] : $default;
};

// Normalizaciones
$nombre      = trim((string)$get('nombre'));
$telefonoRaw = (string)$get('telefono');
$pagaduria   = trim((string)$get('pagaduria'));
$idWolkvox   = trim((string)$get('idWolkvox'));
$channelsStr = strtolower(trim((string)$get('channels', 'whatsapp,sms')));
$countryCode = preg_replace('/\D/', '', (string)$get('country_code', '57')); // por defecto CO

// Validaciones mínimas
$telefono = preg_replace('/\D/', '', $telefonoRaw);
if ($nombre === '' || $telefono === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'nombre y telefono son requeridos']);
  exit;
}
if ($WOLKVOX_TOKEN === 'REEMPLAZAR' || $WOLKVOX_SERVER === '0000') {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Variables de entorno no configuradas']);
  exit;
}

// Canales a disparar
$channels = array_filter(array_map('trim', explode(',', $channelsStr)));
$channels = $channels ?: ['whatsapp','sms'];

// Construye payload para Wolkvox
$buildPayload = function(string $tel1) use ($nombre, $pagaduria, $idWolkvox) : string {
  $payload = [[
    'customer_name'      => $nombre,
    'customer_last_name' => '',
    'id_type'            => '',
    'customer_id'        => $idWolkvox,
    'age'                => '',
    'gender'             => '',
    'country'            => '',
    'state'              => '',
    'city'               => '',
    'zone'               => '',
    'address'            => '',
    'opt1'               => $pagaduria,
    'opt2'               => '',
    'opt3'               => '',
    'opt4'               => '',
    'opt5'               => '',
    'opt6'               => '',
    'opt7'               => '',
    'opt8'               => '',
    'opt9'               => '',
    'opt10'              => '',
    'opt11'              => '',
    'opt12'              => '',
    'tel1'               => $tel1,
    'tel2'               => '',
    'tel3'               => '',
    'tel4'               => '',
    'tel5'               => '',
    'tel6'               => '',
    'tel7'               => '',
    'tel8'               => '',
    'tel9'               => '',
    'tel10'              => '',
    'tel_extra'          => '',
    'email'              => '',
    'recall_date'        => '',
    'recall_telephone'   => '',
  ]];

  return json_encode($payload, JSON_UNESCAPED_UNICODE);
};

// Llamada cURL genérica
$callWolkvox = function(string $campaignId, string $jsonBody) use ($WVK_BASE, $WOLKVOX_TOKEN, $WOLKVOX_SERVER) : array {
  $url = $WVK_BASE . '&campaign_id=' . urlencode($campaignId) . '&campaign_status=start';

  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
      'Content-Type: application/json',
      'wolkvox-token: ' . $WOLKVOX_TOKEN,
      'wolkvox_server: ' . $WOLKVOX_SERVER,
    ],
    CURLOPT_POSTFIELDS     => $jsonBody,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true, // para capturar headers + body
    CURLOPT_TIMEOUT        => 30,
  ]);

  $rawResponse = curl_exec($ch);
  $errno = curl_errno($ch);
  $error = curl_error($ch);
  $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $headerSize = (int)curl_getinfo($ch, CURLINFO_HEADER_SIZE);
  curl_close($ch);

  $respHeaders = substr((string)$rawResponse, 0, $headerSize);
  $respBody    = substr((string)$rawResponse, $headerSize);

  return [
    'ok'          => ($errno === 0),
    'http_status' => $status,
    'error'       => $error ?: null,
    'headers'     => $respHeaders,
    'body'        => $respBody,
    'url'         => $url,
  ];
};

// Teléfono final (country code + número)
$telE164 = ($countryCode ? $countryCode : '57') . $telefono;

// Ejecutar según canales
$results = [];
foreach ($channels as $ch) {
  if ($ch === 'whatsapp') {
    if ($CAMPAIGN_WHATSAPP === '00000') {
      $results['whatsapp'] = ['ok' => false, 'error' => 'CAMPAIGN_WHATSAPP no configurada'];
    } else {
      $payload = $buildPayload($telE164);
      $results['whatsapp'] = $callWolkvox($CAMPAIGN_WHATSAPP, $payload);
    }
  } elseif ($ch === 'sms') {
    if ($CAMPAIGN_SMS === '00000') {
      $results['sms'] = ['ok' => false, 'error' => 'CAMPAIGN_SMS no configurada'];
    } else {
      $payload = $buildPayload($telE164);
      $results['sms'] = $callWolkvox($CAMPAIGN_SMS, $payload);
    }
  }
}

// Respuesta final
echo json_encode([
  'ok'       => true,
  'sent_to'  => $channels,
  'input'    => [
    'nombre'      => $nombre,
    'telefono'    => $telE164,
    'pagaduria'   => $pagaduria,
    'idWolkvox'   => $idWolkvox,
  ],
  'results'  => $results,
], JSON_UNESCAPED_UNICODE);
