# Sistema de Compra VIP - Flow Roleplay

## 📋 Visão Geral

Sistema completo de compra de VIP integrado com MercadoPago para o servidor Flow Roleplay MTA. Inclui interface web moderna, processamento de pagamentos seguro e integração automática com o servidor de jogo.

## 🚀 Funcionalidades

- ✅ Modal de compra responsivo e intuitivo
- ✅ Integração completa com MercadoPago (PIX e Cartão)
- ✅ Webhook automático para confirmação de pagamentos
- ✅ Sistema de banco de dados robusto
- ✅ Integração automática com servidor MTA
- ✅ Logs detalhados para auditoria
- ✅ Painel administrativo para gerenciar VIPs

## 🛠️ Instalação e Configuração

### 1. Configuração do Banco de Dados

```sql
-- Execute o arquivo database.sql no seu MySQL
-- Servidor: 151.242.227.127:3306
-- Database: u202_iFJybKgAa8
```

### 2. Configuração do MercadoPago

1. Acesse [MercadoPago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Obtenha suas credenciais:
   - Access Token
   - Public Key
4. Configure no arquivo `create-payment.php`:

```php
define('MP_ACCESS_TOKEN', 'SEU_ACCESS_TOKEN_AQUI');
define('MP_PUBLIC_KEY', 'SEU_PUBLIC_KEY_AQUI');
```

### 3. Configuração do Webhook

1. Configure a URL do webhook no MercadoPago:
   ```
   https://seudominio.com/webhook.php
   ```

2. Configure as URLs de retorno:
   ```php
   define('SUCCESS_URL', 'https://seudominio.com/success.html');
   define('FAILURE_URL', 'https://seudominio.com/failure.html');
   ```

### 4. Configuração do Servidor MTA

1. Copie o arquivo `server-integration.lua` para seu servidor MTA
2. Configure a API Key:
   ```lua
   local API_KEY = "SUA_API_KEY_AQUI"
   ```

3. Adicione ao `meta.xml` do seu gamemode:
   ```xml
   <script src="server-integration.lua" type="server" />
   ```

### 5. Estrutura de Arquivos

```
backend/
├── api/
│   └── create-payment.php     # API para criar pagamentos
├── webhook.php                # Webhook do MercadoPago
├── server-integration.lua     # Integração com MTA
├── database.sql              # Estrutura do banco
├── logs/                     # Logs do sistema
└── README.md                 # Este arquivo
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente

```php
// Banco de Dados
define('DB_HOST', '151.242.227.127');
define('DB_PORT', '3306');
define('DB_NAME', 'u202_iFJybKgAa8');
define('DB_USER', 'u202_iFJybKgAa8');
define('DB_PASS', '+2Wi=hFbohq@B.uDPqJe@3Os');

// MercadoPago
define('MP_ACCESS_TOKEN', 'SEU_TOKEN');
define('MP_PUBLIC_KEY', 'SUA_CHAVE');

// URLs
define('WEBHOOK_URL', 'https://seudominio.com/webhook.php');
define('SUCCESS_URL', 'https://seudominio.com/success.html');
define('FAILURE_URL', 'https://seudominio.com/failure.html');
```

## 📊 Fluxo de Compra

1. **Cliente clica em "Comprar"** → Modal abre
2. **Insere ID do jogador** → Validação
3. **Escolhe método de pagamento** → PIX ou Cartão
4. **Sistema cria preferência** → MercadoPago
5. **Cliente é redirecionado** → Página de pagamento
6. **Pagamento é processado** → Webhook é chamado
7. **VIP é ativado automaticamente** → Servidor MTA

## 🔍 Monitoramento e Logs

### Logs Disponíveis

- `logs/webhook.log` - Logs do webhook
- `logs/payments.log` - Logs de pagamentos
- `logs/server.log` - Logs do servidor MTA

### Comandos Administrativos (MTA)

```lua
/checkvip [nome]     -- Verificar VIP de um jogador
/removevip <nome>    -- Remover VIP de um jogador
```

## 🛡️ Segurança

- ✅ Validação de API Keys
- ✅ Sanitização de dados de entrada
- ✅ Prepared statements (SQL Injection)
- ✅ Logs de auditoria
- ✅ Verificação de origem das requisições
- ✅ Timeout em requisições externas

## 📈 Relatórios e Analytics

### Views Disponíveis

```sql
-- Vendas aprovadas
SELECT * FROM vw_approved_purchases;

-- Vendas por mês
SELECT * FROM vw_monthly_sales;
```

### Stored Procedures

```sql
-- Processar VIP
CALL ProcessVipPurchase(purchase_id, 'response');

-- Expirar VIPs
CALL ExpireVips();
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Webhook não funciona**
   - Verifique se a URL está acessível
   - Confirme as credenciais do MercadoPago
   - Verifique os logs em `logs/webhook.log`

2. **VIP não ativa no servidor**
   - Verifique a conexão com o servidor MTA
   - Confirme a API Key no arquivo Lua
   - Verifique se o recurso está iniciado

3. **Erro de banco de dados**
   - Confirme as credenciais de conexão
   - Verifique se as tabelas foram criadas
   - Verifique permissões do usuário

### Contato para Suporte

- Discord: [Flow Roleplay](https://discord.gg/flowroleplay)
- Email: contato@flowroleplay.com.br

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Sistema inicial implementado
- ✅ Integração com MercadoPago
- ✅ Interface web responsiva
- ✅ Webhook automático
- ✅ Integração com MTA

---

**Desenvolvido para Flow Roleplay** 🎮