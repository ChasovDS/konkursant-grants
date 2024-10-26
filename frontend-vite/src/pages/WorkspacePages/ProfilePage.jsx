// Profile.jsx
import React from 'react'; // Импортируем React
import {
  Box,
  Container,
} from '@mui/material';
import UserData from '../../components/workspace/UserData'; // Убедитесь, что путь правильный

const Profile = () => {
  return (
    <Box>
      <Container component="main">
        {/* Здесь можно добавить заголовок или другую информацию */}
        <UserData />
      </Container>
    </Box>
  );
};

export default React.memo(Profile); // Экспортируем с использованием React.memo для оптимизации
