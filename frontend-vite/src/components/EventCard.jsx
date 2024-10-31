import React from 'react';
import { Card, CardContent, Typography, Chip, Box, CardMedia } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Создаем анимированную карточку с эффектом при наведении
const AnimatedCard = styled(Card)(({ theme }) => ({
  margin: '10px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  width: '100%',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.005)',
    boxShadow: theme.shadows[6],
  },
}));

const EventCard = ({ event }) => {
  const { id_event, full_title, event_start_date, event_end_date, location, event_status, tags, logo } = event;
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id_event) {
      navigate(`/dashboard/workspace/events/${id_event}`);
    } else {
      console.error("id_event отсутствует");
    }
  };

  return (
    <AnimatedCard variant="outlined" onClick={handleCardClick}>
      {/* Изображение мероприятия */}
      <CardMedia
        component="img"
        height="140"
        image={logo}
        alt={full_title}
        sx={{ objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          {/* Заголовок мероприятия */}
          <Typography variant="h6" component="div" gutterBottom>
            {full_title}
          </Typography>

          {/* Локация */}
          <Typography color="textSecondary" sx={{ fontSize: 14, mb: 1 }}>
            {location}
          </Typography>

          {/* Даты мероприятия */}
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <EventIcon fontSize="small" />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              {new Date(event_start_date).toLocaleDateString()} - {new Date(event_end_date).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Статус и теги мероприятия */}
        <Box display="flex" gap={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          <Chip label={event_status} color="primary" size="small" />
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </CardContent>
    </AnimatedCard>
  );
};

export default EventCard;
