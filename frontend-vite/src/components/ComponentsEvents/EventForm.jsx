// src/components/ComponentsEvents/EventForm.jsx
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
} from '@mui/material';
import { Image, Person, Tag, VerifiedUser } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EventForm = ({ title, onSaveDraft, onPublish }) => {
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [experts, setExperts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [eventData, setEventData] = useState({
    organizer: '',
    participantType: '',
    resources: '',
    title: '',
    type: '',
    format: '',
    status: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  // Данные руководителей и экспертов (пример для демонстрации)
  const availableManagers = [
    { user_id: '1', user_full_name: 'Руководитель 1' },
    { user_id: '2', user_full_name: 'Руководитель 2' },
    { user_id: '3', user_full_name: 'Руководитель 3' }
  ];

  const availableExperts = [
    { user_id: '1', user_full_name: 'Эксперт 1' },
    { user_id: '2', user_full_name: 'Эксперт 2' },
    { user_id: '3', user_full_name: 'Эксперт 3' }
  ]

    // Обработчик изменения для выбора руководителей
    const handleManagersChange = (event) => {
      const selectedManagers = event.target.value;
      setManagers(selectedManagers);
    };
  
    // Обработчик изменения для выбора экспертов
    const handleExpertsChange = (event) => {
      const selectedExperts = event.target.value;
      setExperts(selectedExperts);
    };


  const handleTagChange = (event) => {
    const { target: { value } } = event;
    if (value.length <= 3) {
      setTags(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      setLogo(file);
    } else {
      alert('Файл должен быть формата .jpg или .png и размером не более 5 МБ');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const prepareEventData = () => ({
    ...eventData,
    tags,
    description,
    managers,
    experts,
    logo,
  });

  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="#!" underline="hover">Мероприятия</Link>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>{title}</Typography>

      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Информация</Typography>
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
              {logo ? (
                <img src={URL.createObjectURL(logo)} alt="Логотип мероприятия" style={{ maxHeight: '100%', maxWidth: '100%' }} />
              ) : (
                <>
                  <Image fontSize="large" color="action" />
                  <Typography variant="body2" color="text.secondary">Нет изображения</Typography>
                </>
              )}
            </Box>
            <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
              Загрузить изображение
              <input type="file" hidden onChange={handleLogoUpload} />
            </Button>
            <TextField
              fullWidth
              label="Организация организатор"
              variant="outlined"
              margin="normal"
              name="organizer"
              value={eventData.organizer}
              onChange={handleInputChange}
              InputProps={{ startAdornment: <Person /> }}
              sx={{ mt: 5.6 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="participant-select-label">Кто может принимать участие</InputLabel>
              <Select
                labelId="participant-select-label"
                name="participantType"
                value={eventData.participantType}
                onChange={handleInputChange}
                label="Кто может принимать участие"
              >
                <MenuItem value="all">Все желающие</MenuItem>
                <MenuItem value="members">Только отрядники</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Информационные ресурсы"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              name="resources"
              value={eventData.resources}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Детали мероприятия</Typography>
            <TextField
              fullWidth
              label="Название мероприятия"
              variant="outlined"
              margin="normal"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-select-label">Тип мероприятия</InputLabel>
                  <Select
                    labelId="type-select-label"
                    name="type"
                    value={eventData.type}
                    onChange={handleInputChange}
                    label="Тип мероприятия"
                  >
                    <MenuItem value="conference">Конференция</MenuItem>
                    <MenuItem value="training">Тренинг</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="format-select-label">Формат</InputLabel>
                  <Select
                    labelId="format-select-label"
                    name="format"
                    value={eventData.format}
                    onChange={handleInputChange}
                    label="Формат"
                  >
                    <MenuItem value="online">Онлайн</MenuItem>
                    <MenuItem value="offline">Офлайн</MenuItem>
                    <MenuItem value="mixed">Смешанный</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-select-label">Статус мероприятия</InputLabel>
                  <Select
                    labelId="status-select-label"
                    name="status"
                    value={eventData.status}
                    onChange={handleInputChange}
                    label="Статус мероприятия"
                  >
                    <MenuItem value="scheduled">Запланировано</MenuItem>
                    <MenuItem value="held">Проводится</MenuItem>
                    <MenuItem value="completed">Завершено</MenuItem>
                    <MenuItem value="canceled">Отменено</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Место проведения"
              variant="outlined"
              margin="normal"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              inputProps={{ maxLength: 150 }}
            />
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Дата начала"
                  type="date"
                  name="startDate"
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Время начала"
                  type="time"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Дата окончания"
                  type="date"
                  name="endDate"
                  value={eventData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Время окончания"
                  type="time"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth margin="normal">
              <InputLabel id="managers-select-label">Руководители мероприятия</InputLabel>
              <Select
                labelId="managers-select-label"
                multiple
                value={managers}
                onChange={handleManagersChange}
                input={<OutlinedInput id="select-multiple-chip-managers" label="Руководители мероприятия" startAdornment={<VerifiedUser />} />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map((manager) => (
                      <Chip key={manager.user_id} label={manager.user_full_name} style={{ margin: 2 }} />
                    ))}
                  </div>
                )}
              >
                {availableManagers.map((manager) => (
                  <MenuItem key={manager.user_id} value={manager}>
                    {manager.user_full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="experts-select-label">Эксперты мероприятия</InputLabel>
              <Select
                labelId="experts-select-label"
                multiple
                value={experts}
                onChange={handleExpertsChange}
                input={<OutlinedInput id="select-multiple-chip-experts" label="Эксперты мероприятия" startAdornment={<VerifiedUser />} />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map((expert) => (
                      <Chip key={expert.user_id} label={expert.user_full_name} style={{ margin: 2 }} />
                    ))}
                  </div>
                )}
              >
                {availableExperts.map((expert) => (
                  <MenuItem key={expert.user_id} value={expert}>
                    {expert.user_full_name}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>

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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => onSaveDraft(prepareEventData())}
                  >
                    Сохранить как черновик
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => onPublish(prepareEventData())}
                  >
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
