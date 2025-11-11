// src/services/api.js
const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).token : null;

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(BASE + path, {
        ...options,
        headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw data;

    return data;
}
