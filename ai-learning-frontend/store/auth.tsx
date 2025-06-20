'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    token: string | null;
    role: string | null;
    status: string | null;
    setAuth: (token: string, role: string, status: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    role: null,
    status: null,
    setAuth: () => false,
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role');
        const savedStatus = localStorage.getItem('status');
        if (savedToken) setToken(savedToken);
        if (savedRole) setRole(savedRole);
        if (savedStatus) setStatus(savedStatus);
    }, []);

    const setAuth = (token: string, role: string, status: string) => {
        if (status !== 'ACTIVE') return false;

        setToken(token);
        setRole(role);
        setStatus(status);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('status', status);
        return true;
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setStatus(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('status');
    };

    return (
        <AuthContext.Provider value={{ token, role, status, setAuth, logout }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
