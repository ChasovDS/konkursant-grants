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
      segment: "dashboard/workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "dashboard/workspace/admin-page",
      title: "Администрирование",
      icon: <AdminPanelSettingsIcon />,
    },
    {
      segment: "dashboard/workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "dashboard/workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "dashboard/workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "dashboard/workspace/reviews",
      title: "Модуль оценки",
      icon: <RateReviewIcon />,
    },
    {
      segment: "dashboard/workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  moderator: [
    {
      title: "Главная",
      segment: "dashboard/workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "dashboard/workspace/admin-page",
      title: "Администрирование",
      icon: <AdminPanelSettingsIcon />,
    },
    {
      segment: "dashboard/workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "dashboard/workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "dashboard/workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "dashboard/workspace/reviews",
      title: "Оценка проектов",
      icon: <RateReviewIcon />,
    },
    {
      segment: "dashboard/workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  event_manager: [
    {
      title: "Главная",
      segment: "dashboard/workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "dashboard/workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "dashboard/workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "dashboard/workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "dashboard/workspace/reviews",
      title: "Оценка проектов",
      icon: <RateReviewIcon />,
    },
    {
      segment: "dashboard/workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
  expert: [
    {
      title: "Главная",
      segment: "dashboard/workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "dashboard/workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "dashboard/workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "dashboard/workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "dashboard/workspace/reviews",
      title: "Оценка проектов",
      icon: <RateReviewIcon />,
    },
    {
      segment: "dashboard/workspace/instructions",
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
      segment: "dashboard/workspace",
      icon: <DashboardIcon />,
    },
    {
      segment: "dashboard/workspace/profile",
      title: "Мой профиль",
      icon: <PersonIcon />,
    },
    {
      segment: "dashboard/workspace/events",
      title: "Мероприятия",
      icon: <EventIcon />,
    },
    {
      segment: "dashboard/workspace/projects",
      title: "Мои проекты",
      icon: <ProjectIcon />,
    },
    {
      segment: "dashboard/workspace/instructions",
      title: "Инструкция",
      icon: <HelpIcon />,
    },
  ],
};

export const BRANDING = {
  title: "Конкурсант.Гранты",
};
