// src/services/authService.js
import { apiFetch } from "./api";

export async function register(name, email, password) {
    return apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
}

export async function login(email, password) {
    return apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
}

export async function logout() {
    return apiFetch("/auth/logout", { method: "POST" });
}

export async function me() {
    return apiFetch("/auth/me", { method: "GET" });
}

const authService = { register, login, logout, me };
export default authService;
