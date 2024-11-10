import React, { useCallback, useContext  } from 'react';
import { TextField, Box, Button, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom'; 
import debounce from 'lodash.debounce';

import { AuthContext } from '../../../ComponentsApp/AuthProvider';





  // Константы статусов мероприятия
  const EventStatus = {
    COMPLETED: "Проведено",
    IN_PROGRESS: "Проводится",
    SCHEDULED: "Запланировано",
    CANCELED: "Отменено",
  };

  // Константы типов мероприятий (на русском языке)
  const EventType = {

    CONFERENCE: "Конференция",
    TRAINING: "Тренинг",
    GRANT_EVENT: "Грантовое мероприятие",
  };

  // Константы форматов мероприятия (на русском языке)
  const EventFormat = {
    ONLINE: "Онлайн",
    OFFLINE: "Офлайн",
    MIXED: "Смешанный",
  };


  // Константы релевантности мероприятия
  const EventRelevance = {
    READY_EVENT: "Чистовик",
    BLACKWELL: "Черновик",
  };

  // Опции статусов для селектора
  const statusOptions = Object.entries(EventStatus).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  // Опции типов мероприятий
  const eventTypeOptions = Object.entries(EventType).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  // Опции форматов мероприятий
  const eventFormatOptions = Object.entries(EventFormat).map(([key, value]) => ({
    value: key,
    label: value,
  }));


  // Опции релевантности для селектора
  const relevanceOptions = Object.entries(EventRelevance).map(([key, value]) => ({
    value: key,
    label: value,
  }));



const EventFilter = ({ onFilter }) => {
  const allowedRoles = ['admin', 'moderator', 'event_manager'];
  const { session } = useContext(AuthContext);
  const [filters, setFilters] = React.useState({
    full_title: '',
    event_type: '',
    format: '',
    event_status: '',
    event_publish: '',
  });

  const navigate = useNavigate(); // Получаем функцию навигации

  // Обработчик нажатия на кнопку
  const onAddEvent = () => {
    navigate('/workspace/events/create'); // Переход на нужную страницу
  };

  // Обработчик изменения полей фильтра с обновлением состояния
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    debouncedFilterChange({ ...filters, [name]: value });
  };

  // Debounce для onFilter, вызываем его с задержкой
  const debouncedFilterChange = useCallback(
    debounce((updatedFilters) => {
      onFilter(updatedFilters);
    }, 300), // 300ms задержка
    [onFilter]
  );


  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          name="full_title"
          label="Поиск по названию"
          size="small"
          variant="outlined"
          value={filters.full_title}
          onChange={handleChange}
          sx={{ minWidth: 150 }}
          InputProps={{
            endAdornment: (
              <Button>
                <SearchIcon />
              </Button>
            ),
          }}
        />
        <TextField
          name="event_type"
          label="Тип"
          size="small"
          select
          value={filters.event_type}
          onChange={handleChange}
          sx={{ minWidth: 150, display: 'none' }} // Скрытие элемента через стиль
        >
          {eventTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        </TextField>
        <TextField
          name="format"
          label="Формат"
          size="small"
          select
          value={filters.format}
          onChange={handleChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value=""><em>Любой</em></MenuItem>
            {eventFormatOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          name="event_status"
          label="Статус"
          size="small"
          select
          value={filters.event_status}
          onChange={handleChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value=""><em>Любой</em></MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
              name="event_publish"
              label="Публикация"
              size="small"
              select
              value={filters.event_publish}
              onChange={handleChange}
              sx={{ minWidth: 200, display: 'none' }}
          >
           <MenuItem value=""><em>Любые</em></MenuItem>
              {relevanceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                      
                  </MenuItem>
              ))}
          </TextField>
      </Box>
      <>
      {allowedRoles.includes(session.user.role_name) && ( // Проверяем роль пользователя
        <Button
          color="primary"
          onClick={onAddEvent}
          startIcon={<AddIcon />}
        >
          ДОБАВИТЬ МЕРОПРИЯТИЕ
        </Button>
      )}
    </>
    </Box>
  );
};

export default EventFilter;
