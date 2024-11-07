// src/main.jsx

// import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Instructions from './pages/Instructions';
import RedirectPage from './pages/RedirectPage';
import DashboardPage from './pages/WorkspacePages/DashboardPage';
import Profile from'./pages/WorkspacePages/ProfilePage';
import Admin from'./pages/WorkspacePages/AdminPage';
import ProjectsPage from './pages/WorkspacePages/ProjectsPage';
import EventsPage from './pages/WorkspacePages/EventsPage';
import CreateEventPage from './pages/WorkspacePages/CreateEventPage';
import UpdateEventPage from './pages/WorkspacePages/UpdateEventPage';

import Reviews from './components/workspace/Reviews';

import Test from './components/ComponentsEvents/test'; 

import UserProfile from './components/workspace/UserProfile'; 

import EventDetailsPage from './components/ComponentsEvents/_EventDetailsPage'; 

import ProjectDetails from './components/ViewDetailsProject/_ProjectDetails.jsx'; 

import NotFound from './pages/NotFound'; // Страница 404
import theme from './theme/theme';
import { ThemeProvider } from '@mui/material/styles';

const router = createBrowserRouter([
  // Маршруты вне Toolpad Core
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/redirect-page',
    element: <RedirectPage />,
  },

  // Маршруты Toolpad Core
  {
    path: '/dashboard', 
    element: <App />, // Оборачивает Toolpad Core
    children: [
      {
        element: <Layout />, // Общий Layout
        children: [
          {
            path: 'workspace',
            element: <DashboardPage />, // Страница панели управления
          },
          {
            path: 'workspace/admin-page',
            element: <Admin />
          },
          {
            path: 'workspace/profile',
            element: <Profile />, // Страница профиля
          },
          {
            path: 'workspace/profile/:userId', // Новый маршрут для профиля пользователя
            element: <UserProfile />,
          },
          {
            path: 'workspace/projects',
            element: <ProjectsPage />, // Страница проектов
          },
          {
            path: 'workspace/projects/:projectId', 
            element: <ProjectDetails />,
          },
          {
            path: 'workspace/events',
            element: <EventsPage />, // Страница событий
          },
          {
            path: 'workspace/events/:eventId',
            element: <EventDetailsPage />, 
          },
          {
            path: 'workspace/events/edit/:eventId',
            element: <EventDetailsPage />, 
          },
          {
            path: 'workspace/events/create',
            element: <CreateEventPage />, 
          },
          {
            path: 'workspace/events/update',
            element: <UpdateEventPage />, 
          },
          {
            path: 'workspace/reviews',
            element: <Reviews />, // Страница отзывов
          },
          {
            path: 'workspace/instructions',
            element: <Instructions />, // Страница отзывов
          },
          {
            path: 'workspace/test',
            element: <Test />, // Страница отзывов
          },
        ],
      },
    ],
  },

  // Страница 404
  {
    path: '*',
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
 // <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
//  </React.StrictMode>,
);
