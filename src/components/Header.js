import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 2rem",
                background: "rgba(15,23,42,0.95)",
                borderBottom: "1px solid rgba(31,41,55,0.9)",
                backdropFilter: "blur(10px)",
                position: "sticky",
                top: 0,
                zIndex: 40,
            }}
        >
            <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <Link
                    to="/"
                    style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}
                >
                </Link>
                {user && (
                    <>
                        <Link
                            to="/"
                            style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            Início
                        </Link>
                        <Link
                            to="/ranking"
                            style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            Ranking
                        </Link>
                    </>
                )}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {user ? (
                    <>
                        <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{user.email}</span>

                        {/* Ícone de perfil */}
                        <button
                            onClick={handleProfileClick}
                            title="Meu perfil"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "999px",
                                border: "1px solid #4f46e5",
                                background:
                                    "radial-gradient(circle at 30% 0, rgba(248,250,252,.12), transparent 55%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#e5e7eb",
                            }}
                        >
                            <span style={{ fontSize: 18 }}>👤</span>
                        </button>

                        <button
                            onClick={logout}
                            style={{
                                border: "none",
                                borderRadius: 999,
                                padding: "0.4rem 1rem",
                                backgroundColor: "#ef4444",
                                color: "#f9fafb",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                            }}
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{ color: "#e5e7eb", textDecoration: "none", fontSize: "0.9rem" }}
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                color: "#f9fafb",
                                textDecoration: "none",
                                fontSize: "0.9rem",
                                padding: "0.4rem 1rem",
                                borderRadius: 999,
                                backgroundColor: "#4f46e5",
                            }}
                        >
                            Registrar
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
