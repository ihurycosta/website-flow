<?php
/**
 * Webhook do MercadoPago para processar notificações de pagamento
 * Flow Roleplay - Sistema de Compra VIP
 */

header('Content-Type: application/json');

// Configurações
define('MP_ACCESS_TOKEN', 'SEU_ACCESS_TOKEN_AQUI'); // Substitua pelo seu token
define('DB_HOST', '151.242.227.127');
define('DB_PORT', '3306');
define('DB_NAME', 'u202_iFJybKgAa8');
define('DB_USER', 'u202_iFJybKgAa8');
define('DB_PASS', '+2Wi=hFbohq@B.uDPqJe@3Os');

// Configurações do servidor MTA
define('MTA_SERVER_HOST', '192.168.1.100');
define('MTA_SERVER_PORT', '22003');
define('MTA_API_KEY', 'SUA_API_KEY_MTA'); // Configure uma API key no seu servidor MTA

/**
 * Log de eventos
 */
function logEvent($message, $data = null) {
    $logFile = __DIR__ . '/logs/webhook.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message";
    
    if ($data) {
        $logMessage .= " | Data: " . json_encode($data);
    }
    
    file_put_contents($logFile, $logMessage . PHP_EOL, FILE_APPEND | LOCK_EX);
}

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
        logEvent("Database connection error", $e->getMessage());
        return false;
    }
}

/**
 * Busca informações do pagamento no MercadoPago
 */
function getPaymentInfo($paymentId) {
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.mercadopago.com/v1/payments/$paymentId",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . MP_ACCESS_TOKEN,
            'Content-Type: application/json'
        ],
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    if ($httpCode !== 200) {
        logEvent("MercadoPago API Error", "HTTP $httpCode: $response");
        return false;
    }
    
    return json_decode($response, true);
}

/**
 * Atualiza o status do pagamento no banco
 */
