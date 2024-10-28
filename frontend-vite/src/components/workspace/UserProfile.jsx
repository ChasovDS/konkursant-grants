// UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button, Breadcrumbs } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserForm from './UserForm';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchUserData = async () => {
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/${userId}/profile?details=true`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUserData(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных о пользователе:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const jwtToken = Cookies.get('auth_token');
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/users/${formData.user_id}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      alert("Данные успешно обновлены!");
      setUserData(formData);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  px: 4 }}>
        {/* Отображение имени текущего пользователя большими буквами */}
        <Typography color="text.primary" variant="h5" sx={{ textTransform: 'uppercase' }}>
        Данные пользователя:  {userData ? `${userData.first_name} ${userData.last_name} ${userData.middle_name}` : 'недоступны'}
        </Typography>

        {/* Кнопка "Назад" */}
        <Button component={Link} to="/dashboard/workspace/admin-page/users" variant="outlined" color="primary">
          Назад
        </Button>
      </Box>

      <Box sx={{ p: 4 }}>
        {userData ? (
          <UserForm
            userData={userData}
            formData={formData}
            isEditing={isEditing}
            onChange={handleChange}
            onSave={handleSaveClick}
            onCancel={handleCancelClick}
            onEdit={handleEditClick}
          />
        ) : (
          <Typography variant="body1" gutterBottom>
            Данные о пользователе недоступны.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;
