// src/pages/WorkspacePages/AdminPage.jsx

import React, { useEffect, useState } from "react";
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import UserListAdmin from "../../components/workspace/AdminTabs/UserListAdmin.jsx";
import EventListAdmin from "../../components/workspace/AdminTabs/EventListAdmin.jsx";
import ProjectListAdmin from "../../components/workspace/AdminTabs/ProjectListAdmin.jsx";

import { checkRole } from "../../utils/role.js"; // Импортируем функцию проверки роли

// Конфигурация вкладок
const tabConfig = [
  { id: "users", label: "Пользователи", component: <UserListAdmin /> },
  { id: "events", label: "Мероприятия", component: <EventListAdmin /> },
  { id: "projects", label: "Проекты", component: <ProjectListAdmin /> },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Проверка роли при загрузке страницы
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const accessGranted = await checkRole('admin'); // Проверяем, является ли пользователь администратором

        if (!accessGranted) {
          navigate('/forbidden'); // Редирект на страницу доступа запрещен
        }
      } catch (error) {
        console.error('Ошибка при проверке доступа:', error);
        navigate('/forbidden'); // Редирект в случае ошибки
      }
    };

    checkAccess(); // Вызываем функцию проверки доступа
  }, [navigate]);

  // Установка активной вкладки на основе параметра section в URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get("section");
    const tabIndex = tabConfig.findIndex((tab) => tab.id === sectionId);
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
          <>
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
          </>
      </Container>
    </Box>
  );
};

export default React.memo(AdminPage);
