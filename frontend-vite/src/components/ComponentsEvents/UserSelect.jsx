// src/components/ComponentsEvents/UserSelect.jsx

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const UserSelect = ({ role, selectedUsers, setSelectedUsers }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async (role, search) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/role/${role}`, {
        params: { full_name: search },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(role, search);
  }, [role, search]);

  return (
    <Box margin="normal">
      <FormControl fullWidth margin="normal">
        <Autocomplete
          multiple
          id={`${role}-autocomplete`}
          options={users}
          getOptionLabel={(option) => option.user_full_name || 'Не указано'}
          value={selectedUsers}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue);
          }}
          filterSelectedOptions
          loading={loading}
          noOptionsText="Пользователи не найдены"
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${role === 'event_manager' ? 'Руководители' : 'Эксперты'} мероприятия`}
              placeholder="Выберите пользователей"
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.user_full_name || 'Не указано'}
                {...getTagProps({ index })}
              />
            ))
          }
        />
        {error && <Typography color="error">{error}</Typography>}
      </FormControl>
    </Box>
  );
};

export default UserSelect;
