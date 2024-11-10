// Profile.jsx
import React from 'react'; // Импортируем React
import {
  Box,
  Container,
} from '@mui/material';
import UserProfile from '../../components/WorkspacePages/ProfilePage/UserProfile'; 

const Profile = () => {
  return (
    <Box>
      <Container component="main">
        <UserProfile />
      </Container>
    </Box>
  );
};

export default React.memo(Profile); // Экспортируем с использованием React.memo для оптимизации
