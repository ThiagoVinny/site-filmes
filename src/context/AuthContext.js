// src/context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function register(name, email, password) {
        await authService.register(name, email, password);
        // opcional: já fazer login automático aqui
    }

    async function login(email, password) {
        const u = await authService.login(email, password);
        setUser(u);
    }

    async function logout() {
        await authService.logout();
        setUser(null);
    }

    async function fetchMe() {
        try {
            const u = await authService.me();
            setUser(u);
        } catch {
            setUser(null);
        }
    }

    const value = { user, register, login, logout, fetchMe };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
