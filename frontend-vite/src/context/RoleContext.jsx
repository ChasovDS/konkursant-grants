// src/context/RoleContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoleByHash, ROLES } from '../utils/role';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userRole = getRoleByHash();
        setRole(userRole);
    }, []);

    return (
        <RoleContext.Provider value={{ role, ROLES }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
