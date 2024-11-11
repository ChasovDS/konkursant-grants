// vite.config.js

import { defineConfig } from 'vite'; // Импортируем функцию для определения конфигурации Vite
import react from '@vitejs/plugin-react'; // Импортируем плагин для поддержки React
import fs from 'fs'; // Импортируем модуль для работы с файловой системой
import path from 'path'; // Импортируем модуль для работы с путями файловой системы

// Определение пути к сертификатам
//const sslKey = fs.readFileSync(path.resolve(__dirname, 'localhost.key')); // Читаем закрытый ключ
//const sslCert = fs.readFileSync(path.resolve(__dirname, 'localhost.crt')); // Читаем сертификат

export default defineConfig({
  plugins: [react()], // Подключаем плагин React
  server: 
  {
 //   https: {
  //    key: sslKey, // Указываем закрытый ключ для HTTPS
   //   cert: sslCert, // Указываем сертификат для HTTPS
  //  },
    host: true, // Разрешает доступ к серверу по сети
    port: 3000, // Устанавливаем порт, на котором будет работать сервер
  },
});
