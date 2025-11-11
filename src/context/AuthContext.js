// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const raw = localStorage.getItem("auth");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setUser(parsed.user || null);
                setToken(parsed.token || null);
            } catch (err) {
                console.error("Erro ao ler auth do localStorage:", err);
                localStorage.removeItem("auth");
            }
        }
        setLoading(false);
    }, []);

    const persist = (userObj, tokenStr) => {
        setUser(userObj);
        setToken(tokenStr);
        localStorage.setItem("auth", JSON.stringify({ user: userObj, token: tokenStr }));
    };

    const login = async (email, password) => {
        const res = await authService.login(email, password);
        if (res.error) throw new Error(res.error);
        persist(res.user, res.token);
        return res;
    };

    const register = async (email, password) => {
        const res = await authService.register(email, password);
        if (res.error) throw new Error(res.error);
        persist(res.user, res.token); // já deixa o usuário logado após registrar
        return res;
    };

    const recover = async (email) => {
        const res = await authService.recover(email);
        return res;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, register, recover, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
