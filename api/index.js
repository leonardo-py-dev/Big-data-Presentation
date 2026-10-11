import { app } from '../server/src/app.js';
import { connectDb } from '../server/src/config/db.js';

/**
 * Entrada serverless (Vercel): /api/* chega aqui via rewrite do vercel.json.
 * Sem app.listen — a plataforma invoca o handler por request.
 */
export default async function handler(req, res) {
  await connectDb(process.env.MONGODB_URI);
  return app(req, res);
}
