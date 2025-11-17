// src/services/api.js
const BASE = "http://localhost:4000";

export async function apiFetch(
    path,
    { method = "GET", body = null, headers = {} } = {}
) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include", // 🔥 envia cookies sempre
    };

    // Só adiciona o body se existir
    if (body) {
        options.body = body;
    }

    const res = await fetch(`${BASE}${path}`, options);

    if (!res.ok) {
        let msg = "Erro";
        try {
            const j = await res.json();
            msg = j.error || msg;
        } catch {}
        throw new Error(msg);
    }

    return res.status === 204 ? null : res.json();
}
