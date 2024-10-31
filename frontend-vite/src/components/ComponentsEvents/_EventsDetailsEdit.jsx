import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress  } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async () => {
    const jwtToken = Cookies.get('auth_token');
    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/events/${eventId}`, event, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      navigate(`/dashboard/workspace/events/${eventId}`);
    } catch (error) {
      console.error('Ошибка при обновлении мероприятия:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!event) {
    return <Typography variant="h6">Мероприятие не найдено</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Редактирование мероприятия</Typography>
      <TextField
        label="Полное название"
        name="full_title"
        value={event.full_title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Описание"
        name="description"
        value={event.description}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        label="Место проведения"
        name="location"
        value={event.location}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditEventPage;
