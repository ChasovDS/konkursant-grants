// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserProfile = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    const jwtToken = Cookies.get('auth_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/${userId}/profile?details=true`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных о пользователе:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {userDetails ? (
        <div>
          <Typography variant="h4">{userDetails.full_name}</Typography>
          <Typography variant="body1">Роль: {userDetails.role_name}</Typography>
          {/* Добавьте другие поля, которые нужно отобразить */}
          <Button variant="outlined" onClick={() => window.history.back()}>
            Назад
          </Button>
        </div>
      ) : (
        <Typography variant="body1">Данные о пользователе не найдены.</Typography>
      )}
    </Box>
  );
};

export default UserProfile;
