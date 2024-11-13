// src/pages/AuthPage/Sign_in.jsx

import React, { useState, useEffect } from "react";
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
import Cookies from 'js-cookie'; // Импортируем библиотеку js-cookie

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

  // Проверяем наличие куки userData при монтировании компонента
  useEffect(() => {
    if (Cookies.get("userData")) {
      // Если куки существует, перенаправляем на /workspace
      navigate("/workspace");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация email на несколько доменов
    const emailPattern = /.+@(ya\.ru|yandex\.com|yandex\.ru|yandex\.by|yandex\.kz)$/;
    if (!emailPattern.test(formData.email)) {
      setError("Пожалуйста, используйте почту с доменами: @ya.ru, @yandex.com, @yandex.ru, @yandex.by, @yandex.kz");
      setSuccess(false);
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, formData, { withCredentials: true });
      console.log("Ответ от сервера:", response.data);
      // Успешный вход
      setSuccess(true);
      setError(null);
      setOpenSnackbar(true);
      // После успешного входа перенаправляем на '/workspace'
      setTimeout(() => {
        navigate("/workspace");
      }, 2000); // Задержка перед перенаправлением
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
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2">
              Нет аккаунта?{' '}
              <Link href="/sign-up" variant="body2">
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </Box>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"}>
            {error || "Вход выполнен успешно! Перенаправляем на страницу рабочего пространства..."}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Sign_in;
