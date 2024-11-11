import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; // Библиотека для работы с куки
import { handleIncomingMessage } from "../../utils/auth";

const Login = () => {
  const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    const userData = Cookies.get('userData');

    if (authToken && userData) {
      navigate("/workspace");
      return;
    }

    const scriptId = "yandex-sdk-suggest";
    const buttonId = "yandex-button";
    let isButtonInitialized = false;

    const loadYandexSdk = () => {
      if (document.getElementById(scriptId)) return;

      const script = document.createElement("script");
      script.src =
        "https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js";
      script.async = true;
      script.id = scriptId;
      document.head.appendChild(script);

      script.onload = async () => {
        const buttonContainer = document.getElementById(buttonId);
        if (buttonContainer && !buttonContainer.firstChild && !isButtonInitialized) {
          try {
            setLoading(true);
            const result = await window.YaAuthSuggest.init(
              {
                client_id: "fa6ff765db1e4b2a82e3c8f73079adda",
                response_type: "token",
                redirect_uri: `${VITE_FRONTEND_URL}:3000/redirect-page`,
              },
              VITE_FRONTEND_URL,
              {
                view: "button",
                parentId: buttonId,
                buttonView: "main",
                buttonTheme: "light",
                buttonSize: "m",
                buttonBorderRadius: "22",
              }
            );

            await result.handler();
          } catch (error) {
            console.error("Что-то пошло не так: ", error);
            setError("Ошибка аутентификации, попробуйте еще раз.");
          } finally {
            setLoading(false);
          }
          isButtonInitialized = true;
        }
      };

      script.onerror = () => {
        console.error("Ошибка загрузки Yandex SDK скрипта.");
        setError("Не удалось загрузить SDK. Попробуйте позже.");
      };
    };

    loadYandexSdk();
    window.addEventListener("message", handleIncomingMessage);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }

      const buttonContainer = document.getElementById(buttonId);
      if (buttonContainer) {
        buttonContainer.innerHTML = "";
      }

      window.removeEventListener("message", handleIncomingMessage);
    };
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 6, borderRadius: 3, marginTop: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Вход в приложение Конкурсант.Гранты
        </Typography>
        <Typography variant="body1" gutterBottom textAlign="center">
          Авторизуйтесь через Яндекс для продолжения
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          id="yandex-button"
          sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}
        >
          {loading ? <CircularProgress /> : null}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
