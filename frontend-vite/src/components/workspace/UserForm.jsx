// UserForm.jsx

import React from 'react';
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
} from '@mui/material';

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
};

const externalServiceLabels = {
  yandex: 'Яндекс',
  email: 'E-mail',
  vk: 'ВКонтакте',
};

const UserForm = ({ userData, formData, isEditing, onChange, onSave, onCancel, onEdit }) => {
  return (
    <Box>
      <form>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Персональные данные
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(userData).map(([key, value]) => {
            if (!fieldLabels[key] && key !== 'squad_info') return null;

            if (key === 'gender') {
              return (
                <Grid item xs={12} sm={4} key={key}>
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="gender-select-label">Пол</InputLabel>
                    <Select
                      labelId="gender-select-label"
                      value={formData[key] || ''}
                      name={key}
                      size="small"
                      onChange={onChange}
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
                    size="small"
                    margin="dense"
                    value={formData.squad_info[subKey] || ''}
                    name={`squad_info.${subKey}`}
                    onChange={onChange}
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
                  margin="dense"
                  size="small"
                  value={formData[key] || ''}
                  name={key}
                  onChange={onChange}
                  disabled={!isEditing || key === 'role_name'}
                />
              </Grid>
            );
          })}
        </Grid>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Внешние сервисы
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(externalServiceLabels).map(([key, label]) => (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label={label}
                variant="outlined"
                fullWidth
                size="small"
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
              <Button variant="contained" color="primary" onClick={onSave} sx={{ mr: 2 }}>
                Сохранить данные
              </Button>
              <Button variant="outlined" color="secondary" onClick={onCancel}>
                Отмена
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={onEdit}>
              Редактировать данные
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;
