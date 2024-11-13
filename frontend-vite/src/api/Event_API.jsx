
// src/api/Event_API.jsx

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Универсальная функция для получения данных о мероприятии
export const fetchEventData = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}`, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке данных мероприятия:", error.response?.data || error.message);
    return null;
  }
};

// Функция для создания мероприятия
export const submitEvent = async (eventDetails) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных события:', error.response?.data || error.message);
    throw error;
  }
};

// Функция для получения пользователей по роли и строке поиска
export const fetchUsers = async (role, search) => {
  try {
    const response = await axios.get(`${API_URL}/users/${role}`, {
      params: { full_name: search },
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    throw error;
  }
};

// Получение проектов пользователя
export const fetchUserProjects = async (eventSection, eventId) => {
  try {
    const response = await axios.get(`${API_URL}/projects/me`, {
      params: { event_section: eventSection, event_id: eventId },
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении проектов пользователя:', error);
    throw error;
  }
};

// Получение информации о пользователе
export const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me?details=false&abbreviated=true`, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении информации о пользователе:', error);
    throw error;
  }
};

// Функция для получения списка мероприятий
export const fetchEvents = async (page, limit, filters) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: { page, limit, ...filters },
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return {
      events: response.data.events,
      total: response.data.total || 0,
    };
  } catch (err) {
    console.error('Ошибка при получении списка мероприятий:', err);
    throw new Error('Не удалось загрузить мероприятия. Попробуйте позже.');
  }
};

// Обновление проекта мероприятия
export const updateEventProject = async (eventId, projectId) => {
  try {
    await axios.patch(`${API_URL}/events/${eventId}/project/${projectId}`, {}, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
  } catch (error) {
    console.error('Ошибка при обновлении проекта мероприятия:', error);
    throw error;
  }
};

// Удаление проекта мероприятия
export const deleteEventProject = async (eventId, projectId) => {
  try {
    await axios.delete(`${API_URL}/events/${eventId}/project/${projectId}`, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
  } catch (error) {
    console.error('Ошибка при удалении проекта мероприятия:', error);
    throw error;
  }
};
