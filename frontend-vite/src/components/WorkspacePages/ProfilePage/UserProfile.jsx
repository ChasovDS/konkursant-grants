// src\components\WorkspacePages\ProfilePage\UserProfile.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { fetchUserData, updateUserProfile } from '../../../api/Profile_API';
import UserForm from './ComponentsProfilePage/UserForm';

const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
      setFormData(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Ошибка авторизации. Пожалуйста, войдите снова.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      await updateUserProfile(formData.user_id, formData);
    } catch (error) {
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
