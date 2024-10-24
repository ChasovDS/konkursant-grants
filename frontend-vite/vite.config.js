import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Позволяет доступ с других устройств
    port: 3000, // Укажите желаемый порт
  },
});
