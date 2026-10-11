import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Dev: /api vai para o Express local. Em produção, o mesmo domínio serve os dois.
      '/api': 'http://localhost:3001',
    },
  },
});
