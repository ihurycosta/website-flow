// Local do arquivo: /api/webhook.js

import fetch from 'node-fetch';
import mtasa from 'mtasa';
const MTAClient = mtasa.default || mtasa.Client || mtasa.MTA;
import mysql from 'mysql2/promise';

// --- CONFIGURAÇÕES (Inseridas Diretamente no Código) ---
const MP_ACCESS_TOKEN = "APP_USR-7920134045367075-091618-c88c2e30f61af89cce8cb567be2a0f2a-1110300735";
const MTA_HTTP_HOST     = "151.242.227.196";
const MTA_HTTP_PORT     = "22053";
const MTA_HTTP_USER     = "iShaiNBOT";
const MTA_HTTP_PASS     = "3Bb07*6121595";
const MTA_RESOURCE_NAME = 'frp_function';
const MTA_FUNCTION_NAME = 'givePlayerVip';
const DEFAULT_VIP_DAYS  = 30;

// Credenciais do Banco de Dados (inseridas diretamente)
const DB_HOST           = "151.242.227.127"; // Insira o host do seu DB aqui
const DB_USER           = "u202_iFJybKgAa8"; // Insira o user do seu DB aqui
const DB_PASS           = "+2Wi=hFbohq@B.uDPqJe@3Os"; // Insira a senha do seu DB aqui
const DB_NAME           = "s202_whitelist"; // Insira o nome do seu DB aqui
const DB_PORT           = 3306; // Mude se a porta for diferente

// Configuração da conexão com o banco de dados
const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT
};

// A função principal que a Vercel irá executar
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const notification = req.body;
    console.log(">> Webhook acionado. Payload:", notification);
    const paymentId = notification?.data?.id;

    if (notification?.type !== 'payment' || !paymentId) {
        return res.status(200).json({ success: true, message: 'Notification ignored' });
    }

    let connection;
    try {
        // Consultar a API do Mercado Pago
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
        });
        if (!mpResponse.ok) throw new Error(`Falha ao consultar MP. Status: ${mpResponse.status}`);
        
        const paymentDetails = await mpResponse.json();
        console.log(`Detalhes obtidos. Status: ${paymentDetails.status}`);

        if (paymentDetails.status !== 'approved') {
            return res.status(200).json({ success: true, message: 'Payment not approved' });
        }
        
        const { player_id, vip_tipo } = paymentDetails.metadata;
        if (!player_id || !vip_tipo) {
            throw new Error("Metadata (player_id ou vip_tipo) em falta no pagamento.");
        }

        // Conectar ao banco de dados
        connection = await mysql.createConnection(dbConfig);
        console.log("Conectado ao banco de dados com sucesso.");

        // VERIFICAR SE O PAGAMENTO JÁ FOI PROCESSADO
        const [rows] = await connection.execute('SELECT payment_id FROM frp_processed_payments WHERE payment_id = ?', [paymentId]);

        if (rows.length > 0) {
            console.log(`Pagamento ID ${paymentId} já foi processado anteriormente. Ignorando.`);
            await connection.end();
            return res.status(200).json({ success: true, message: 'Payment already processed.' });
        }

        console.log(`Pagamento ${paymentId} é novo. Processando entrega do VIP...`);
        
        // Chamar o MTA para dar o VIP
        const mta = new MTAClient(MTA_HTTP_HOST, MTA_HTTP_PORT, MTA_HTTP_USER, MTA_HTTP_PASS);
        const result = await mta.resources[MTA_RESOURCE_NAME][MTA_FUNCTION_NAME](player_id, vip_tipo, DEFAULT_VIP_DAYS);
        
        if (!result) throw new Error('A chamada ao MTA não retornou um resultado.');
        console.log(`SUCESSO! MTA respondeu: ${result}`);

        // REGISTAR O PAGAMENTO COMO PROCESSADO NO BANCO DE DADOS
        await connection.execute(
            'INSERT INTO frp_processed_payments (payment_id, player_id, vip_type) VALUES (?, ?, ?)',
            [paymentId, player_id, vip_tipo]
        );
        console.log(`Pagamento ${paymentId} registado com sucesso na base de dados.`);
        
        await connection.end();
        res.status(200).json({ success: true, message: 'VIP aplicado com sucesso!', mta_response: result });

    } catch (error) {
        console.error("ERRO CRÍTICO NO WEBHOOK:", error);
        if (connection) await connection.end();
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}