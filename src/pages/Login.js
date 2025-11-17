// src/pages/Login.js
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
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)",
                color: "white",
                padding: "2rem",
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    width: "100%",
                    maxWidth: 420,
                    backgroundColor: "rgba(2,6,23,0.75)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: 6 }}>Entrar</h2>
                <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 0 }}>
                    Bem-vindo de volta! 👋
                </p>

                {error && (
                    <div
                        style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.35)",
                            color: "#fecaca",
                            borderRadius: 10,
                            padding: "0.7rem 0.9rem",
                            fontSize: 14,
                        }}
                    >
                        {error}
                    </div>
                )}

                <label style={labelStyle}>
                    E-mail
                    <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        autoComplete="email"
                    />
                </label>

                <label style={labelStyle}>
                    Senha
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        autoComplete="current-password"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: 6,
                        padding: "0.9rem",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        background:
                            "linear-gradient(135deg, rgba(59,130,246,1), rgba(139,92,246,1))",
                        color: "white",
                        fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: "0 12px 28px rgba(59,130,246,0.25)",
                        transition: "transform .15s",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 4 }}>
                    <Link to="/recover" style={{ color: "#c4b5fd", textDecoration: "underline" }}>
                        Recuperar senha
                    </Link>
                    <Link to="/register" style={{ color: "#c4b5fd", textDecoration: "underline" }}>
                        Criar conta
                    </Link>
                </div>
            </form>
        </div>
    );
}

const labelStyle = {
    fontSize: 13,
    color: "#cbd5e1",
    display: "grid",
    gap: 6,
};

const inputStyle = {
    padding: "0.85rem 0.9rem",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontSize: 15,
    outline: "none",
};