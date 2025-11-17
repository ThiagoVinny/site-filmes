// src/pages/Recover.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Recover() {
    const { recover } = useAuth();
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRecover = async (e) => {
        e.preventDefault();
        if (!email) return;
        try {
            setLoading(true);
            const res = await recover(email);
            setMsg(res.message || "Se o email estiver cadastrado, você receberá instruções.");
        } catch {
            setMsg("Erro ao solicitar recuperação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)", color: "white", padding: "2rem" }}>
            <form onSubmit={handleRecover} style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "2rem", borderRadius: "1rem", width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h2 style={{ textAlign: "center" }}>Recuperar Senha</h2>
                {msg && <p style={{ color: "#a3e635", textAlign: "center" }}>{msg}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "0.8rem", borderRadius: 8, border: "none", outline: "none", fontSize: 16 }} />
                <button type="submit" style={{ padding: "0.8rem", borderRadius: 8, border: "none", background: "linear-gradient(to right, #3b82f6, #8b5cf6)", color: "white", fontWeight: "bold", cursor: "pointer" }}>{loading ? "Enviando..." : "Enviar"}</button>
                <div style={{ textAlign: "center", fontSize: 14 }}>
                    <Link to="/login" style={{ color: "#9ca3af", textDecoration: "underline" }}>Voltar ao login</Link>
                </div>
            </form>
        </div>
    );
}
