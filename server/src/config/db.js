import mongoose from 'mongoose';

let cached = null;

/**
 * Conecta ao MongoDB (Atlas) com cache.
 * Long-running: conecta uma vez. Serverless (Vercel): reaproveita a conexão
 * entre invocações mornas em vez de abrir uma nova a cada request (o pool do
 * Atlas estouraria). Em caso de falha, limpa o cache para tentar de novo.
 */
export function connectDb(uri) {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }
  if (!cached) {
    mongoose.set('strictQuery', true);
    cached = mongoose
      .connect(uri)
      .then(() => mongoose.connection)
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}
