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

import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками
import { SHA256 } from 'crypto-js'; // Импортируем библиотеку для хеширования


// Маппинг ролей и их хешей
const roles = {
  admin: SHA256('admin').toString(), // Хешируем роли
  moderator: SHA256('moderator').toString(),
  event_manager: SHA256('event_manager').toString(),
  expert: SHA256('expert').toString(),
  user: SHA256('user').toString(),
};

// Функция для получения роли по хешу
function getRoleByHash() {
  const roleToken = Cookies.get("role_token"); // Получаем токен роли из куки
  if (!roleToken) {
      return null; // Если токен не найден, возвращаем null
  }
  // Сравниваем хеши
  for (const [role, hash] of Object.entries(roles)) {
      if (hash === roleToken) {
          return role; // Возвращаем название роли, если хеш совпадает
      }
  }
  return null; // Если роль не найдена, возвращаем null
}

const NAVIGATION = {
  admin: [
    {
      title: 'Главная',
      segment: 'dashboard/workspace',
      icon: <DashboardIcon />,
    },
    {
      segment: 'dashboard/workspace/admin-page',
      title: 'Администрирование',
      icon: <AdminPanelSettingsIcon />,
    },
    {
      segment: 'dashboard/workspace/profile',
      title: 'Мой профиль',
      icon: <PersonIcon />,
    },
    {
      segment: 'dashboard/workspace/projects',
      title: 'Мои проекты',
      icon: <ProjectIcon />,
    },
    {
      segment: 'dashboard/workspace/events',
      title: 'Мероприятия',
      icon: <EventIcon />,
    },
    {
      segment: 'dashboard/workspace/reviews',
      title: 'Модуль оценки',
      icon: <RateReviewIcon />,
    },
    {
      segment: 'dashboard/workspace/instructions',
      title: 'Инструкция',
      icon: <HelpIcon />,
    },
  ],
  moderator: [
    {
      title: 'Главная',
      segment: 'dashboard/workspace',
      icon: <DashboardIcon />,
    },
    {
      segment: 'dashboard/workspace/admin-page',
      title: 'Администрирование',
      icon: <AdminPanelSettingsIcon />,
    },
    {
      segment: 'dashboard/workspace/profile',
      title: 'Мой профиль',
      icon: <PersonIcon />,
    },
    {
      segment: 'dashboard/workspace/projects',
      title: 'Мои проекты',
      icon: <ProjectIcon />,
    },
    {
      segment: 'dashboard/workspace/events',
      title: 'Мероприятия',
      icon: <EventIcon />,
    },
    {
      segment: 'dashboard/workspace/reviews',
      title: 'Оценка проектов',
      icon: <RateReviewIcon />,
    },
    {
      segment: 'dashboard/workspace/instructions',
      title: 'Инструкция',
      icon: <HelpIcon />,
    },
  ],
  event_manager:[
    {
      title: 'Главная',
      segment: 'dashboard/workspace',
      icon: <DashboardIcon />,
    },
    {
      segment: 'dashboard/workspace/profile',
      title: 'Мой профиль',
      icon: <PersonIcon />,
    },
    {
      segment: 'dashboard/workspace/projects',
      title: 'Мои проекты',
      icon: <ProjectIcon />,
    },
    {
      segment: 'dashboard/workspace/events',
      title: 'Мероприятия',
      icon: <EventIcon />,
    },
    {
      segment: 'dashboard/workspace/reviews',
      title: 'Оценка проектов',
      icon: <RateReviewIcon />,
    },
    {
      segment: 'dashboard/workspace/instructions',
      title: 'Инструкция',
      icon: <HelpIcon />,
    },
  ],
  expert: [
    {
      title: 'Главная',
      segment: 'dashboard/workspace',
      icon: <DashboardIcon />,
    },
    {
      segment: 'dashboard/workspace/profile',
      title: 'Мой профиль',
      icon: <PersonIcon />,
    },
    {
      segment: 'dashboard/workspace/projects',
      title: 'Мои проекты',
      icon: <ProjectIcon />,
    },
    {
      segment: 'dashboard/workspace/events',
      title: 'Мероприятия',
      icon: <EventIcon />,
    },
    {
      segment: 'dashboard/workspace/reviews',
      title: 'Оценка проектов',
      icon: <RateReviewIcon />,
    },
    {
      segment: 'dashboard/workspace/instructions',
      title: 'Инструкция',
      icon: <HelpIcon />,
    },
  ],
  user: [
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
      title: 'Мой профиль',
      icon: <PersonIcon />,
    },
    {
      segment: 'dashboard/workspace/events',
      title: 'Мероприятия',
      icon: <EventIcon />,
    },
    {
      segment: 'dashboard/workspace/projects',
      title: 'Мои проекты',
      icon: <ProjectIcon />,
    },
    {
      segment: 'dashboard/workspace/instructions',
      title: 'Инструкция',
      icon: <HelpIcon />,
    },
  ],
};


const BRANDING = {
  title: 'Конкурсант.Гранты',
};

export default function App() {
  const userRole = getRoleByHash(); // Получаем текущую роль пользователя

    // Проверяем, что userRole не равен null
    if (!userRole) {
      return <div>Пользователь не авторизован.</div>; // Сообщение для неавторизованных пользователей
    }

  // Получаем навигацию в зависимости от роли
  const navigation = NAVIGATION[userRole] || NAVIGATION.user; // По умолчанию — для пользователя

  return (
    <AppProvider navigation={navigation} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}
