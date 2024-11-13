
// src/api/Profile_API.jsx

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Функция для получения данных о пользователе
export const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me?details=true&abbreviated=false`, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных о пользователе:', error);
    throw error;
  }
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (userId, formData) => {
  try {
    await axios.patch(`${API_URL}/users/${userId}/profile`, formData, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
    alert("Данные успешно обновлены!");
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    throw error;
  }
};
