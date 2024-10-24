import React, { useMemo } from 'react';
import { Typography, Box, Container } from '@mui/material';
import Cookies from 'js-cookie';

const Profile = () => {
  // Получаем токен из куки
  const jwtToken = useMemo(() => Cookies.get('auth_token'), []);

  return (
    <Box>
      <Container component="main">
        {jwtToken ? (
          <Typography variant="body1" gutterBottom sx={{ width: '100%' }}>
            Ваш JWT токен: {jwtToken}
          </Typography>
        ) : (
          <Typography variant="body1" gutterBottom>
            Токен не найден. Пожалуйста, авторизуйтесь.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default React.memo(Profile);
