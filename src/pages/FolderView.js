// src/pages/FolderView.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFolderSeries } from "../services/foldersService";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function FolderView() {
    const { id } = useParams(); // folder_id
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await getFolderSeries(id);
                setSeries(data || []);
                setError(null);
            } catch (err) {
                console.error("Erro ao carregar séries da pasta:", err);
                setError("Erro ao carregar séries.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#0f172a,#1e1b4b 50%,#0f172a)",
                color: "white",
                padding: "2rem",
            }}
        >
            <Link to="/profile" style={{ color: "#94a3b8", textDecoration: "none" }}>
                ← Voltar para o perfil
            </Link>

            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "1rem 0 2rem" }}>
                📁 Séries na pasta
            </h1>

            {loading ? (
                <p style={{ color: "#9ca3af" }}>Carregando...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : series.length === 0 ? (
                <p style={{ color: "#9ca3af" }}>Nenhuma série adicionada ainda.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {series.map((s) => (
                        <div
                            key={s.tmdb_id}
                            style={{
                                background: "rgba(30,41,59,0.8)",
                                borderRadius: 12,
                                overflow: "hidden",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                                transition: "transform .2s",
                            }}
                        >
                            <img
                                src={
                                    s.poster_path
                                        ? `${IMAGE_BASE_URL}${s.poster_path}`
                                        : "https://via.placeholder.com/500x750?text=Sem+Imagem"
                                }
                                alt={s.name}
                                style={{ width: "100%", height: 260, objectFit: "cover" }}
                            />
                            <div style={{ padding: "0.8rem" }}>
                                <h3 style={{ fontSize: 16, margin: 0 }}>ID: {s.tmdb_id}</h3>
                                <p style={{ fontSize: 12, color: "#9ca3af" }}>
                                    Tipo: {s.media_type}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
