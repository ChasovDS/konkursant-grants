// src/pages/WorkspacePages/AdminPage.jsx

import React from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';


const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем текущую вкладку на основе пути
  const currentPath = location.pathname;
  const currentTab = currentPath.split('/').pop(); // Получаем последний сегмент пути

  const handleChange = (event, newValue) => {
    navigate(`/dashboard/workspace/admin-page/${newValue}`); // Обновляем URL при смене вкладки
  };

  return (
    <Box>
      <Container component="main">
        <Tabs
          value={currentTab} // Используем строковое значение для текущей вкладки
          onChange={handleChange}
          aria-label="Административные вкладки"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Пользователи" value="users" />
          <Tab label="Мероприятия" value="events" />
          <Tab label="Проекты" value="projects" />
          <Tab label="Проверки" value="reviews" />
          <Tab label="Менеджер ролей" value="role-manager" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <Outlet /> {/* Здесь будут рендериться вложенные маршруты */}
        </Box>
      </Container>
    </Box>
  );
};

export default React.memo(AdminPage);
