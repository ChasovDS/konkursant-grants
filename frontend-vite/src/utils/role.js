// src/utils/role.js

import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками
import { SHA256 } from 'crypto-js'; // Импортируем библиотеку для хеширования

const roles = {
    admin: SHA256('admin').toString(),
    moderator: SHA256('moderator').toString(),
    event_manager: SHA256('event_manager').toString(),
    expert: SHA256('expert').toString(),
    user: SHA256('user').toString(),
};


// Функция для получения роли по хешу
export function getRoleByHash() {
    const roleToken = Cookies.get("role_token");
    if (!roleToken) {
      return null;
    }
    for (const [role, hash] of Object.entries(roles)) {
      if (hash === roleToken) {
        return role;
      }
    }
    return null;
  }


// Функция для проверки роли
export const checkRole = (requiredRole) => {
    const userRole = getRoleByHash(); // Получаем роль пользователя
    return userRole === requiredRole; // Возвращаем true или false
};



export default getRoleByHash;
