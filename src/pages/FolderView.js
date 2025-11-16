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

                // Busca os detalhes completos de cada série pelo TMDB
                const enriched = await Promise.all(
                    (data || []).map(async (item) => {
                        try {
                            const res = await fetch(
                                `https://api.themoviedb.org/3/tv/${item.tmdb_id}?api_key=ee4baf041aa87a38a21cb891835ae1ca&language=pt-BR`
                            );
                            const details = await res.json();
                            return { ...item, ...details };
                        } catch {
                            return item;
                        }
                    })
                );

                setSeries(enriched);
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
                background:
                    "radial-gradient(1200px 800px at 20% -10%, rgba(139,92,246,.3), transparent), radial-gradient(900px 500px at 80% 0%, rgba(236,72,153,.2), transparent), linear-gradient(135deg,#0f172a,#1e1b4b 50%,#0f172a)",
                color: "white",
                padding: "2rem 1.5rem",
            }}
        >
            <Link
                to="/profile"
                style={{
                    color: "#c084fc",
                    textDecoration: "none",
                    fontSize: 16,
                    marginBottom: 20,
                    display: "inline-block",
                }}
            >
                ← Voltar para o perfil
            </Link>

            <h1
                style={{
                    fontSize: 42,
                    fontWeight: 900,
                    background: "linear-gradient(135deg,#a78bfa,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 28,
                }}
            >
                📁 Séries da Pasta
            </h1>

            {loading ? (
                <p style={{ color: "#9ca3af" }}>Carregando...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : series.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 18 }}>Nenhuma série adicionada ainda.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "1.8rem",
                        maxWidth: 1400,
                        margin: "0 auto",
                    }}
                >
                    {series.map((s) => (
                        <div
                            key={s.tmdb_id}
                            style={{
                                background: "rgba(30,41,59,0.8)",
                                borderRadius: 18,
                                overflow: "hidden",
                                boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                                transition: "transform .25s, box-shadow .25s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow =
                                    "0 16px 40px rgba(0,0,0,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow =
                                    "0 12px 30px rgba(0,0,0,0.4)";
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

                            <div style={{ padding: "0.9rem" }}>
                                <h3
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 700,
                                        marginBottom: 4,
                                    }}
                                >
                                    {s.name || "Título indisponível"}
                                </h3>

                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "#a1a1aa",
                                        marginBottom: 6,
                                    }}
                                >
                                    {s.first_air_date
                                        ? new Date(s.first_air_date).getFullYear()
                                        : "Ano desconhecido"}
                                </p>

                                {s.vote_average && (
                                    <p
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#fbbf24",
                                        }}
                                    >
                                        ⭐ {s.vote_average.toFixed(1)}
                                    </p>
                                )}

                                <Link
                                    to={`/series/${s.id}`}
                                    style={{
                                        marginTop: 12,
                                        display: "inline-block",
                                        padding: "0.5rem 1rem",
                                        background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                                        borderRadius: 10,
                                        color: "white",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        fontSize: 14,
                                    }}
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
