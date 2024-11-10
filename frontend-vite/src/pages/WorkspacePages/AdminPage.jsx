// src/pages/WorkspacePages/AdminPage.jsx

import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from '../../components/ComponentsApp/AuthProvider';

import UserListAdmin from "../../components/WorkspacePages/AdminPage/UserListAdmin.jsx";
import EventListAdmin from "../../components/WorkspacePages/AdminPage/EventListAdmin.jsx";
import ProjectListAdmin from "../../components/WorkspacePages/AdminPage/ProjectListAdmin.jsx";


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
  const { session } = useContext(AuthContext);

  // Проверка авторизации
  if (!session || !session.user) {
    return <div>Пользователь не авторизован</div>;
  }

  // Проверка роли при загрузке страницы
  useEffect(() => {
    const checkAccess = () => {
      if (!session || !session.user) {
        navigate('/forbidden');
        return;
      }

      const accessGranted = session.user.role_name === 'admin';
      if (!accessGranted) {
        navigate('/forbidden');
      }
    };

    checkAccess();
  }, [navigate, session]);

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
