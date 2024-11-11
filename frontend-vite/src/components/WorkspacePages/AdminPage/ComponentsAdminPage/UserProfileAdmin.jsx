// src/components/WorkspacePages/AdminPage/ComponentsAdminPage/UserProfileAdmin.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { fetchUserData, updateUserData } from '../../../../api/Admin_API'; // Обновленный импорт
import UserForm from '../../ProfilePage/ComponentsProfilePage/UserForm';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData(userId);
        setUserData(data);
        setFormData(data);
      } catch (error) {
        console.error('Ошибка при получении данных о пользователе:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      await updateUserData(formData.user_id, formData);
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
    const keys = name.split('.');
    setFormData((prevData) => {
      let newData = { ...prevData };
      let currentLevel = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!currentLevel[keys[i]]) {
          currentLevel[keys[i]] = {};
        }
        currentLevel = currentLevel[keys[i]];
      }
      currentLevel[keys[keys.length - 1]] = value;
      return newData;
    });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4 }}>
        <Typography color="text.primary" variant="h5" sx={{ textTransform: 'uppercase' }}>
          Данные пользователя:  {userData ? `${userData.first_name} ${userData.last_name} ${userData.middle_name}` : 'недоступны'}
        </Typography>
        <Button component={Link} to="/workspace/admin-page/users" variant="outlined" color="primary">
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
