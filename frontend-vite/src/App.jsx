// src/App.jsx
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { CircularProgress } from "@mui/material";
import { NAVIGATION, BRANDING } from './components/ComponentsApp/Navigation';
import { AuthProvider, AuthContext } from './components/ComponentsApp/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { session } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session || !session.user) {
        navigate('/forbidden');
      }
    }, 5000); // 5 секунд

    if (session && session.user) {
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [session, navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  const userRole = session.user.role_name;
  const navigation = NAVIGATION[userRole] || NAVIGATION.user;

  return (
    <AuthContext.Consumer>
      {({ session, authentication }) => (
        <AppProvider
          navigation={navigation}
          branding={BRANDING}
          session={session}
          authentication={authentication}
        >
          <Outlet />
        </AppProvider>
      )}
    </AuthContext.Consumer>
  );
}
