// src/api/Project_API.jsx

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Вспомогательная функция для обработки запросов
const handleRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await axios({ method, url, data, withCredentials: true, ...config });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при выполнении запроса: ${method.toUpperCase()} ${url}`, error);
    throw error;
  }
};

// Функция для удаления проекта
export const deleteProject = async (projectId) => {
  await handleRequest('delete', `${API_URL}/projects/${projectId}`);
};

// Функция для создания пустого проекта
export const createEmptyProject = async (templateType) => {
  await handleRequest('post', `${API_URL}/projects/create-empty?project_template=${encodeURIComponent(templateType)}`);
};

// Функция для создания проекта из файла
export const createProjectFromFile = async (file, templateType) => {
  const formData = new FormData();
  formData.append('input_file', file);

  await handleRequest('post', `${API_URL}/projects/create-from-file?project_template=${encodeURIComponent(templateType)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Функция для получения данных о проекте
export const fetchProjectDetails = async (projectId) => {
  return await handleRequest('get', `${API_URL}/projects/${projectId}`);
};

// Функция для обновления дополнительных файлов проекта
export const updateAdditionalFiles = async (projectId, files) => {
  await handleRequest('patch', `${API_URL}/projects/${projectId}/additional-files`, {
    additional_files: files,
  });
};

// Функция для получения отзыва
export const getReview = async (projectId) => {
  const data = await handleRequest('get', `${API_URL}/reviews/expert/project/${projectId}`);
  return data[0]; // Предполагаем, что API возвращает массив
};

// Функция для создания или обновления отзыва
export const saveReview = async (reviewId, projectId, ratings, comment) => {
  const endpoint = reviewId ? `${API_URL}/reviews/${reviewId}` : `${API_URL}/reviews`;
  const method = reviewId ? 'put' : 'post';
  const payload = {
    criteria_evaluation: ratings,
    expert_comment: comment,
  };

  if (!reviewId) {
    payload.project_id = projectId;
  }

  await handleRequest(method, endpoint, payload);
};

// Функция для удаления отзыва
export const deleteReview = async (reviewId) => {
  await handleRequest('delete', `${API_URL}/reviews/${reviewId}`);
};

// Функция для получения отзывов проекта
export const getProjectReviews = async (projectId) => {
  return await handleRequest('get', `${API_URL}/reviews/project/${projectId}`);
};

// Функция для получения списка проектов
export const fetchProjects = async (page, limit, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/projects/me`, {
      withCredentials: true,
      params: { skip: (page - 1) * limit, limit, ...filters },
    });
    return {
      projects: response.data,
      total: response.total || 0,
    };
  } catch (error) {
    console.error('Ошибка при получении списка проектов:', error);
    throw error;
  }
};
