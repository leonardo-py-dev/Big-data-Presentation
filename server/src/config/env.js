import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// .env mora na raiz do monorepo, não em server/. Carregado aqui — antes do
// parse abaixo — porque imports são hoisted: se o config ficasse no app.js,
// este parse executaria antes do dotenv.config().
const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);
dotenv.config({ path: path.join(rootDir, '.env') });

/**
 * Variáveis de ambiente validadas na borda — falha rápido com mensagem clara.
 * MONGODB_URI é obrigatória; sem banco não há API.
 */
const envSchema = z.object({
  MONGODB_URI: z.string().min(1, {
    message: 'MONGODB_URI não definida. Copie .env.example para .env e preencha.',
  }),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(32, {
    message: 'JWT_SECRET precisa de no mínimo 32 caracteres aleatórios.',
  }),
  COOKIE_SECURE: z.coerce.boolean().default(false),
});

let parsed;
try {
  parsed = envSchema.parse(process.env);
} catch (err) {
  console.error('Configuração inválida:');
  for (const issue of err.issues ?? []) {
    console.error(`  - ${issue.path.join('.') || '(env)'}: ${issue.message}`);
  }
  // Serverless (Vercel): process.exit aqui mataria a instância da function.
  // Lança para o handler (/api/index.js) converter em 500 JSON.
  // Long-running (start.js): mantém o fail-fast com exit.
  if (process.env.VERCEL) {
    const boot = new Error('Configuração inválida.');
    boot.code = 'MISCONFIGURED';
    boot.status = 500;
    throw boot;
  }
  console.error('Copie .env.example para .env e preencha os valores.');
  process.exit(1);
}

export const env = parsed;
