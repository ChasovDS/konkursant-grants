// src/pages/EventDetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Button, Chip, Avatar, Divider, Grid, Paper, Stack, MenuItem, Select
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const jwtToken = Cookies.get('auth_token');

      if (!jwtToken) {
        console.error("Токен авторизации отсутствует");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/events/${eventId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setEvent(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятия:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
  }

  if (!event) {
    return <Typography variant="h6" align="center" sx={{ mt: 5 }}>Мероприятие не найдено</Typography>;
  }

  return (
    <Box sx={{ padding: 4, margin: 'auto' }}>
      
      {/* Блок 1: Лого и Название мероприятия */}
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt="Event Logo" src={event.logo} sx={{ width: 120, height: 120 }} />
          <Box>
            <Typography variant="h4" gutterBottom>{event.full_title}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => navigate(`/dashboard/workspace/events/edit/${eventId}`)}
            >
              Редактировать
            </Button>
          </Box>
        </Stack>
      </Paper>
      
      {/* Блок 2: Информация о мероприятии */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="body1" color="textSecondary">Тип:</Typography>
            <Typography variant="body1">{event.event_type}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" color="textSecondary">Формат:</Typography>
            <Typography variant="body1">{event.format}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" color="textSecondary">Локация:</Typography>
            <Typography variant="body1">{event.location}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Divider sx={{ my: 2 }} />
      
      {/* Блок 3: Описание мероприятия */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>О мероприятии</Typography>
        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>{event.description}</Typography>
      </Paper>

      {/* Блок 4: Информация об организаторах и экспертах */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Организаторы и Эксперты</Typography>
        <Box>
          <Typography variant="body2" color="textSecondary">Количество участников: {event.participants.length}</Typography>
          <Typography variant="body2" color="textSecondary">Количество зрителей: {event.spectators.length}</Typography>
        </Box>
      </Paper>

      {/* Блок 5: Теги */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Теги</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {event.tags.map((tag, index) => (
            <Chip key={index} label={tag} />
          ))}
        </Box>
      </Paper>
      <Divider sx={{ my: 2 }} />

      {/* Блок 6: Подать проект */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Подать проект на мероприятие</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            displayEmpty
            sx={{ width: 200 }}
          >
            <MenuItem value="" disabled>Выберите проект</MenuItem>
            {projects.map((proj, index) => (
              <MenuItem key={index} value={proj}>{proj}</MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            disabled={!project}
            onClick={() => console.log("Проект подан")}
          >
            Подать проект
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EventDetailsPage;
