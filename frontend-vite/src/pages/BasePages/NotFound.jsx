// src/pages/NotFound.jsx

//import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';

export default function NotFound() {
  return (
    <Container style={{ textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h3" gutterBottom>
        404 - Страница не найдена
      </Typography>
      <Typography variant="body1" gutterBottom>
        Извините, страница, которую вы ищете, не найдена.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/workspace">
        Перейти на главную
      </Button>
    </Container>
  );
}
