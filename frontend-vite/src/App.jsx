// src/App.jsx
import React from 'react';
import { Outlet } from "react-router-dom";
import { AppProvider } from "@toolpad/core/react-router-dom";

import { getRoleByHash } from './utils/role';
import { NAVIGATION, BRANDING } from './components/ComponentsApp/Navigation';
import { AuthProvider, AuthContext } from './components/ComponentsApp/AuthProvider';

export default function App() {
  const userRole = getRoleByHash();

  if (!userRole) {
    return <div>Пользователь не авторизован.</div>;
  }

  const navigation = NAVIGATION[userRole] || NAVIGATION.user;

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
