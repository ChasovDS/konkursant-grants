import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { Snackbar, Alert } from "@mui/material";

const AuthContext = React.createContext();
const API_URL = import.meta.env.VITE_API_URL;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState({ user: null });
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
    navigate("/sign-in");
  }, [navigate]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await axios.post(`${API_URL}/refresh`, { refresh_token: refreshToken }, { withCredentials: true });
      } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
        signOut();
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get(`${API_URL}/users/me?details=false&abbreviated=true`, {
        withCredentials: true,
      });

      if (userResponse.data) {
        const userData = {
          name: userResponse.data.full_name || "",
          email: userResponse.data.external_service_accounts?.yandex || "",
          role_name: userResponse.data.role_name || "",
          user_id: userResponse.data.user_id || "",
          image: userResponse.data.avatar || "https://sun9-65.userapi.com/impg/XOlcGkaH6lKLPZwtknYlJ1Y_ziFYzSiFxnJdVg/K6URQUELjyM.jpg?size=480x480&quality=95&sign=e7f9c1a9af554ed5b3c7daa73817c9fe&type=album",
        };
        signIn(userData);
      } else {
        throw new Error("Данные пользователя не получены");
      }
    } catch (error) {
      setError(`Ошибка при получении данных пользователя: ${error.message}`);
      console.error("Ошибка при получении данных пользователя:", error);
      setSnackbarOpen(true); // Открываем Snackbar при ошибке
      signOut();
    }
  };

  useEffect(() => {
    const storedUserData = Cookies.get("userData");

    if (storedUserData) {
      const decryptedData = decryptData(storedUserData);
      setSession({ user: decryptedData });
    } else {
      fetchUserData();
    }
  }, [signIn]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError(null); // Сбрасываем ошибку при закрытии Snackbar
  };

  const authentication = useMemo(() => ({
    signIn,
    signOut,
  }), [signIn, signOut]);

  return (
    <AuthContext.Provider value={{ session, authentication, error }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
