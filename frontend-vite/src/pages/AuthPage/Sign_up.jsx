// src/pages/AuthPage/Sign_up.jsx

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

const API_URL = import.meta.env.VITE_API_URL;

const Sign_up = () => {
  const [formData, setFormData] = useState({
    full_name: "",
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
      const response = await axios.post(`${API_URL}/register`, formData);
      console.log("Ответ от сервера:", response.data);
      // Успешная регистрация
      setSuccess(true);
      setError(null);
      setOpenSnackbar(true);
      // После успешной регистрации перенаправляем на страницу входа
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000); // Задержка перед перенаправлением
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      setError("Ошибка при регистрации. Пожалуйста, попробуйте еще раз.");
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
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="full_name"
            label="Полное имя"
            name="full_name"
            autoComplete="name"
            autoFocus
            value={formData.full_name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Адрес электронной почты"
            name="email"
            autoComplete="email"
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
            Зарегистрироваться
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2">
              Уже есть аккаунт?{' '}
              <Link href="/sign-in" variant="body2">
                Войти
              </Link>
            </Typography>
          </Box>
        </Box>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"}>
            {error || "Регистрация прошла успешно! Перенаправляем на страницу входа..."}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Sign_up;
