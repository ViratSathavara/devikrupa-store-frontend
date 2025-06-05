import React, { createContext, useState, useEffect } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');
        if (storedToken && storedUser && storedRole) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }
    }, []);
const handleAuthSuccess = (token, userData) => {
        const userRole = userData.role || 'user';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userRole);
        setToken(token);
        setUser(userData);
        setRole(userRole);
    };

    const handleNewUserDataAuthSuccess = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <LoginContext.Provider value={{
            token, user, role,setUser, setToken, setRole,
            handleAuthSuccess,
            handleNewUserDataAuthSuccess,
            showUserLogin, setShowUserLogin
        }}>
            {children}
        </LoginContext.Provider>
    );
};