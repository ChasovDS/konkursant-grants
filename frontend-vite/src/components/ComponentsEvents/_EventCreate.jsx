// src/pages/EventDetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Button, Chip, Avatar, Divider, Paper, Stack, MenuItem, Select, Tooltip, Breadcrumbs, Link
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, LocationOn, Event, Info, Tag } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState('');
  const [projects, setProjects] = useState(['Project A', 'Project B', 'Project C']); // Placeholder projects for the dropdown

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

  const handleProjectSubmit = () => {
    console.log("Проект подан:", project);
  };

  return (
    <Box sx={{ margin: 'auto'}}>
            {/* Хлебные крошки для навигации */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="inherit" href="/dashboard/workspace/events/">Мероприятия</Link>
        <Typography color="text.primary">{event.full_title}</Typography>
      </Breadcrumbs>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        {/* Header with Logo, Title, and Action Buttons */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar alt="Event Logo" src={event.logo} sx={{ width: 80, height: 80, margin: 'auto', mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{event.full_title}</Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              color="primary"
              onClick={() => navigate(`/dashboard/workspace/events/edit/${eventId}`)}
            >
              Редактировать
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => console.log("Удалить мероприятие")}
            >
              Удалить
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Event Information */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Tooltip title="Тип мероприятия">
            <Box display="flex" alignItems="center" color="text.secondary" gap={1}>
              <Event fontSize="small" />
              <Typography variant="body2">Тип: <b>{event.event_type}</b></Typography>
            </Box>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Формат мероприятия">
            <Box display="flex" alignItems="center" color="text.secondary" gap={1}>
              <Info fontSize="small" />
              <Typography variant="body2">Формат: <b>{event.format}</b></Typography>
            </Box>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Локация мероприятия">
            <Box display="flex" alignItems="center" color="text.secondary" gap={1}>
              <LocationOn fontSize="small" />
              <Typography variant="body2">Локация: <b>{event.location}</b></Typography>
            </Box>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Event Description */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>О мероприятии</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}>{event.description}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Organizers and Experts */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Организаторы и Эксперты</Typography>
          <Typography variant="body2" color="text.secondary">Участники: {event.participants.length}</Typography>
          <Typography variant="body2" color="text.secondary">Зрители: {event.spectators.length}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tags */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Теги</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {event.tags.map((tag, index) => (
              <Chip key={index} label={tag} icon={<Tag />} variant="outlined" size="small" />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Submit Project */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Подать проект на мероприятие</Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              displayEmpty
              size='small'
              sx={{ width: 250 }}
            >
              <MenuItem value="" disabled>Выберите проект</MenuItem>
              {projects.map((proj, index) => (
                <MenuItem key={index} value={proj}>{proj}</MenuItem>
              ))}
            </Select>
            <Button
              variant="outlined"
              color="primary"
              disabled={!project}
              onClick={handleProjectSubmit}
              sx={{
                padding: "8px 16px",         // Padding for comfortable button sizey
              }}
            >
              Подать заявку на мероприятие
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default EventDetailsPage;
