// src/layouts/BaseLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

const BaseLayout = () => {
  return (
    <Container>
      {/* Здесь можно добавить общий хедер или другие элементы */}
      <Outlet /> {/* Здесь рендерятся дочерние маршруты */}
    </Container>
  );
};

export default BaseLayout;
