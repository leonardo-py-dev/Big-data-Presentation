/**
 * Cria (ou atualiza a senha) do admin inicial a partir do .env.
 * Uso: npm run seed --workspace=@pesquisa/server
 * Exige ADMIN_EMAIL e ADMIN_PASSWORD no ambiente. A senha nunca é logada.
 */
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// npm --workspace executa com cwd em server/ — caminho explícito até a raiz.
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
dotenv.config({ path: path.join(rootDir, '.env') });

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { AdminUser } from '../models/AdminUser.js';

const useTest = process.argv.includes('--test');
const uri = useTest ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!uri || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Defina MONGODB_URI, ADMIN_EMAIL e ADMIN_PASSWORD no .env antes do seed.');
  process.exit(1);
}
if (useTest && !uri.includes('_test')) {
  console.error('Trava: --test exige URI de banco de teste. Abortando.');
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 12) {
  console.error('ADMIN_PASSWORD precisa de no mínimo 12 caracteres.');
  process.exit(1);
}

await mongoose.connect(uri);
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await AdminUser.updateOne(
  { email: ADMIN_EMAIL.toLowerCase().trim() },
  { $set: { passwordHash } },
  { upsert: true },
);
console.log(`Admin pronto: ${ADMIN_EMAIL.toLowerCase().trim()}`);
await mongoose.disconnect();
process.exit(0);
