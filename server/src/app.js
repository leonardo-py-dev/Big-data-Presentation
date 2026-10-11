import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import surveyRoutes from './routes/survey.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

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

connectDb(env.MONGODB_URI)
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`API ouvindo em http://localhost:${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Falha ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });
