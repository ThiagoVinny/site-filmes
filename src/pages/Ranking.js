import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Ranking() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`);
            if (!res.ok) throw new Error("Erro ao carregar ranking.");
            const data = await res.json();
            setSeries((data.results || []).slice(0, 10));
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar ranking.");
            setSeries([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div style={{ color: "white", padding: "3rem", textAlign: "center" }}>
                <div
                    style={{
                        width: 50,
                        height: 50,
                        border: "4px solid rgba(139,92,246,0.2)",
                        borderTopColor: "#a855f7",
                        borderRadius: "50%",
                        margin: "0 auto 1rem",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <style>{`@keyframes spin {to {transform: rotate(360deg)}}`}</style>
                <p style={{ color: "#94a3b8" }}>Carregando ranking...</p>
            </div>
        );

    if (error)
        return (
            <div style={{ color: "red", padding: "2rem", textAlign: "center" }}>{error}</div>
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(1000px 500px at 20% -10%, rgba(139,92,246,0.25), transparent), radial-gradient(900px 400px at 80% 0%, rgba(236,72,153,0.18), transparent), linear-gradient(135deg,#0f172a,#1e1b4b 50%,#0f172a)",
                color: "white",
                padding: "2rem 1.5rem",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: 42,
                    fontWeight: 800,
                    marginBottom: "2.5rem",
                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                🏆 Top 10 Séries Mais Bem Avaliadas
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "28px",
                    maxWidth: 1300,
                    margin: "0 auto",
                }}
            >
                {series.map((serie, index) => (
                    <Link
                        key={serie.id}
                        to={`/series/${serie.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div
                            style={{
                                position: "relative",
                                background: "rgba(17,25,40,0.6)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                overflow: "hidden",
                                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                                transition: "transform .3s ease, box-shadow .3s ease",
                                backdropFilter: "blur(10px)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow =
                                    "0 20px 60px rgba(168,85,247,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 10px 40px rgba(0,0,0,0.4)";
                            }}
                        >
                            {/* Número de posição */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    left: 12,
                                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 16,
                                    color: "white",
                                    boxShadow: "0 0 10px rgba(236,72,153,0.5)",
                                }}
                            >
                                {index + 1}
                            </div>

                            <img
                                src={
                                    serie.poster_path
                                        ? `${IMAGE_BASE_URL}${serie.poster_path}`
                                        : "https://via.placeholder.com/500x750?text=Sem+Imagem"
                                }
                                alt={serie.name}
                                style={{
                                    width: "100%",
                                    height: 320,
                                    objectFit: "cover",
                                    borderRadius: "12px 12px 0 0",
                                }}
                            />

                            <div style={{ padding: "1rem" }}>
                                <h3
                                    style={{
                                        margin: "0.3rem 0 0.4rem",
                                        fontSize: 17,
                                        fontWeight: 700,
                                        color: "white",
                                        textAlign: "center",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {serie.name}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: "#cbd5e1",
                                        textAlign: "center",
                                        marginBottom: 6,
                                    }}
                                >
                                    ⭐ {serie.vote_average.toFixed(1)} / 10
                                </p>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "#94a3b8",
                                        textAlign: "center",
                                    }}
                                >
                                    {serie.first_air_date
                                        ? new Date(serie.first_air_date).getFullYear()
                                        : "Ano desconhecido"}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
