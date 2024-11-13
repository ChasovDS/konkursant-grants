import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Функция для получения проектов мероприятия
export const fetchProjects = async (eventId, page, rowsPerPage, authorSearchTerm, titleSearchTerm, ratingFilter) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/${eventId}/projects`,
      {
        withCredentials: true,
        params: {
          page,
          limit: rowsPerPage,
          author: authorSearchTerm.trim(),
          title: titleSearchTerm.trim(),
          rating: ratingFilter,
        },
      }
    );
    return {
      data: response.data,
      totalCount: parseInt(response.headers["x-total-count"], 10),
    };
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    throw new Error("Не удалось загрузить проекты. Пожалуйста, попробуйте позже.");
  }
};

// Функция для получения информации о текущем пользователе
export const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/me?details=false&abbreviated=true`,
      {
        withCredentials: true,
      }
    );
    return response.data.user_id;
  } catch (error) {
    console.error("Ошибка при получении информации о пользователе:", error);
    throw error;
  }
};
