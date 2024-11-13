
// src/api/Admin_API.jsx
import axios from "axios";

// Константы для URL-адресов API
const API_URL = import.meta.env.VITE_API_URL;

// Обработка ошибок
const handleError = (error, message) => {
  console.error(message, error.response ? error.response.data : error.message);
  throw error;
};

// Универсальная функция для выполнения GET запросов
const getRequest = async (url, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}${url}`, {
      params,
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response;
  } catch (error) {
    handleError(error, "Ошибка при выполнении GET запроса:");
  }
};

// Универсальная функция для выполнения DELETE запросов
const deleteRequest = async (url) => {
  try {
    await axios.delete(`${API_URL}${url}`, {
      withCredentials: true, // Добавляем флаг withCredentials
    });
  } catch (error) {
    handleError(error, "Ошибка при выполнении DELETE запроса:");
  }
};

// Универсальная функция для выполнения PATCH запросов
const patchRequest = async (url, data) => {
  try {
    const response = await axios.patch(`${API_URL}${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Добавляем флаг withCredentials
    });
    return response.data;
  } catch (error) {
    handleError(error, "Ошибка при выполнении PATCH запроса:");
  }
};

// Функция для получения списка пользователей
export const fetchUsers = async (page, limit, fullNameFilter, emailFilter, roleFilter) => {
  const response = await getRequest("/users/profile", {
    details: false,
    abbreviated: true,
    page: page + 1,
    limit,
    full_name: fullNameFilter,
    yandex: emailFilter,
    role_name: roleFilter,
  });
  return {
    users: response.data,
    totalCount: parseInt(response.headers["x-total-count"], 10) || 0,
  };
};

// Функция для получения списка проектов
export const fetchProjects = async (page, limit, authorSearchTerm, titleSearchTerm) => {
  const response = await getRequest("/projects-all", {
    page,
    limit,
    author: authorSearchTerm.trim(),
    title: titleSearchTerm.trim(),
  });
  return {
    projects: response.data,
    totalCount: parseInt(response.headers["x-total-count"], 10) || 0,
  };
};

// Функция для удаления проекта
export const deleteProject = async (projectId) => {
  await deleteRequest(`/projects/${projectId}`);
};

// Функция для получения списка мероприятий
export const fetchEvents = async (page, limit, searchTitle, filterStatus) => {
  const response = await getRequest("/events", {
    page,
    limit,
    full_title: searchTitle,
    event_status: filterStatus === "Любой" ? undefined : filterStatus,
  });
  return {
    events: response.data.events,
    totalCount: parseInt(response.headers["X-Total-Count"], 10) || 0,
  };
};

// Функция для удаления мероприятия
export const deleteEvent = async (eventId) => {
  await deleteRequest(`/events/${eventId}`);
};

// Функция для обновления роли пользователя
export const updateUserRole = async (userId, role) => {
  return await patchRequest(`/user/role/${userId}`, { role });
};

// Функция для получения данных о пользователе
export const fetchUserData = async (userId) => {
  const response = await getRequest(`/users/${userId}/profile`, { details: true });
  return response.data;
};

// Функция для обновления данных пользователя
export const updateUserData = async (userId, formData) => {
  await patchRequest(`/users/${userId}/profile`, formData);
};