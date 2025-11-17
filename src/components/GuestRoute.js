// src/components/GuestRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: 20, color: "white" }}>Carregando...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
}