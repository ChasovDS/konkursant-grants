import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  Avatar,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';

const UserProfileEdit = ({
  userData,
  formData,
  isEditing,
  onChange,
  onSave,
  onCancel,
  onEdit,
}) => {
  const theme = useTheme();

  const roleTranslations = {
    admin: "Администратор",
    moderator: "Модератор",
    event_manager: "Руководитель мероприятий",
    expert: "Эксперт",
    user: "Участник мероприятий",
  };

  // Используем useEffect для обновления full_name при изменении first_name, last_name или middle_name
  useEffect(() => {
    const { first_name, last_name, middle_name } = formData;
    // Объединяем имена в одно поле full_name
    formData.full_name = `${last_name || ''} ${first_name || ''} ${ middle_name || ''}`.trim();
  }, [formData.first_name, formData.last_name, formData.middle_name]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        {/* Карточка с аватаром и информацией о пользователе */}
        <Card sx={{ backgroundColor: theme.palette.background.paper }}>
          <CardHeader
            avatar={
              <Avatar
                alt="User Avatar"
                src="https://lh3.googleusercontent.com/a/ACg8ocKz0rfKIZUR-mWFGz2q51MzC32lMLlApy8iW44d1hGC3X86Dbw=s360-c-no"
                sx={{ width: 56, height: 56 }}
              />
            }
            title={formData.full_name || 'ФИО'}
            subheader={roleTranslations[formData.role_name] || 'Роль'} 
          />
        </Card>

        {/* Карточка с полем для отряда и настройками приватности */}
        <Card sx={{ mt: 3, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Сообщество</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Отряд | Сообщество"
                  placeholder="Введите название отряда"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.squad_info?.squad || ''}
                  name="squad_info.squad"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            {/* Настройки приватности */}
            <CardContent sx={{ mb: -4 }}>
              <FormControl component="fieldset" disabled>
                <FormLabel component="legend">Кто может просматривать Ваши проекты?</FormLabel>
                <RadioGroup>
                  <FormControlLabel value="onlyMe" control={<Radio />} label="Только я" />
                  <FormControlLabel value="expertsOnly" control={<Radio />} label="Только эксперты" />
                  <FormControlLabel value="everyone" control={<Radio />} label="Все" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Личная информация</Typography>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  placeholder="Введите вашу фамилию"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.last_name || ''}
                  name="last_name"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Имя"
                  placeholder="Введите ваше имя"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.first_name || ''}
                  name="first_name"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Отчество"
                  placeholder="Введите ваше отчество"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.middle_name || ''}
                  name="middle_name"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Телефон"
                  placeholder="Введите ваш телефон"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.phone || ''}
                  name="phone"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Дата рождения"
                  type="date" 
                  placeholder="Введите вашу дату рождения"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthIcon />
                      </InputAdornment>
                    ),
                  }}
                  value={formData.birthday || ''}
                  name="birthday"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>

              <Grid item xs={12} sm={4} sx={{ my: -1 }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="gender-select-label">Пол</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    value={formData.gender || ''}
                    name="gender"
                    onChange={onChange}
                    disabled={!isEditing}
                    label="Пол"
                  >
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ my: 1 }}>
                <TextField
                  fullWidth
                  label="Информация"
                  placeholder="Введите информацию о себе"
                  multiline
                  rows={4}
                  value={formData.user_information || ''}
                  name="user_information"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ВКонтакте"
                  placeholder="Ссылка на ВКонтакте"
                  value={formData.external_service_accounts?.vk || ''}
                  name="external_service_accounts.vk"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Телеграм"
                  placeholder="Ссылка на Телеграм"
                  value={formData.external_service_accounts?.telegram || ''}
                  name="external_service_accounts.telegram"
                  onChange={onChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Яндекс"
                  placeholder="Email Яндекс"
                  value={formData.external_service_accounts?.yandex || ''}
                  name="external_service_accounts.yandex"
                  onChange={onChange}
                  disabled
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <CardActions sx={{ mt: 2, justifyContent: 'flex-end' }}>
          {isEditing ? (
            <>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={onSave}>
                Сохранить информацию
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={onCancel}>
                Отменить изменения
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={onEdit}>
              Редактировать данные
            </Button>
          )}
        </CardActions>
      </Grid>
    </Grid>
  );
};

export default UserProfileEdit;
