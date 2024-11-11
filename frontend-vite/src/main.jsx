// src/main

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';

// Импорт компонентов страниц
import App from './App';
import BaseLayout from './layouts/BaseLayout'; 
import Layout from './layouts/DashboardLayout';
import Home from './pages/BasePages/Home';
import Instructions from './pages/BasePages/Instructions';
import Forbidden from './pages/BasePages/Forbidden';
import NotFound from './pages/BasePages/NotFound';

// Импорт страниц рабочего пространства
import DashboardPage from './pages/WorkspacePages/DashboardPage';
import Profile from './pages/WorkspacePages/ProfilePage';
import Admin from './pages/WorkspacePages/AdminPage';
import ProjectsPage from './pages/WorkspacePages/ProjectsPage';
import EventsPage from './pages/WorkspacePages/EventsPage';
import CreateEventPage from './components/WorkspacePages/EventPage/_CreateEventPage';
import UpdateEventPage from './components/WorkspacePages/EventPage/_UpdateEventPage';

import Reviews from './pages/WorkspacePages/ReviewPage';
import ProjectsList from './components/WorkspacePages/ReviewPage/SectionProject/ProjectsList';

// Импорт компонентов событий
import UserProfileAdmin from './components/WorkspacePages/AdminPage/ComponentsAdminPage/UserProfileAdmin'; 
import EventDetailsPage from './components/WorkspacePages/EventPage/_EventDetailsPage'; 
import ProjectDetails from './components/WorkspacePages/ProjectPage/ComponentsProjectDetails/_ProjectDetails'; 



import Login from './pages/AuthPage/Login';
import RedirectPage from './pages/AuthPage/RedirectPage';


// Настройка маршрутов
const router = createBrowserRouter([
  // Маршруты вне Toolpad Core
  {
    path: '/',
    element: <BaseLayout />, // Используем новый Layout
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'redirect-page', element: <RedirectPage /> },
      { path: 'forbidden', element: <Forbidden /> },
      { path: '*', element: <NotFound /> },
      { path: 'instructions', element: <Instructions /> },
    ],
  },

  // Маршруты Toolpad Core
  {
    path: '/workspace',
    element: <App />, // Оборачивает Toolpad Core
    children: [
      {
        element: <Layout />, // Общий Layout для рабочего пространства
        children: [
          { path: '', element: <DashboardPage /> }, // Главная страница рабочего пространства
          { path: 'admin-page', element: <Admin /> },
          { path: 'profile', element: <Profile /> },
          { path: 'profile/:userId', element: <UserProfileAdmin /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'projects/:projectId', element: <ProjectDetails /> },
          { path: 'events', element: <EventsPage /> },
          { path: 'events/:eventId', element: <EventDetailsPage /> },
          { path: 'events/edit/:eventId', element: <UpdateEventPage /> },
          { path: 'events/create', element: <CreateEventPage /> },
          { path: 'reviews', element: <Reviews /> },
          { path: 'reviews/:eventId/projects', element: <ProjectsList /> },
          { path: 'instructions', element: <Instructions /> },
        ],
      },
    ],
  },
]);

// Рендеринг приложения
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
