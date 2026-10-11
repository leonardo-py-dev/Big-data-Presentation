// Boot temporário da API contra o banco de TESTE, em outra porta.
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(rootDir, ".env") });
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
process.env.PORT = "3002";
if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.includes("_test")) {
  console.error("Trava: URI de teste inválida. Abortando.");
  process.exit(1);
}
await import("./src/app.js");
