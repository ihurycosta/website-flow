<?php
/**
 * API para criar pagamento no MercadoPago
 * Flow Roleplay - Sistema de Compra VIP
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações do MercadoPago
define('MP_ACCESS_TOKEN', 'APP_USR-4704243050109077-032118-ce8e269acf604c88d07d7506bb38b183-1110300735'); // Substitua pelo seu token
define('MP_PUBLIC_KEY', 'APP_USR-8303e44e-3d00-497b-aae6-cc791cb1ceff');     // Substitua pela sua chave pública

// Configurações do Banco de Dados
define('DB_HOST', '151.242.227.127');
define('DB_PORT', '3306');
define('DB_NAME', 'u202_iFJybKgAa8');
define('DB_PASS', '+2Wi=hFbohq@B.uDPqJe@3Os');

// Configurações do Sistema
define('WEBHOOK_URL', 'https://seudominio.com/webhook.php'); // Substitua pela sua URL
define('SUCCESS_URL', 'https://seudominio.com/compra-sucesso');
define('FAILURE_URL', 'https://seudominio.com/compra-falha');

/**
 * Conecta ao banco de dados
 */
function connectDatabase() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return false;
    }
}

/**
 * Valida os dados de entrada
 */
function validateInput($data) {
    $errors = [];
    
    if (empty($data['player_id']) || strlen($data['player_id']) < 3) {
        $errors[] = 'ID do jogador deve ter pelo menos 3 caracteres';
    }
    
    if (empty($data['product_name'])) {
        $errors[] = 'Nome do produto é obrigatório';
    }
    
    if (empty($data['product_price']) || !is_numeric(str_replace(['R$ ', ','], ['', '.'], $data['product_price']))) {
        $errors[] = 'Preço do produto inválido';
    }
    
    if (!in_array($data['payment_method'], ['pix', 'credit_card'])) {
        $errors[] = 'Método de pagamento inválido';
    }
    
    return $errors;
}

/**
 * Cria preferência no MercadoPago
 */
function createMercadoPagoPreference($data) {
    $price = (float) str_replace(['R$ ', ','], ['', '.'], $data['product_price']);
    
    $preference = [
        'items' => [
            [
                'title' => $data['product_name'] . ' - Flow Roleplay',
                'description' => 'VIP para o jogador: ' . $data['player_id'],
                'quantity' => 1,
                'currency_id' => 'BRL',
                'unit_price' => $price
            ]
        ],
        'payer' => [
            'name' => $data['player_id'],
            'email' => 'noreply@flowroleplay.com'
        ],
        'payment_methods' => [
            'excluded_payment_types' => [],
            'installments' => 12
        ],
        'back_urls' => [
            'success' => SUCCESS_URL,
            'failure' => FAILURE_URL,
            'pending' => SUCCESS_URL
        ],
        'auto_return' => 'approved',
        'notification_url' => WEBHOOK_URL,
        'external_reference' => uniqid('frp_'),
        'expires' => true,
        'expiration_date_from' => date('c'),
        'expiration_date_to' => date('c', strtotime('+1 hour'))
    ];
    
    // Configurar método de pagamento específico
    if ($data['payment_method'] === 'pix') {
        $preference['payment_methods']['excluded_payment_types'] = [
            ['id' => 'credit_card'],
            ['id' => 'debit_card'],
            ['id' => 'ticket']
        ];
    } elseif ($data['payment_method'] === 'credit_card') {
        $preference['payment_methods']['excluded_payment_types'] = [
            ['id' => 'account_money'],
            ['id' => 'ticket']
        ];
    }
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => 'https://api.mercadopago.com/checkout/preferences',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($preference),
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . MP_ACCESS_TOKEN,
            'Content-Type: application/json'
        ],
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    if ($httpCode !== 201) {
        error_log("MercadoPago API Error: " . $response);
        return false;
    }
    
    return json_decode($response, true);
}

/**
 * Salva a compra no banco de dados
 */
function savePurchase($pdo, $data, $preference) {
    try {
        $price = (float) str_replace(['R$ ', ','], ['', '.'], $data['product_price']);
        
        $stmt = $pdo->prepare("
            INSERT INTO frp_purchases (
                player_id, product_name, product_price, payment_method,
                mercadopago_preference_id, payment_status, transaction_amount,
                currency_id, ip_address, user_agent, expiration_date
            ) VALUES (
                :player_id, :product_name, :product_price, :payment_method,
                :preference_id, 'pending', :transaction_amount,
                'BRL', :ip_address, :user_agent, :expiration_date
            )
        ");
        
        $expirationDate = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        $stmt->execute([
            ':player_id' => $data['player_id'],
            ':product_name' => $data['product_name'],
            ':product_price' => $price,
            ':payment_method' => $data['payment_method'],
            ':preference_id' => $preference['id'],
            ':transaction_amount' => $price,
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            ':expiration_date' => $expirationDate
        ]);
        
        return $pdo->lastInsertId();
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

// Processar requisição
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

// Validar entrada
$errors = validateInput($input);
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Conectar ao banco
$pdo = connectDatabase();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro de conexão com banco de dados']);
    exit;
}

// Criar preferência no MercadoPago
$preference = createMercadoPagoPreference($input);
if (!$preference) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao criar pagamento']);
    exit;
}

// Salvar no banco de dados
$purchaseId = savePurchase($pdo, $input, $preference);
if (!$purchaseId) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar compra']);
    exit;
}

// Retornar sucesso
echo json_encode([
    'success' => true,
    'payment_url' => $preference['init_point'],
    'preference_id' => $preference['id'],
    'purchase_id' => $purchaseId
]);
?>