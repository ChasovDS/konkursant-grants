// src/components/ComponentsApp/AuthProvider.jsx
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import axios from "axios";
import Cookies from "js-cookie";

// Создаем контекст
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Инициализируем navigate
  const [session, setSession] = useState({
    user: null, // Начальное состояние пользователя
  });

  // Функция для входа
  const signIn = useCallback((userData) => {
    setSession({ user: userData });
    // Сохраняем данные пользователя в куках
    Cookies.set('userData', JSON.stringify(userData), { expires: 7 }); // Куки действительны 7 дней
  }, []);

  // Функция для выхода
  const signOut = useCallback(() => {
    // Удаляем токены из cookies
    Cookies.remove("role_token");
    Cookies.remove("auth_token");
    // Обнуляем сессию
    setSession({ user: null });
    // Удаляем данные пользователя из куков
    Cookies.remove('userData');
    // Редирект на главную страницу
    navigate('/');
  }, [navigate]);

  const authentication = useMemo(
    () => ({
      signIn,
      signOut,
    }),
    [signIn, signOut]
  );

  // Получаем данные пользователя при первой загрузке ЕСЛИ userData НЕ СУЩЕСТВУЕТ 
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = Cookies.get('userData'); // Получаем данные пользователя из куков
      if (!storedUserData) { // Проверяем, если userData не существует
        const jwtToken = Cookies.get("auth_token"); // Получаем токен
        if (jwtToken) {
          try {
            const userResponse = await axios.get(
              `http://127.0.0.1:8000/api/v1/users/me?details=false&abbreviated=true`,
              {
                headers: { Authorization: `Bearer ${jwtToken}` },
              }
            );

            if (userResponse.data) {
              // Формируем объект пользователя из ответа API
              const userData = {
                name: `${userResponse.data.first_name || ""} ${userResponse.data.last_name || ""}`,
                email: userResponse.data.external_service_accounts?.yandex || "",
                role_name: userResponse.data.role_name || "",
                user_id: userResponse.data.user_id || "",
                image:
                  userResponse.data.avatar ||
                  "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2c2b2b3d-4d6e-4907-9311-420e881ae780/original=true,quality=90/36331830.jpeg", 
              };

              // Сохраняем данные пользователя в сессии и куках
              signIn(userData);
            }
          } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
          }
        }
      } else {
        // Если данные пользователя уже существуют, устанавливаем сессию
        setSession({ user: JSON.parse(storedUserData) });
      }
    };

    fetchUserData(); // Вызов функции для получения данных при загрузке
  }, [signIn]);

  return (
    <AuthContext.Provider value={{ session, authentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
