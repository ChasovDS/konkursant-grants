// src/components/ComponentsApp/AuthProvider.jsx
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js"; // Импортируем библиотеку для шифрования

// Создаем контекст
const AuthContext = React.createContext();

// Константа для API URL
const API_URL = import.meta.env.VITE_API_URL;

const URL_AUTH = `${API_URL}/users/me?details=false&abbreviated=true`;

// Ключ для шифрования (в реальном приложении храните его в переменных окружения!)
const ENCRYPTION_KEY = "your-encryption-key";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState({ user: null });
  const [error, setError] = useState(null);

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  };

  const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const signIn = useCallback((userData) => {
    const encryptedData = encryptData(userData);
    setSession({ user: userData });
    Cookies.set('userData', encryptedData, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });
  }, []);

  const signOut = useCallback(() => {
    Cookies.remove("auth_token");
    Cookies.remove('userData');
    setSession({ user: null });
    navigate('/');
  }, [navigate]);

  const authentication = useMemo(
    () => ({
      signIn,
      signOut,
    }),
    [signIn, signOut]
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = Cookies.get('userData');
        if (!storedUserData) {
          const jwtToken = Cookies.get("auth_token");
          if (jwtToken) {
            const userResponse = await axios.get(URL_AUTH, {
              headers: { Authorization: `Bearer ${jwtToken}` },
            });

            if (userResponse.data) {
              const userData = {
                name: `${userResponse.data.first_name || ""} ${userResponse.data.last_name || ""}`,
                email: userResponse.data.external_service_accounts?.yandex || "",
                role_name: userResponse.data.role_name || "",
                user_id: userResponse.data.user_id || "",
                image: userResponse.data.avatar || "../../../../public/7.png",
              };
              signIn(userData);
            }
          }
        } else {
          const decryptedData = decryptData(storedUserData);
          setSession({ user: decryptedData });
        }
      } catch (error) {
        setError("Ошибка при получении данных пользователя.");
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchUserData();
  }, [signIn]);

  return (
    <AuthContext.Provider value={{ session, authentication, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