function updatePaymentStatus($pdo, $paymentData) {
    try {
        // Buscar a compra pela preference_id ou payment_id
        $stmt = $pdo->prepare("
            SELECT * FROM frp_purchases 
            WHERE mercadopago_preference_id = :preference_id 
            OR mercadopago_payment_id = :payment_id
            LIMIT 1
        ");
        
        $stmt->execute([
            ':preference_id' => $paymentData['additional_info']['items'][0]['id'] ?? '',
            ':payment_id' => $paymentData['id']
        ]);
        
        $purchase = $stmt->fetch();
        
        if (!$purchase) {
            logEvent("Purchase not found", $paymentData['id']);
            return false;
        }
        
        // Atualizar dados do pagamento
        $updateStmt = $pdo->prepare("
            UPDATE frp_purchases SET
                mercadopago_payment_id = :payment_id,
                payment_status = :status,
                transaction_amount = :amount,
                payer_email = :payer_email,
                payer_name = :payer_name,
                payer_document = :payer_document,
                payment_date = :payment_date,
                webhook_data = :webhook_data,
                updated_at = NOW()
            WHERE id = :purchase_id
        ");
        
        $paymentDate = null;
        if ($paymentData['status'] === 'approved' && isset($paymentData['date_approved'])) {
            $paymentDate = date('Y-m-d H:i:s', strtotime($paymentData['date_approved']));
        }
        
        $updateStmt->execute([
            ':payment_id' => $paymentData['id'],
            ':status' => $paymentData['status'],
            ':amount' => $paymentData['transaction_amount'],
            ':payer_email' => $paymentData['payer']['email'] ?? null,
            ':payer_name' => ($paymentData['payer']['first_name'] ?? '') . ' ' . ($paymentData['payer']['last_name'] ?? ''),
            ':payer_document' => $paymentData['payer']['identification']['number'] ?? null,
            ':payment_date' => $paymentDate,
            ':webhook_data' => json_encode($paymentData),
            ':purchase_id' => $purchase['id']
        ]);
        
        logEvent("Payment updated", [
            'purchase_id' => $purchase['id'],
            'payment_id' => $paymentData['id'],
            'status' => $paymentData['status']
        ]);
        
        return $purchase;
        
    } catch (PDOException $e) {
        logEvent("Database error in updatePaymentStatus", $e->getMessage());
        return false;
    }
}

/**
 * Processa VIP no servidor MTA
 */
function processVipInServer($purchase) {
    // Determinar duração do VIP baseado no produto
    $vipDuration = 30; // dias padrão
    $vipType = 'gold';
    
    if (strpos(strtolower($purchase['product_name']), 'diamante') !== false) {
        $vipType = 'diamond';
    }
    
    // Dados para enviar ao servidor MTA
    $serverData = [
        'action' => 'add_vip',
        'player_id' => $purchase['player_id'],
        'vip_type' => $vipType,
        'duration_days' => $vipDuration,
        'purchase_id' => $purchase['id'],
        'api_key' => MTA_API_KEY
    ];
    
    // Enviar para o servidor MTA (adapte conforme sua API)
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => 'http://' . MTA_SERVER_HOST . ':' . MTA_SERVER_PORT . '/api/vip',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($serverData),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-API-Key: ' . MTA_API_KEY
        ],
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    logEvent("MTA Server Response", [
        'http_code' => $httpCode,
        'response' => $response,
        'purchase_id' => $purchase['id']
    ]);
    
    return $httpCode === 200;
}

/**
 * Marca VIP como processado no banco
 */
function markVipAsProcessed($pdo, $purchaseId, $serverResponse) {
    try {
        $stmt = $pdo->prepare("
            UPDATE frp_purchases SET
                processed = 1,
                processed_at = NOW(),
                notes = CONCAT(COALESCE(notes, ''), :server_response)
            WHERE id = :purchase_id
        ");
        
        $stmt->execute([
            ':purchase_id' => $purchaseId,
            ':server_response' => "\nVIP processado em: " . date('Y-m-d H:i:s') . " | Resposta: " . $serverResponse
        ]);
        
        return true;
    } catch (PDOException $e) {
        logEvent("Error marking VIP as processed", $e->getMessage());
        return false;
    }
}

// Processar webhook
try {
    // Verificar se é uma requisição POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
    
    // Obter dados do webhook
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        logEvent("Invalid webhook data", $input);
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }
    
    logEvent("Webhook received", $data);
    
    // Verificar se é uma notificação de pagamento
    if ($data['type'] !== 'payment') {
        logEvent("Ignoring non-payment notification", $data['type']);
        http_response_code(200);
        echo json_encode(['status' => 'ignored']);
        exit;
    }
    
    // Obter ID do pagamento
    $paymentId = $data['data']['id'] ?? null;
    if (!$paymentId) {
        logEvent("No payment ID in webhook", $data);
        http_response_code(400);
        echo json_encode(['error' => 'No payment ID']);
        exit;
    }
    
    // Buscar informações completas do pagamento
    $paymentInfo = getPaymentInfo($paymentId);
    if (!$paymentInfo) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get payment info']);
        exit;
    }
    
    // Conectar ao banco
    $pdo = connectDatabase();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }
    
    // Atualizar status do pagamento
    $purchase = updatePaymentStatus($pdo, $paymentInfo);
    if (!$purchase) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update payment']);
        exit;
    }
    
    // Se o pagamento foi aprovado e ainda não foi processado
    if ($paymentInfo['status'] === 'approved' && !$purchase['processed']) {
        logEvent("Processing approved payment", $purchase['id']);
        
        // Processar VIP no servidor
        $serverSuccess = processVipInServer($purchase);
        
        if ($serverSuccess) {
            markVipAsProcessed($pdo, $purchase['id'], 'VIP ativado com sucesso');
            logEvent("VIP processed successfully", $purchase['id']);
        } else {
            logEvent("Failed to process VIP in server", $purchase['id']);
        }
    }
    
    http_response_code(200);
    echo json_encode(['status' => 'processed']);
    
} catch (Exception $e) {
    logEvent("Webhook error", $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>