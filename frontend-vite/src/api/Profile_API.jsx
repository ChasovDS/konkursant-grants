// src/api/Profile_API.jsx

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

// Функция для получения данных о пользователе
export const fetchUserData = async () => {
  const jwtToken = Cookies.get('auth_token');
  try {
    const response = await axios.get(`${API_URL}/users/me?details=true&abbreviated=false`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных о пользователе:', error);
    throw error;
  }
};

// Функция для обновления профиля пользователя
export const updateUserProfile = async (userId, formData) => {
  const jwtToken = Cookies.get('auth_token');
  try {
    await axios.patch(`${API_URL}/users/${userId}/profile`, formData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    alert("Данные успешно обновлены!");
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
    throw error;
  }
};