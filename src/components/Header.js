import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { user, logout } = useAuth();
    return (
        <header style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
            <Link to="/">Home</Link>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: 12 }}>{user.email}</span>
                        <button onClick={logout}>Sair</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </header>
    );
}
