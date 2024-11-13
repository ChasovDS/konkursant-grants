// src/pages/AuthPage/Sign_in.jsx

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const Sign_in = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Для успешного уведомления
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Валидация email на несколько доменов
    const emailPattern =
      /.+@(ya\.ru|yandex\.com|yandex\.ru|yandex\.by|yandex\.kz)$/;
    if (!emailPattern.test(formData.email)) {
      setError(
        "Пожалуйста, используйте почту с доменами: @ya.ru, @yandex.com, @yandex.ru, @yandex.by, @yandex.kz"
      );
      setSuccess(false);
      setOpenSnackbar(true);
      return; // Завершаем выполнение функции при ошибке
    }


    try {
      // Отправка POST-запроса на сервер для входа
      const response = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true, // Позволяет отправлять куки с запросом
      });

      //////////////////////////////////////
        /// DEV ONLY
    //    const authToken = response.headers["auth_token"]; // Получаем токен из заголовка ответа
//
  //      if (authToken) {
         // Cookies.set("auth_token", authToken, {
           // expires: 7, // Кука будет действительна 7 дней
           // secure: true, // Кука будет передаваться только по HTTPS
          //  sameSite: "None", // Ограничивает отправку куки с запросами из других сайтов
         //   path: "/", // Кука доступна на всем сайте
       //   });
      //  }
        /// DEV ONLY
      //////////////////////////////////////

      console.log("Ответ от сервера:", response.data);

      const token = Cookies.get("auth_token"); // Получаем токен из куки

      if (token) {
        // Успешный вход
        setSuccess(true);
        setError(null);
        setOpenSnackbar(true);

        // После успешного входа перенаправляем на '/workspace'
        setTimeout(() => {
          navigate("/workspace");
        }, 2000); // Задержка перед перенаправлением

        return true; // Токен найден
      } else {
        // Если токен не найден, выводим сообщение
        setError("Токен не найден. Cистемная ошибка.");
        setSuccess(false);
        setOpenSnackbar(true);
        return false; // Токен не найден
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setError("Ошибка при входе. Проверьте свои учетные данные.");
      setSuccess(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Адрес электронной почты"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body2">
              Нет аккаунта?{" "}
              <Link href="/sign-up" variant="body2">
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
          >
            {error ||
              "Вход выполнен успешно! Перенаправляем на страницу рабочего пространства..."}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Sign_in;
