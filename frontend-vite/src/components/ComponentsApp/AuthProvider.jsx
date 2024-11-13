import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const AuthContext = React.createContext();
const API_URL = import.meta.env.VITE_API_URL;
const URL_AUTH = `${API_URL}/users/me?details=false&abbreviated=true`;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState({ user: null });
  const [error, setError] = useState(null);

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEY
    ).toString();
  };

  const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const signIn = useCallback((userData) => {
    const encryptedData = encryptData(userData);
    setSession({ user: userData });
    Cookies.set("userData", encryptedData, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
  }, []);

  const signOut = useCallback(() => {
    Cookies.remove("userData");
    setSession({ user: null });
    navigate("/");
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
        const storedUserData = Cookies.get("userData");
        if (!storedUserData) {
          // Если userData отсутствует, перенаправляем на страницу входа
          setError("Данные пользователя отсутствуют. Пожалуйста, войдите в систему.");
          navigate("/sign-in");
          return;
        }

        const decryptedData = decryptData(storedUserData);
        setSession({ user: decryptedData });

        // Здесь вы можете отправить запрос на сервер, если вам нужно обновить данные пользователя
        const userResponse = await axios.get(URL_AUTH, {
          withCredentials: true, // Убедитесь, что куки отправляются
        });

        if (userResponse.data) {
          const {
            full_name,
            external_service_accounts,
            role_name,
            user_id,
            avatar,
          } = userResponse.data;
          const userData = {
            name: full_name || "",
            email: external_service_accounts?.yandex || "",
            role_name: role_name || "",
            user_id: user_id || "",
            image: avatar || "https://sun9-65.userapi.com/impg/XOlcGkaH6lKLPZwtknYlJ1Y_ziFYzSiFxnJdVg/K6URQUELjyM.jpg?size=480x480&quality=95&sign=e7f9c1a9af554ed5b3c7daa73817c9fe&type=album",
          };
          setSession({ user: userData });
        }
      } catch (error) {
        setError(`Ошибка при получении данных пользователя: ${error.message}`);
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, authentication, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
