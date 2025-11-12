// src/services/api.js
const BASE = "http://localhost:4000";

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...(headers || {}) },
        body,
        credentials: "include",
    });

    if (!res.ok) {
        let msg = "Erro";
        try { const j = await res.json(); msg = j.error || msg; } catch {}
        throw new Error(msg);
    }

    return res.status === 204 ? null : res.json();
}
