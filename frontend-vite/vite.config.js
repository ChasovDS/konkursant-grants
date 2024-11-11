// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Разрешает доступ по сети
    port: 3000, // Порт, на котором будет запущен сервер
  },
});
