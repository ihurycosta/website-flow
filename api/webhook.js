// api/webhook.js
import mysql from "mysql2/promise";
import mtasa from "mtasa";

// ====== ENV (configure na Vercel > Project > Settings > Environment Variables) ======
const MP_ACCESS_TOKEN  = process.env.MP_ACCESS_TOKEN;     // revogue o antigo e coloque o novo aqui
const MTA_HTTP_HOST    = process.env.MTA_HTTP_HOST;
const MTA_HTTP_PORT    = process.env.MTA_HTTP_PORT;
const MTA_HTTP_USER    = process.env.MTA_HTTP_USER;
const MTA_HTTP_PASS    = process.env.MTA_HTTP_PASS;
const MTA_RESOURCE     = process.env.MTA_RESOURCE_NAME || "frp_function";
const MTA_FUNCTION     = process.env.MTA_FUNCTION_NAME  || "givePlayerVip";
const DEFAULT_VIP_DAYS = Number(process.env.DEFAULT_VIP_DAYS || 30);

// DB
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = Number(process.env.DB_PORT || 3306);

// ====== Reuso de Pool em Serverless ======
let pool = globalThis._frpPool;
if (!pool) {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
  globalThis._frpPool = pool;
}

// ====== MTA Client (instancia leve a cada chamada) ======
const MTAClient = mtasa.default || mtasa.Client || mtasa.MTA;

// ====== Handler ======
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    if (!MP_ACCESS_TOKEN) {
      return res.status(500).json({ success: false, message: "MP_ACCESS_TOKEN ausente" });
    }

    // Mercado Pago envia JSON; em Vercel Functions, req.body normalmente já é objeto
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const paymentId = body?.data?.id;
    const type = body?.type;

    // Ignore eventos não relacionados a pagamento
    if (type !== "payment" || !paymentId) {
      return res.status(200).json({ success: true, message: "Notification ignored" });
    }

    // (Opcional, recomendado) Verificação de assinatura:
    // const signature = req.headers["x-signature"];
    // const requestId = req.headers["x-request-id"];
    // TODO: validar HMAC conforme doc do MP (se habilitado no painel)

    // 1) Consultar detalhes do pagamento
    const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
    });
    if (!mpResp.ok) {
      throw new Error(`Falha ao consultar MP. HTTP ${mpResp.status}`);
    }
    const payment = await mpResp.json();

    if (payment.status !== "approved") {
      // Não aprovado ainda — OK retornar 200 para não gerar retry infinito
      return res.status(200).json({ success: true, message: `Payment ${payment.status}` });
    }

    const player_id = payment?.metadata?.player_id;
    const vip_tipo  = payment?.metadata?.vip_tipo;

    if (!player_id || !vip_tipo) {
      throw new Error("Metadata ausente (player_id/vip_tipo).");
    }

    // 2) Idempotência: checar se já processou
    const conn = await pool.getConnection();
    try {
      const [exists] = await conn.execute(
        "SELECT 1 FROM frp_processed_payments WHERE payment_id = ? LIMIT 1",
        [paymentId]
      );
      if (exists.length > 0) {
        conn.release();
        return res.status(200).json({ success: true, message: "Payment already processed" });
      }

      // 3) Chamar MTA
      const mta = new MTAClient(MTA_HTTP_HOST, MTA_HTTP_PORT, MTA_HTTP_USER, MTA_HTTP_PASS);
      const result = await mta.resources[MTA_RESOURCE][MTA_FUNCTION](player_id, vip_tipo, DEFAULT_VIP_DAYS);

      if (!result) {
        throw new Error("MTA retornou resultado vazio/nulo.");
      }

      // 4) Registrar processamento
      await conn.execute(
        "INSERT INTO frp_processed_payments (payment_id, player_id, vip_type) VALUES (?, ?, ?)",
        [paymentId, String(player_id), String(vip_tipo)]
      );
      conn.release();

      // 5) Done
      return res.status(200).json({
        success: true,
        message: "VIP aplicado",
        mta_response: result
      });
    } catch (err) {
      // Sempre liberar conexão em erro dentro do bloco do DB
      try { pool.releaseConnection?.(); } catch {}
      throw err;
    }

  } catch (error) {
    console.error("Webhook ERROR:", error?.message || error);
    // 200 ou 500? — Se quiser que o MP tente novamente, use 500.
    return res.status(500).json({ success: false, message: error?.message || "Internal Error" });
  }
}
