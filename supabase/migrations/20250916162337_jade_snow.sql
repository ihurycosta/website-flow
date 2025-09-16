-- =====================================================
-- ESTRUTURA COMPLETA DA TABELA frp_purchases
-- Servidor: 151.242.227.127:3306
-- Database: u202_iFJybKgAa8
-- =====================================================

CREATE TABLE IF NOT EXISTS `frp_purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` varchar(50) NOT NULL COMMENT 'ID do jogador no servidor',
  `player_name` varchar(100) DEFAULT NULL COMMENT 'Nome do personagem',
  `product_name` varchar(100) NOT NULL COMMENT 'Nome do produto (VIP Ouro, VIP Diamante)',
  `product_price` decimal(10,2) NOT NULL COMMENT 'Preço do produto em reais',
  `payment_method` enum('pix','credit_card') NOT NULL COMMENT 'Método de pagamento',
  `mercadopago_payment_id` varchar(100) DEFAULT NULL COMMENT 'ID do pagamento no MercadoPago',
  `mercadopago_preference_id` varchar(100) DEFAULT NULL COMMENT 'ID da preferência no MercadoPago',
  `payment_status` enum('pending','approved','rejected','cancelled','refunded') DEFAULT 'pending' COMMENT 'Status do pagamento',
  `transaction_amount` decimal(10,2) DEFAULT NULL COMMENT 'Valor da transação',
  `currency_id` varchar(3) DEFAULT 'BRL' COMMENT 'Moeda da transação',
  `payer_email` varchar(255) DEFAULT NULL COMMENT 'Email do pagador',
  `payer_name` varchar(255) DEFAULT NULL COMMENT 'Nome do pagador',
  `payer_document` varchar(20) DEFAULT NULL COMMENT 'Documento do pagador',
  `payment_date` datetime DEFAULT NULL COMMENT 'Data do pagamento aprovado',
  `expiration_date` datetime DEFAULT NULL COMMENT 'Data de expiração do VIP',
  `webhook_data` text DEFAULT NULL COMMENT 'Dados completos do webhook (JSON)',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP do usuário que fez a compra',
  `user_agent` text DEFAULT NULL COMMENT 'User agent do navegador',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do registro',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da última atualização',
  `processed` tinyint(1) DEFAULT 0 COMMENT 'Se o VIP foi processado no servidor',
  `processed_at` datetime DEFAULT NULL COMMENT 'Data do processamento no servidor',
  `notes` text DEFAULT NULL COMMENT 'Observações adicionais',
  PRIMARY KEY (`id`),
  KEY `idx_player_id` (`player_id`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_mercadopago_payment_id` (`mercadopago_payment_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_processed` (`processed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela de compras de VIP do Flow Roleplay';

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índice composto para consultas frequentes
CREATE INDEX `idx_player_status` ON `frp_purchases` (`player_id`, `payment_status`);

-- Índice para relatórios por data
CREATE INDEX `idx_payment_date` ON `frp_purchases` (`payment_date`);

-- Índice para webhook processing
CREATE INDEX `idx_webhook_processing` ON `frp_purchases` (`mercadopago_payment_id`, `payment_status`);

-- =====================================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- =====================================================

-- View para vendas aprovadas
CREATE OR REPLACE VIEW `vw_approved_purchases` AS
SELECT 
    p.*,
    CASE 
        WHEN p.product_name = 'VIP Ouro' THEN 30
        WHEN p.product_name = 'VIP Diamante' THEN 30
        ELSE 30
    END as vip_duration_days
FROM `frp_purchases` p 
WHERE p.payment_status = 'approved';

-- View para relatório de vendas por mês
CREATE OR REPLACE VIEW `vw_monthly_sales` AS
SELECT 
    YEAR(payment_date) as year,
    MONTH(payment_date) as month,
    product_name,
    COUNT(*) as total_sales,
    SUM(transaction_amount) as total_revenue
FROM `frp_purchases` 
WHERE payment_status = 'approved'
GROUP BY YEAR(payment_date), MONTH(payment_date), product_name;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure para processar VIP no servidor
CREATE PROCEDURE `ProcessVipPurchase`(
    IN p_purchase_id INT,
    IN p_server_response TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    UPDATE `frp_purchases` 
    SET 
        `processed` = 1,
        `processed_at` = NOW(),
        `notes` = CONCAT(COALESCE(`notes`, ''), '\nServer Response: ', p_server_response)
    WHERE `id` = p_purchase_id;
    
    COMMIT;
END //

-- Procedure para expirar VIPs
CREATE PROCEDURE `ExpireVips`()
BEGIN
    UPDATE `frp_purchases` 
    SET `notes` = CONCAT(COALESCE(`notes`, ''), '\nVIP Expired: ', NOW())
    WHERE `payment_status` = 'approved' 
    AND `processed` = 1 
    AND `expiration_date` < NOW()
    AND `notes` NOT LIKE '%VIP Expired:%';
END //

DELIMITER ;

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL - REMOVER EM PRODUÇÃO)
-- =====================================================

/*
INSERT INTO `frp_purchases` (
    `player_id`, `product_name`, `product_price`, `payment_method`, 
    `payment_status`, `transaction_amount`, `payer_email`
) VALUES 
('TestPlayer1', 'VIP Ouro', 29.90, 'pix', 'approved', 29.90, 'test@example.com'),
('TestPlayer2', 'VIP Diamante', 49.90, 'credit_card', 'pending', 49.90, 'test2@example.com');
*/