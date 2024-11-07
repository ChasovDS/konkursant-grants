// src/App.jsx
import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Link,
  Divider,
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';

const EventPage = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="240"
              image="https://project-myrosmol-backend-production.storage.yandexcloud.net/events/backgrounds/a2f8e3a468ea41c99a008bb3ab01781d.jpeg"
              alt="Event Background"
            />
            <CardContent>
              <Typography variant="h6">Организатор:</Typography>
              <Typography variant="body2">
                Ассоциация молодежных правительств
                <br />
                <Link href="mailto:amp.russia@yandex.ru">amp.russia@yandex.ru</Link>
              </Typography>
              <Divider style={{ margin: '10px 0' }} />
              <Typography variant="body2">
                Даты проведения: 25.11.2024 — 28.11.2024
              </Typography>
              <Typography variant="body2">
                Сайт: <Link href="https://molprav.ru/" target="_blank">https://molprav.ru/</Link>
              </Typography>
              <Typography variant="body2">
                Шаблон для создания проекта: 
                <Link href="/projects/create/386d79e1-1fa9-4e9d-9357-f8777644bcde:1f25a02d-74fa-4e4c-a6fd-035c83b32336"> 2024: Шаблон проекта Росмолодёжь.Гранты для физических лиц</Link>
              </Typography>
              <Typography variant="body2">
                Социальные сети мероприятия: 
                <Link href="https://vk.com/molprav" target="_blank">VK</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Конкурс Росмолодёжь.Гранты в рамках XVI Всероссийского Съезда молодежных правительств
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Тип: Всероссийский
                <br />
                Формат: Слет
              </Typography>
              <Typography variant="h6">О мероприятии</Typography>
              <Typography variant="body2" paragraph>
                Ассоциация молодежных правительств – это некоммерческая общественная организация, которая объединяет и координирует деятельность молодежных правительств России...
              </Typography>
              <Typography variant="h6">Смены</Typography>
              <Typography variant="body2">
                XVI Всероссийский Съезд молодежных правительств
                <br />
                Начало и окончание грантового конкурса: 10.09.2024 — 10.10.2024
                <br />
                Окончание регистрации на грантовый конкурс (по московскому времени): 10.10.2024 13:00
              </Typography>
              <Button variant="contained" color="primary">
                Подать заявку на грант
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventPage;
