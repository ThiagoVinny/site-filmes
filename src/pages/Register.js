// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const n = name.trim();
        const em = email.trim();

        if (!n || !em || !password || !confirm) {
            return setError("Preencha todos os campos.");
        }
        if (password.length < 6) {
            return setError("A senha deve ter pelo menos 6 caracteres.");
        }
        if (password !== confirm) {
            return setError("As senhas não conferem.");
        }

        try {
            setLoading(true);
            await register(n, em, password);
            navigate("/login");
        } catch (err) {
            setError(err?.message || "Erro no cadastro.");
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
                onSubmit={handleRegister}
                style={{
                    width: "100%",
                    maxWidth: 440,
                    backgroundColor: "rgba(2,6,23,0.75)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.9rem",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: 6 }}>Criar conta</h2>
                <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 0 }}>
                    Junte-se ao Cinefy e organize suas séries favoritas ✨
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
                    Nome
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        style={inputStyle}
                        autoComplete="name"
                    />
                </label>

                <label style={labelStyle}>
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@email.com"
                        style={inputStyle}
                        autoComplete="email"
                    />
                </label>

                <label style={labelStyle}>
                    Senha
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo de 6 caracteres"
                        style={inputStyle}
                        autoComplete="new-password"
                    />
                </label>

                <label style={labelStyle}>
                    Confirmar senha
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repita a senha"
                        style={inputStyle}
                        autoComplete="new-password"
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
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>

                <div style={{ textAlign: "center", fontSize: 14, marginTop: 6 }}>
                    Já tem conta?{" "}
                    <Link
                        to="/login"
                        style={{ color: "#c4b5fd", textDecoration: "underline" }}
                    >
                        Entrar
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
