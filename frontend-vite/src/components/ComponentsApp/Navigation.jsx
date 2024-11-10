// src\components\ComponentsApp\Navigation.jsx
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ProjectIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import RateReviewIcon from "@mui/icons-material/RateReview";
import HelpIcon from "@mui/icons-material/Help";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export const NAVIGATION = {
  admin: [
    {
      title: "Главная",
      segment: "workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "workspace/admin-page",
      title: "Администрирование",
      icon: <AdminPanelSettingsIcon />,
    },
    {
      segment: "workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "workspace/reviews",
      title: "Модуль оценки",
      icon: <RateReviewIcon />,
    },
    {
      segment: "workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  moderator: [
    {
      title: "Главная",
      segment: "workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "workspace/admin-page",
      title: "Администрирование",
      icon: <AdminPanelSettingsIcon />,
    },
    {
      segment: "workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "workspace/reviews",
      title: "Оценка проектов",
      icon: <RateReviewIcon />,
    },
    {
      segment: "workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  event_manager: [
    {
      title: "Главная",
      segment: "workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "workspace/reviews",
      title: "Оценка проектов",
      icon: <RateReviewIcon />,
    },
    {
      segment: "workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  expert: [
    {
      title: "Главная",
      segment: "workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "workspace/reviews",
      title: "Оценка проектов",
      icon: <RateReviewIcon />,
    },
    {
      segment: "workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  user: [
    {
      kind: "header",
      title: "Main items",
    },
    {
      title: "Главная",
      segment: "workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
};

export const BRANDING = {
  title: "Конкурсант.Гранты",
};
