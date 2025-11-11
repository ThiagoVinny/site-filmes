// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password || !confirm) return setError("Preencha todos os campos");
        if (password !== confirm) return setError("Senhas não conferem");
        try {
            setLoading(true);
            await register(email, password);
            navigate("/login");
        } catch (err) {
            setError(err.message || "Erro no cadastro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)", color: "white", padding: "2rem" }}>
            <form onSubmit={handleRegister} style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "2rem", borderRadius: "1rem", width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h2 style={{ textAlign: "center" }}>Cadastro</h2>
                {error && <p style={{ color: "salmon", textAlign: "center" }}>{error}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "0.8rem", borderRadius: 8, border: "none", outline: "none", fontSize: 16 }} />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "0.8rem", borderRadius: 8, border: "none", outline: "none", fontSize: 16 }} />
                <input type="password" placeholder="Confirmar senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ padding: "0.8rem", borderRadius: 8, border: "none", outline: "none", fontSize: 16 }} />
                <button type="submit" style={{ padding: "0.8rem", borderRadius: 8, border: "none", background: "linear-gradient(to right, #3b82f6, #8b5cf6)", color: "white", fontWeight: "bold", cursor: "pointer" }}>{loading ? "Cadastrando..." : "Cadastrar"}</button>
                <div style={{ textAlign: "center", fontSize: 14 }}>
                    <Link to="/login" style={{ color: "#9ca3af", textDecoration: "underline" }}>Voltar ao login</Link>
                </div>
            </form>
        </div>
    );
}
