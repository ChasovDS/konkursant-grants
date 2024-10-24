// src/App.jsx

import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ProjectIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HelpIcon from '@mui/icons-material/Help';

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
    segment: 'dashboard/workspace/profile',
    title: 'Профиль',
    icon: <PersonIcon />, // Иконка для профиля
  },
  {
    segment: 'dashboard/workspace/projects',
    title: 'Проекты',
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
