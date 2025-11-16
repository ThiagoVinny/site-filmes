// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function register(name, email, password) {
        await authService.register(name, email, password);
    }

    async function login(email, password) {
        const u = await authService.login(email, password);
        setUser(u);
        return u;
    }

    async function logout() {
        await authService.logout();
        setUser(null);
    }

    // 🔥 Carregar usuário automaticamente ao iniciar (cookie-based auth)
    useEffect(() => {
        async function loadUser() {
            try {
                const u = await authService.me();
                setUser(u);
            } catch {
                setUser(null);
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    const value = { user, loading, register, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
