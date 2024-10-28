// UserData.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserForm from './UserForm';

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
    <Box>
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
  );
};

export default UserData;
