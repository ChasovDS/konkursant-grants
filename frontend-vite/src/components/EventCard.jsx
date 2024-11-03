// EventCard.js

import React from 'react';
import { Card, CardContent, Typography, Chip, Box, CardMedia } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const AnimatedCard = styled(Card)(({ theme }) => ({
  maxWidth: 325,
  height: '100%',
  margin: 'auto',
  boxShadow: '0 30px 30px rgba(0, 0, 0, 0.1)', // более интенсивная тень
  borderRadius: '5px',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.005)',
    boxShadow: theme.shadows[10], // увеличенная тень при наведении
  },
}));


const EventCard = ({ event }) => {
  const { id_event, event_full_title, event_start_date, event_end_date, event_venue, event_tags, event_logo } = event;
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id_event) {
      navigate(`/dashboard/workspace/events/${id_event}`);
    } else {
      console.error("id_event отсутствует");
    }
  };

  return (
    <AnimatedCard onClick={handleCardClick}>
      <CardMedia
        image={event_logo}
        sx={{
          width: '100%',
          height: 0,
          paddingBottom: '56.25%',
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" gap={1}>
          {/* Даты мероприятия */}
          <Box display="flex" alignItems="center" color="textSecondary">
            <EventIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {new Date(event_start_date).toLocaleDateString()} - {new Date(event_end_date).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Название мероприятия */}
          <Typography variant="h6" component="div" gutterBottom>
            {event_full_title}
          </Typography>

          {/* Локация */}
          <Typography variant="body2" color="textSecondary">
            {event_venue}
          </Typography>

          {/* Статус и теги мероприятия */}
          <Box display="flex" gap={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
            {event_tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </Box>
      </CardContent>
    </AnimatedCard>
  );
};

export default EventCard;
