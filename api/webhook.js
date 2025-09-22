// api/webhook.js

import fetch from 'node-fetch';

// --- CONFIGURAÇÕES ---
// É ALTAMENTE RECOMENDADO colocar estes valores como "Environment Variables" no painel da Vercel
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-7920134045367075-091618-c88c2e30f61af89cce8cb567be2a0f2a-1110300735';
const MTA_HTTP_HOST     = process.env.MTA_HTTP_HOST || '151.242.227.196';
const MTA_HTTP_PORT     = process.env.MTA_HTTP_PORT || '22053';
const MTA_HTTP_USER     = process.env.MTA_HTTP_USER || 'iShaiNBOT';
const MTA_HTTP_PASS     = process.env.MTA_HTTP_PASS || '3Bb07*6121595';
const MTA_RESOURCE_NAME = process.env.MTA_RESOURCE_NAME || 'frp_function';
const MTA_FUNCTION_NAME = process.env.MTA_FUNCTION_NAME || 'givePlayerVip';
const DEFAULT_VIP_DAYS  = 30;

// A função principal que a Vercel irá executar
export default async function handler(req, res) {
    // 1. Apenas aceitar requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const notification = req.body;
        console.log(">> Webhook acionado. Payload:", notification);

        // 2. Extrair o ID do pagamento da notificação
        const paymentId = notification?.data?.id;
        if (notification?.type !== 'payment' || !paymentId) {
            console.log("Notificação ignorada (tipo não é 'payment' ou ID está em falta).");
            return res.status(200).json({ success: true, message: 'Notification ignored' });
        }
        console.log(`Notificação de pagamento válida. ID: ${paymentId}`);

        // 3. Consultar a API do Mercado Pago para verificar (Segurança!)
        console.log("Consultando API do Mercado Pago...");
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
        });

        if (!mpResponse.ok) {
            throw new Error(`Falha ao consultar MP. Status: ${mpResponse.status}`);
        }
        const paymentDetails = await mpResponse.json();
        console.log(`Detalhes obtidos. Status: ${paymentDetails.status}`);

        // 4. Verificar se o pagamento está aprovado
        if (paymentDetails.status !== 'approved') {
            console.log("Pagamento não está 'approved'.");
            return res.status(200).json({ success: true, message: 'Payment not approved' });
        }

        console.log("PAGAMENTO APROVADO! Extraindo dados...");
        const { player_id, vip_tipo } = paymentDetails.metadata;

        if (!player_id || !vip_tipo) {
            throw new Error("Metadata (player_id ou vip_tipo) em falta no pagamento.");
        }
        console.log(`Dados extraídos: Player ID = ${player_id}, Tipo VIP = ${vip_tipo}`);

        // 5. Chamar o servidor MTA
        const mtaUrl = `http://${MTA_HTTP_HOST}:${MTA_HTTP_PORT}/${MTA_RESOURCE_NAME}/${MTA_FUNCTION_NAME}`;
        
        // Autenticação Basic para o MTA
        const mtaAuth = 'Basic ' + Buffer.from(`${MTA_HTTP_USER}:${MTA_HTTP_PASS}`).toString('base64');
        
        // Dados a serem enviados via POST
        const mtaBody = new URLSearchParams({
            id: player_id,
            tipo: vip_tipo,
            tempo: DEFAULT_VIP_DAYS
        });

        console.log(`Chamando MTA na URL: ${mtaUrl}`);
        const mtaResponse = await fetch(mtaUrl, {
            method: 'POST',
            headers: {
                'Authorization': mtaAuth,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: mtaBody
        });

        const mtaResponseText = await mtaResponse.text();

        if (!mtaResponse.ok) {
            throw new Error(`Erro ao chamar o MTA! Status: ${mtaResponse.status}, Resposta: ${mtaResponseText}`);
        }
        
        console.log(`SUCESSO! MTA respondeu com status ${mtaResponse.status}. Resposta: ${mtaResponseText}`);
        
        // 6. Enviar resposta de sucesso final
        res.status(200).json({ success: true, message: 'VIP aplicado com sucesso!' });

    } catch (error) {
        console.error("ERRO CRÍTICO NO WEBHOOK:", error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}