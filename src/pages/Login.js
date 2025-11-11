import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) return setError("Preencha todos os campos");
        try {
            setLoading(true);
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Erro no login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)", color: "white", padding: "2rem" }}>
            <form onSubmit={handleLogin} style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "2rem", borderRadius: "1rem", width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h2 style={{ textAlign: "center" }}>Login</h2>
                {error && <p style={{ color: "salmon", textAlign: "center" }}>{error}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "0.8rem", borderRadius: 8, border: "none", outline: "none", fontSize: 16 }} />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "0.8rem", borderRadius: 8, border: "none", outline: "none", fontSize: 16 }} />
                <button type="submit" style={{ padding: "0.8rem", borderRadius: 8, border: "none", background: "linear-gradient(to right, #3b82f6, #8b5cf6)", color: "white", fontWeight: "bold", cursor: "pointer" }}>{loading ? "Entrando..." : "Entrar"}</button>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <Link to="/recover" style={{ color: "#9ca3af", textDecoration: "underline" }}>Recuperar senha</Link>
                    <Link to="/register" style={{ color: "#9ca3af", textDecoration: "underline" }}>Cadastrar</Link>
                </div>
            </form>
        </div>
    );
}
