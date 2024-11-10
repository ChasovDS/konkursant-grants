// src/pages/Home.jsx
import React from "react";
import { Container, Typography, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import "./Home.css"; // Импортируем CSS файл для стилей

const Home = () => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleAgree = () => {
    setOpen(false);
  };

  const handleDisagree = () => {
    window.location.href = 'https://www.yandex.ru';
  };

  return (
    <>
      <Container className="home-container">
        <Typography variant="h1">
          <span className="main-title">Конкурсант.</span>
          <span className="main-title-or">Гранты </span>
        </Typography>
        <div className="button-container">
        <a className="button" href="/login">
    Авторизация
</a>
<a className="button" href="/instructions">
    Инструкция
</a>

        </div>
      </Container>
      {/* Уведомление о куки */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Центрируем Snackbar
      >
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{
            width: "100%",
            maxWidth: "500px", // Ограничиваем ширину для более аккуратного вида
            margin: "0 auto", // Центрируем Alert
            display: "flex",
            justifyContent: "space-between", // Размещаем кнопки с равным пространством
            alignItems: "center",
          }}
          action={
            <>
              <Button color="inherit" size="small" onClick={handleAgree}>
                ОК
              </Button>
              <Button color="inherit" size="small" onClick={handleDisagree}>
                Не ОК
              </Button>
            </>
          }
        >
          Этот сайт использует куки для улучшения пользовательского опыта.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
