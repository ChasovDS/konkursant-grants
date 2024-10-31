// src/pages/WorkspacePages/EventDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const jwtToken = Cookies.get('auth_token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/events/${eventId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setEvent(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятия:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4">{event.full_title}</Typography>
      {/* Добавить дополнительные поля с информацией о мероприятии */}
    </Box>
  );
};

export default EventDetailsPage;
