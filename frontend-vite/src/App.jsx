// src/App.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { CircularProgress } from "@mui/material";
import { NAVIGATION, BRANDING } from './components/ComponentsApp/Navigation';
import { AuthProvider, AuthContext } from './components/ComponentsApp/AuthProvider';

const LOADING_TIMEOUT = 5000; // Время ожидания в миллисекундах

function MainApp() {
  const { session } = useContext(AuthContext);
  const { authentication } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || !session.user) {
      const timer = setTimeout(() => {
        navigate('/forbidden');
      }, LOADING_TIMEOUT);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [session, navigate]);

  // Перемещение вычисления navigation вне условия
  const userRole = session?.user?.role_name || 'user'; // Значение по умолчанию
  const navigation = useMemo(() => NAVIGATION[userRole], [userRole]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <AppProvider
      navigation={navigation}
      branding={BRANDING}
      session={session}
      authentication={authentication} 
    >

      
      <Outlet />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}