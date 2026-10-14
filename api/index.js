/**
 * Entrada serverless (Vercel): /api/* chega aqui.
 * Sem app.listen — a plataforma invoca o handler por request.
 *
 * Imports dinâmicos dentro do handler: se a config (env) estiver
 * inválida, respondemos 500 no formato estável em vez de derrubar
 * a instância com process.exit na importação.
 */
export default async function handler(req, res) {
  try {
    if (!process.env.MONGODB_URI) {
      res.status(500).json({
        error: {
          code: 'MISCONFIGURED',
          message: 'Ocorreu um erro interno. Tente novamente em instantes.',
        },
      });
      return;
    }
    const { app } = await import('../server/src/app.js');
    const { connectDb } = await import('../server/src/config/db.js');
    await connectDb(process.env.MONGODB_URI);
    return app(req, res);
  } catch (err) {
    // Nunca vazar detalhe técnico nem payload no response (anonimato, RNF05)
    console.error({ code: err.code ?? 'SERVERLESS_BOOT', message: err.message });
    if (!res.headersSent) {
      res.status(err.status ?? 500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Ocorreu um erro interno. Tente novamente em instantes.',
        },
      });
    }
  }
}
