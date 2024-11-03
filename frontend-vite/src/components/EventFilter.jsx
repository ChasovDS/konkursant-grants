import React, { useCallback } from 'react';
import { TextField, Box, Button, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import debounce from 'lodash.debounce';

const EventStatus = {
  COMPLETED: "Проведено",
  IN_PROGRESS: "Проводится",
  SCHEDULED: "Запланировано"
};

const EventFilter = ({ onFilter, onAddEvent }) => {
  const [filters, setFilters] = React.useState({
    full_title: '',
    event_type: '',
    format: '',
    event_status: '',
  });

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

  const statusOptions = [
    { value: '', label: 'Все' },
    { value: EventStatus.COMPLETED, label: EventStatus.COMPLETED },
    { value: EventStatus.IN_PROGRESS, label: EventStatus.IN_PROGRESS },
    { value: EventStatus.SCHEDULED, label: EventStatus.SCHEDULED },
  ];

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
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="тип1">Тип 1</MenuItem>
          <MenuItem value="тип2">Тип 2</MenuItem>
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
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="онлайн">Онлайн</MenuItem>
          <MenuItem value="оффлайн">Оффлайн</MenuItem>
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
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button
        color="primary"
        onClick={onAddEvent}
        startIcon={<AddIcon />}
      >
        ДОБАВИТЬ МЕРОПРИЯТИЕ
      </Button>
    </Box>
  );
};

export default EventFilter;
