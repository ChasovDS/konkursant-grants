// src/App.jsx

import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ProjectIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HelpIcon from '@mui/icons-material/Help';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';



const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Главная',
    segment: 'dashboard/workspace',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dashboard/workspace/admin-page',
    title: 'Администрирование',
    icon: <AdminPanelSettingsIcon />,
    children: [
      {
        segment: 'users',
        title: 'Пользователи',
        icon: <PeopleIcon />, // Иконка для пользователей
      },
      {
        segment: 'events',
        title: 'Мероприятия',
        icon: <EventIcon />, // Иконка для мероприятий
      },
      {
        segment: 'projects',
        title: 'Проекты',
        icon: <WorkIcon />, // Иконка для проектов
      },
      {
        segment: 'reviews',
        title: 'Проверки',
        icon: <RateReviewIcon />, // Иконка для проверок
      },
      {
        segment: 'role-manager',
        title: 'Менеджер ролей',
        icon: <SecurityIcon />, // Иконка для менеджера ролей
      },
    ],
  },
  {
    segment: 'dashboard/workspace/profile',
    title: 'Мой профиль',
    icon: <PersonIcon />, // Иконка для профиля
  },
  {
    segment: 'dashboard/workspace/projects',
    title: 'Мои проекты',
    icon: <ProjectIcon />, // Иконка для проектов
  },
  {
    segment: 'dashboard/workspace/events',
    title: 'Мероприятия',
    icon: <EventIcon />, // Иконка для мероприятий
  },
  {
    segment: 'dashboard/workspace/reviews',
    title: 'Проверки',
    icon: <RateReviewIcon />, // Иконка для проверок
  },
  {
    segment: 'dashboard/workspace/instructions',
    title: 'Инструкция',
    icon: <HelpIcon />, // Иконка для инструкции
  },
];

const BRANDING = {
  title: 'Конкурсант.Гранты',
};

export default function App() {
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}
