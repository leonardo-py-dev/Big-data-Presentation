import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { app } from './app.js';

/** Boot long-running (dev local, VPS, Render/Railway). Na Vercel, ver /api/index.js. */
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
