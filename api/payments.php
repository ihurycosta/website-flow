<?php
// ==============================
// API DE PAGAMENTOS - FLOW ROLEPLAY (Vercel Serverless)
// ==============================

// DEBUG (desligue em produção)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);
define('DEBUG_MODE', false);

// ===== Config via ENV =====
$MP_ACCESS_TOKEN = getenv('MP_ACCESS_TOKEN') ?: '';
$BASE_URL        = rtrim(getenv('BASE_URL') ?: ('https://' . ($_SERVER['VERCEL_URL'] ?? '')), '/');

if (!$MP_ACCESS_TOKEN || !$BASE_URL) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>'Configuração ausente (MP_ACCESS_TOKEN/BASE_URL).']);
  exit;
}

define('SUCCESS_URL', $BASE_URL . '/compra-sucesso');
define('FAILURE_URL', $BASE_URL . '/compra-falha');
define('WEBHOOK_URL', $BASE_URL . '/api/webhook'); // precisa existir api/webhook.php

// ===== CORS =====
header("Access-Control-Allow-Origin: https://www.flowroleplay.com.br");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// ===== Execução =====
try {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    throw new Exception('Método não permitido. Utilize POST.', 405);
  }

  $raw = file_get_contents('php://input');
  $input = json_decode($raw, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception('JSON inválido ou corpo vazio.', 400);
  }

  $errors = validateInput($input);
  if (!empty($errors)) {
    throw new Exception(implode(', ', $errors), 400);
  }

  $productDetails = getProductDetails($input['product_name']);
  $preference = createMercadoPagoPreference($input, $productDetails, $MP_ACCESS_TOKEN);

  sendJsonResponse([
    'success'       => true,
    'payment_url'   => $preference['init_point'] ?? null,
    'preference_id' => $preference['id'] ?? null
  ], 201);

} catch (Exception $e) {
  $statusCode = ($e->getCode() >= 400) ? $e->getCode() : 500;
  $err = ['success'=>false,'message'=>$e->getMessage()];
  if (DEBUG_MODE) { $err['debug_info'] = ['file'=>$e->getFile(),'line'=>$e->getLine()]; }
  sendJsonResponse($err, $statusCode);
}

// ===== Funções =====
function getProductDetails(string $productName): array {
  $n = strtolower(trim($productName));
  return match ($n) {
    'vip diamante' => ['price'=>2.00, 'type'=>'diamond'],
    'vip ouro'     => ['price'=>1.00, 'type'=>'gold'],
    default        => throw new Exception("Produto '{$productName}' inválido.", 400),
  };
}

function createMercadoPagoPreference(array $data, array $prod, string $token): array {
  $payload = [
    'items' => [[
      'title'       => $data['product_name'].' - Flow Roleplay',
      'description' => 'VIP para o jogador ID: '.$data['player_id'],
      'quantity'    => 1,
      'currency_id' => 'BRL',
      'unit_price'  => (float)$prod['price'],
    ]],
    'metadata' => [
      'player_id' => (string)$data['player_id'],
      'vip_tipo'  => $prod['type'],
    ],
    'back_urls'         => ['success'=>SUCCESS_URL, 'failure'=>FAILURE_URL, 'pending'=>SUCCESS_URL],
    'auto_return'       => 'approved',
    'notification_url'  => WEBHOOK_URL,
    'external_reference'=> $data['player_id'].'|'.$prod['type'].'|'.uniqid('', true)
  ];

  $ch = curl_init('https://api.mercadopago.com/checkout/preferences');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => 'POST',
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
      'Authorization: Bearer '.$token,
      'Content-Type: application/json',
      'User-Agent: FlowRoleplayPayments/3.1'
    ],
    CURLOPT_TIMEOUT        => 9,   // <= Serverless-friendly
  ]);
  $resp = curl_exec($ch);
  $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err  = curl_error($ch);
  curl_close($ch);

  if ($err)         throw new Exception("Erro de comunicação com a API: ".$err, 502);
  $json = json_decode($resp, true);
  if ($http !== 201) {
    $msg = $json['message'] ?? 'Falha ao criar a preferência.';
    throw new Exception("Erro no Mercado Pago: ".$msg, $http ?: 502);
  }
  return $json ?: [];
}

function validateInput(?array $d): array {
  $e = [];
  if (empty($d['product_name'])) $e[] = 'O nome do produto é obrigatório';
  if (empty($d['player_id']))    $e[] = 'A ID do jogador é obrigatória';
  return $e;
}

function sendJsonResponse($data, int $status=200): void {
  http_response_code($status);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}
