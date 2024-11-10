// src/components/ProjectFilter.jsx

import React, { useEffect } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import { styled } from '@mui/material/styles';
import { TextField, Box, IconButton, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const ProjectFilter = ({ onFilter, onAddProject }) => {
  const [filters, setFilters] = React.useState({
    name: '',
    author: '',
    template: ''
  });

  const CustomButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    marginBottom: '8px',
    justifyContent: 'flex-start',
    border: 'none',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  // Обработчик изменения поля ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Используем useEffect для фильтрации при изменении фильтров
  React.useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          name="name"
          label="Поиск по названию"
          size="small"
          variant="outlined"
          value={filters.name}
          onChange={handleChange}
          sx={{ mr: 1 }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <TextField
          name="author"
          label="Поиск по автору"
          size="small"
          variant="outlined"
          value={filters.author}
          onChange={handleChange}
          sx={{ mr: 1 }}
        />
        <FormControl size="small" variant="outlined" sx={{ mr: 1, minWidth: 170 }}>
        <InputLabel id="template-label">Шаблон проекта</InputLabel>
        <Select
            labelId="template-label"
            name="template"
            value={filters.template}
            onChange={handleChange}
            label="Шаблон проекта"
        >
            <MenuItem value="">
            <em>Любой</em>
            </MenuItem>
            <MenuItem value="ФИЗ_ЛИЦО">ФИЗ_ЛИЦО</MenuItem>
            <MenuItem value="ВУЗ">ВУЗ</MenuItem>
        </Select>
        </FormControl>

      </Box>
      <CustomButton
        color="primary"
        onClick={onAddProject}
        startIcon={<AddIcon />}
      >
        ДОБАВИТЬ ПРОЕКТ
      </CustomButton>
    </Box>
  );
};

export default ProjectFilter;
