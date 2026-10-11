import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import surveyRoutes from './routes/survey.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

/**
 * App Express puro — sem connect nem listen aqui.
 * - Long-running (dev/prod tradicional): server/src/start.js conecta e escuta.
 * - Serverless (Vercel): /api/index.js conecta (com cache) e delega.
 */
export function createApp() {
  const app = express();

  // Atrás de proxy (Vercel): confia no primeiro hop para o rate limit
  // identificar o IP real via X-Forwarded-For. Sem isso, o
  // express-rate-limit lança ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
  app.set('trust proxy', 1);

  app.use(helmet());
  // CORS restrito à origem do frontend — nunca "*" com credencial (RNF04).
  // credentials:true para o cookie de sessão admin (via proxy same-origin no dev).
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  // Teto folgado para os 2000 caracteres do §8.7; barra payload abusivo (RNF04)
  app.use(express.json({ limit: '50kb' }));
  app.use(cookieParser());

  app.use('/api', surveyRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export const app = createApp();

// Default export para a Vercel aceitar este módulo como function,
// caso o roteamento aponte para cá em vez de /api/index.js.
export default app;
