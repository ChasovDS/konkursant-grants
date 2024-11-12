// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Подключаем плагин React
  server: {
    host: true, // Разрешает доступ к серверу по сети
    port: 3000, // Устанавливаем порт, на котором будет работать сервер
  },
});
