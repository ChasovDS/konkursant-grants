// UserData.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

// Объект для соответствия ключей и их русских названиям
const fieldLabels = {
  last_name: 'Фамилия',
  first_name: 'Имя',
  middle_name: 'Отчество',
  phone: 'Телефон',
  city: 'Город',
  gender: 'Пол',
  birthday: 'Дата рождения',
  role_name: 'Роль',
  direction: 'Направление',
  squad: 'Отряд',
  user_id: null,
  profile_photo_upl: null,
};

const externalServiceLabels = {
  yandex: 'Яндекс',
  email: 'E-mail',
  vk: 'ВКонтакте',
};

const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/users/me?details=true&abbreviated=false', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUserData(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных о пользователе:', error);
      if (error.response && error.response.status === 401) {
        alert("Ошибка авторизации. Пожалуйста, войдите снова.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const jwtToken = Cookies.get('auth_token');
      await axios.put(`http://127.0.0.1:8000/api/v1/users/${formData.user_id}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      alert("Данные успешно обновлены!");
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      alert("Ошибка при обновлении данных. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('squad_info.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        squad_info: {
          ...prevData.squad_info,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {userData ? (
        <form>
          <Grid container spacing={2}>
            {Object.entries(userData).map(([key, value]) => {
              if (!fieldLabels[key] && key !== 'squad_info') return null;

              if (key === 'gender') {
                return (
                  <Grid item xs={12} sm={4} key={key}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel id="gender-select-label">Пол</InputLabel>
                      <Select
                        labelId="gender-select-label"
                        value={formData[key]}
                        name={key}
                        onChange={handleChange}
                        disabled={!isEditing}
                        label="Пол"
                      >
                        <MenuItem value="male">Мужской</MenuItem>
                        <MenuItem value="female">Женский</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                );
              }

              if (key === 'squad_info') {
                return Object.entries(value).map(([subKey, subValue]) => (
                  <Grid item xs={12} sm={2} key={subKey}>
                    <TextField
                      label={fieldLabels[subKey]}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={formData.squad_info[subKey] || ''}
                      name={`squad_info.${subKey}`}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                ));
              }

              return (
                <Grid item xs={12} sm={4} key={key}>
                  <TextField
                    label={fieldLabels[key]}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData[key] || ''}
                    name={key}
                    onChange={handleChange}
                    disabled={!isEditing || key === 'role_name'}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Внешние сервисы
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(externalServiceLabels).map(([key, label]) => (
              <Grid item xs={12} sm={4} key={key}>
                <TextField
                  label={label}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.external_service_accounts[key] || ''}
                  name={key}
                  disabled={true}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {isEditing ? (
              <>
                <Button variant="contained" color="primary" onClick={handleSaveClick} sx={{ mr: 2 }}>
                  Сохранить данные
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
                  Отмена
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={handleEditClick}>
                Редактировать данные
              </Button>
            )}
          </Box>
        </form>
      ) : (
        <Typography variant="body1" gutterBottom>
          Данные о пользователе недоступны.
        </Typography>
      )}
    </Box>
  );
};

export default UserData;
