// src/pages/WorkspacePages/AdminPage.jsx

import React, { useEffect, useState } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import UserListAdmin from '../../components/workspace/AdminTabs/UserListAdmin.jsx';
import EventListAdmin from '../../components/workspace/AdminTabs/EventListAdmin.jsx';
import ProjectListAdmin from '../../components/workspace/AdminTabs/ProjectListAdmin.jsx'; 
import ReviewListAdmin from '../../components/workspace/AdminTabs/ReviewListAdmin.jsx'; 
import RoleManagerAdmin from '../../components/workspace/AdminTabs/RoleManagerAdmin.jsx'; 

// Конфигурация вкладок
const tabConfig = [
  { id: 'users', label: 'Пользователи', component: <UserListAdmin /> },
  { id: 'events', label: 'Мероприятия', component: <EventListAdmin /> },
  { id: 'projects', label: 'Проекты', component: <ProjectListAdmin /> },
  { id: 'reviews', label: 'Проверки', component: <ReviewListAdmin /> },
  { id: 'role-manager', label: 'Менеджер ролей', component: <RoleManagerAdmin /> },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Установка активной вкладки на основе параметра section в URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section');
    const tabIndex = tabConfig.findIndex(tab => tab.id === sectionId);
    setActiveTab(tabIndex >= 0 ? tabIndex : 0); // Устанавливаем первую вкладку по умолчанию
  }, [location.search]);

  // Обработчик смены вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`${location.pathname}?section=${tabConfig[newValue].id}`);
  };

  return (
    <Box>
      <Container component="main">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Административные вкладки"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabConfig.map((tab, index) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabConfig[activeTab].component}
        </Box>
      </Container>
    </Box>
  );
};

export default React.memo(AdminPage);
