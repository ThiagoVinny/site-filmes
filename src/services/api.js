const BASE = ""; // se tiver backend, coloque aqui: e.g. "http://localhost:4000"
export default async function apiFetch(path, opts = {}) {
    const raw = localStorage.getItem("auth");
    let token = null;
    try {
        token = raw ? JSON.parse(raw).token : null;
    } catch {}
    opts.headers = opts.headers || {};
    if (!opts.headers["Content-Type"]) opts.headers["Content-Type"] = "application/json";
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE}${path}`, opts);
    return res;
}
