import React, { useState } from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Container,
  Grid,
  Box,
  FormControl,
  OutlinedInput,
  Chip,
  Divider,
} from '@mui/material';
import { Image, Person, Web, Tag, Description, Group, Business } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Стиль для редактора

const EventForm = () => {
  // Состояние для тегов
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState(''); // Состояние для описания

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    // Ограничение в 3 тега
    if (value.length <= 3) {
      setTags(typeof value === 'string' ? value.split(',') : value);
    }
  };

  return (
    <Container>
      {/* Навигация */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="#!" underline="hover">Мероприятия</Link>
        <Typography color="text.primary">Создание мероприятия</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>Создание мероприятия</Typography>

      <form>
        <Grid container spacing={3}>
          
          {/* Левый блок */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Информация</Typography>
            {/* Заглушка для изображения */}
            <Box 
              sx={{
                width: '100%',
                height: 150,
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Image fontSize="large" color="action" />
              <Typography variant="body2" color="text.secondary">Нет изображения</Typography>
            </Box>
            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              Загрузить изображение
            </Button>
            <Divider sx={{ my: 2 }} />
            <TextField fullWidth label="Организатор" variant="outlined" margin="normal" InputProps={{ startAdornment: <Person /> }} />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="participant-select-label">Кто может принимать участие</InputLabel>
              <Select labelId="participant-select-label" defaultValue="" label="Кто может принимать участие">
                <MenuItem value="all">Все желающие</MenuItem>
                <MenuItem value="members">Только отрядники</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Статус мероприятия</InputLabel>
              <Select labelId="status-select-label" defaultValue="" label="Статус мероприятия">
                <MenuItem value="active">Активно</MenuItem>
                <MenuItem value="inactive">Неактивно</MenuItem>
              </Select>
            </FormControl>

            {/* Поле для выбора тегов */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="tags-select-label">Теги</InputLabel>
              <Select
                labelId="tags-select-label"
                multiple
                value={tags}
                onChange={handleTagChange}
                input={<OutlinedInput id="select-multiple-chip" label="Теги" startAdornment={<Tag />} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {['Тег 1', 'Тег 2', 'Тег 3', 'Тег 4', 'Тег 5'].map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Правый блок */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Детали мероприятия</Typography>
            <TextField fullWidth label="Название мероприятия" variant="outlined" margin="normal" />

            {/* Выборы и селекты */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-select-label">Тип мероприятия</InputLabel>
                  <Select labelId="type-select-label" defaultValue="" label="Тип мероприятия">
                    <MenuItem value="1">Техническое</MenuItem>
                    <MenuItem value="2">Внешнее</MenuItem>
                    <MenuItem value="3">Организационное</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                <InputLabel id="format-select-label">Формат</InputLabel>
                  <Select labelId="format-select-label" defaultValue="" label="Формат">
                    <MenuItem value="1">Онлайн</MenuItem>
                    <MenuItem value="2">Офлайн</MenuItem>
                    <MenuItem value="3">Оба</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Тема" variant="outlined" margin="normal" />
              </Grid>
            </Grid>

            <TextField fullWidth label="Место проведения" variant="outlined" margin="normal" />

            {/* Даты и время проведения */}
            <Grid container spacing={2} sx={{ my: 1 }}>
                <Grid item xs={6} sm={3}>
                    <TextField 
                        fullWidth 
                        label="Дата начала" 
                        type="date" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField 
                        fullWidth 
                        label="Время начала" 
                        type="time" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField 
                        fullWidth 
                        label="Дата окончания" 
                        type="date" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField 
                        fullWidth 
                        label="Время окончания" 
                        type="time" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
            </Grid>

            <TextField fullWidth label="Крайний срок регистрации и подачи проектов" variant="outlined" margin="normal" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField fullWidth label="Руководители мероприятия" variant="outlined" margin="normal" InputProps={{ startAdornment: <Group /> }} />

                <TextField fullWidth label="Информационные ресурсы" variant="outlined" margin="normal" InputProps={{ startAdornment: <Web /> }} />
              </Grid>
            </Grid>
          </Grid>

          {/* Новый блок для описания и кнопок */}
          <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Описание мероприятия</Typography>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            style={{ marginBottom: '20px', height: '200px' }} 
            />
             </Grid>
            <Grid item xs={12}>
                {/* Кнопки */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" fullWidth>
                        Сохранить как черновик
                    </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Button variant="outlined" color="primary" fullWidth href="../../apps/events/event-detail.html">
                        Опубликовать мероприятие
                    </Button>
                    </Grid>
                </Grid>
                </Box>
            </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EventForm;
