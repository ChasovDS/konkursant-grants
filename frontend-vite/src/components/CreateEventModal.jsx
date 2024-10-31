// src/components/CreateEventModal.jsx
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

// Стиль для модального окна
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const CreateEventModal = ({ open, onClose, fetchEvents }) => {
  // Состояние для формы
  const [form, setForm] = useState({
    full_title: '',
    event_type: '',
    format: '',
    event_start_date: '',
    event_end_date: '',
  });

  // Состояние для ошибок валидации
  const [errors, setErrors] = useState({});

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    if (!form.full_title) newErrors.full_title = 'Полное название обязательно';
    if (!form.event_type) newErrors.event_type = 'Тип мероприятия обязателен';
    if (!form.format) newErrors.format = 'Формат обязателен';
    if (!form.event_start_date) newErrors.event_start_date = 'Дата начала обязательна';
    if (!form.event_end_date) newErrors.event_end_date = 'Дата окончания обязательна';
    if (form.event_start_date && form.event_end_date && form.event_start_date > form.event_end_date) {
      newErrors.event_end_date = 'Дата окончания не может быть раньше даты начала';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const jwtToken = Cookies.get('auth_token');
    try {
      await axios.post(`http://127.0.0.1:8000/api/v1/events`, form, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      fetchEvents(); // Обновление списка мероприятий
      onClose(); // Закрытие модального окна
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error.response ? error.response.data : error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Создание нового мероприятия
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="full_title"
              label="Полное название"
              value={form.full_title}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.full_title}
              helperText={errors.full_title}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="event_type"
              label="Тип мероприятия"
              value={form.event_type}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.event_type}
              helperText={errors.event_type}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="format"
              label="Формат"
              value={form.format}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.format}
              helperText={errors.format}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="event_start_date"
              label="Дата начала"
              type="date"
              value={form.event_start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
              error={!!errors.event_start_date}
              helperText={errors.event_start_date}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="event_end_date"
              label="Дата окончания"
              type="date"
              value={form.event_end_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
              error={!!errors.event_end_date}
              helperText={errors.event_end_date}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSubmit} color="primary" variant="contained" fullWidth>
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CreateEventModal;
