// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Instructions from './pages/Instructions';
import RedirectPage from './pages/RedirectPage';
import DashboardPage from './pages/WorkspacePages/DashboardPage.jsx';
import Profile from './components/workspace/Profile';
import Projects from './components/workspace/Projects';
import Events from './components/workspace/Events';
import Reviews from './components/workspace/Reviews';
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
    path: '/dashboard', // Изменено на уникальный путь
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
            path: 'workspace/profile',
            element: <Profile />, // Страница профиля
          },
          {
            path: 'workspace/projects',
            element: <Projects />, // Страница проектов
          },
          {
            path: 'workspace/events',
            element: <Events />, // Страница событий
          },
          {
            path: 'workspace/reviews',
            element: <Reviews />, // Страница отзывов
          },
          {
            path: 'workspace/instructions',
            element: <Instructions />, // Страница отзывов
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
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
