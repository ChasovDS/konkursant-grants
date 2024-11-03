import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tagInput, setTagInput] = useState('');

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

  const handleAddTag = () => {
    if (tagInput && !event.tags.includes(tagInput)) {
      setEvent({ ...event, tags: [...event.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setEvent({ ...event, tags: event.tags.filter(tag => tag !== tagToDelete) });
  };


  const handleSubmit = async () => {
    const jwtToken = Cookies.get('auth_token');
    const formData = new FormData();
    formData.append('data', JSON.stringify(event));
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/events/${eventId}`, formData, {
        headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' },
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>Редактирование мероприятия</Typography>
        
        <TextField
          label="Название мероприятия"
          name="full_title"
          value={event.full_title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Описание мероприятия"
          name="description"
          value={event.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />

        <DateTimePicker
          label="Дата и время начала"
          value={dayjs(event.event_start_date)}
          onChange={(newValue) => setEvent({ ...event, event_start_date: newValue.toISOString() })}
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" required />}
        />

        <DateTimePicker
          label="Дата и время окончания"
          value={dayjs(event.event_end_date)}
          onChange={(newValue) => setEvent({ ...event, event_end_date: newValue.toISOString() })}
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" required />}
        />

        <TextField
          label="Место проведения"
          name="location"
          value={event.location}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Тип мероприятия</InputLabel>
          <Select
            name="event_type"
            value={event.event_type}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="Конференция">Конференция</MenuItem>
            <MenuItem value="Вебинар">Вебинар</MenuItem>
            <MenuItem value="Семинар">Семинар</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Ссылки на социальные сети и сайт"
          name="social_links"
          value={event.social_links || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />


        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {event.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
            />
          ))}
        </Box>

        <TextField
          label="Добавить тег"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          fullWidth
          margin="normal"
        />


        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
          Сохранить изменения
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mt: 3, ml: 2 }} onClick={() => navigate(-1)}>
          Отменить
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default EditEventPage;
