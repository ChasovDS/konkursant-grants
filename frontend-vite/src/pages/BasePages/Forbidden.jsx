// src/pages/Forbidden.jsx

import React from 'react';
import { Typography, Button, Container, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <Container 
      component="main" 
      maxWidth="lg" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
          <img src={'https://img.freepik.com/free-vector/403-error-forbidden-with-police-concept-illustration_114360-1923.jpg?t=st=1731113066~exp=1731116666~hmac=8707522a008b5628ed11924f641f27f933d8093cb5e6fd22f16a19ccd49389a5&w=996'} alt="403 Illustration" style={{ width: '100%', maxWidth: '400px' }} />
        </Grid>
        <Grid item xs={12} md={6} style={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom style={{ color: '#d32f2f', fontWeight: 'bold' }}>
            Доступ запрещен!
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: '#555' }}>
            Извините, у вас нет прав для доступа к этой странице.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            component={Link} 
            to="/workspace/" 
            style={{ marginTop: '1rem' }}
          >
            Вернуться на главную
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
