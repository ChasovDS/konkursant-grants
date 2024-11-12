import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Определение пути к сертификатам
// const sslKey = fs.readFileSync(path.resolve(__dirname, 'localhost.key'));
// const sslCert = fs.readFileSync(path.resolve(__dirname, 'localhost.crt'));

export default defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: sslKey,
    //   cert: sslCert,
    // },
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist', // Укажите выходную директорию
    sourcemap: true, // Опционально: создание sourcemap для отладки
  },
});
