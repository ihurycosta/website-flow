// Local do arquivo: /api/webhook.js

import fetch from 'node-fetch';
// =================================================================================
// ||               >>>   IMPORTANDO A BIBLIOTECA MTASA EXATAMENTE COMO PEDIDO   <<<                ||
// =================================================================================
import mtasa from 'mtasa';
const MTAClient = mtasa.default || mtasa.Client || mtasa.MTA;

// --- CONFIGURAÇÕES ---
// As credenciais são lidas das "Environment Variables" da Vercel para segurança.
const MP_ACCESS_TOKEN = "APP_USR-7920134045367075-091618-c88c2e30f61af89cce8cb567be2a0f2a-1110300735";
const MTA_HTTP_HOST     = "151.242.227.196";
const MTA_HTTP_PORT     = "22053";
const MTA_HTTP_USER     = "iShaiNBOT";
const MTA_HTTP_PASS     = "3Bb07*6121595";
const MTA_RESOURCE_NAME = 'frp_function';
const MTA_FUNCTION_NAME = 'givePlayerVip';
const DEFAULT_VIP_DAYS  = 30;

// A função principal que a Vercel irá executar
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const notification = req.body;
        console.log(">> Webhook acionado. Payload:", notification);

        const paymentId = notification?.data?.id;
        if (notification?.type !== 'payment' || !paymentId) {
            console.log("Notificação ignorada.");
            return res.status(200).json({ success: true, message: 'Notification ignored' });
        }
        console.log(`Notificação de pagamento válida. ID: ${paymentId}`);

        // Consultar a API do Mercado Pago (esta parte continua igual)
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
        });
        if (!mpResponse.ok) {
            throw new Error(`Falha ao consultar MP. Status: ${mpResponse.status}`);
        }
        const paymentDetails = await mpResponse.json();
        console.log(`Detalhes obtidos. Status: ${paymentDetails.status}`);

        // Verificar se o pagamento está aprovado
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
        
        // =================================================================================
        // ||               >>>   CHAMANDO O MTA COM A BIBLIOTECA `mtasa`   <<<             ||
        // =================================================================================
        //
        // Esta é a mesma lógica exata que o seu bot do Discord utiliza.

        console.log("Conectando ao MTA com a biblioteca MTAClient...");
        const mta = new MTAClient(MTA_HTTP_HOST, MTA_HTTP_PORT, MTA_HTTP_USER, MTA_HTTP_PASS);
        
        console.log(`Executando resource '${MTA_RESOURCE_NAME}' -> função '${MTA_FUNCTION_NAME}'...`);
        const result = await mta.resources[MTA_RESOURCE_NAME][MTA_FUNCTION_NAME](
            player_id, 
            vip_tipo, 
            DEFAULT_VIP_DAYS
        );
        
        if (!result) {
            throw new Error('A chamada ao MTA não retornou um resultado.');
        }

        console.log(`SUCESSO! MTA respondeu: ${result}`);
        
        res.status(200).json({ success: true, message: 'VIP aplicado com sucesso!', mta_response: result });

    } catch (error) {
        console.error("ERRO CRÍTICO NO WEBHOOK:", error);
        // A biblioteca `mtasa` pode retornar erros detalhados aqui
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}