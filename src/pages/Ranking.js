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
            // Endpoint top rated
            const res = await fetch(
                `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=pt-BR&page=1`
            );
            if (!res.ok) throw new Error("Erro ao carregar ranking.");
            const data = await res.json();

            // Pegar apenas as 10 primeiras
            const top10 = (data.results || []).slice(0, 10);
            setSeries(top10);
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
            <div style={{ color: "white", padding: "2rem" }}>
                Carregando ranking...
            </div>
        );

    if (error)
        return (
            <div style={{ color: "red", padding: "2rem" }}>{error}</div>
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)",
                color: "white",
                padding: "2rem",
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                🏆 Top 10 Séries Mais Bem Avaliadas
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "24px",
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
                                background: "rgba(30,41,59,0.8)",
                                borderRadius: 12,
                                padding: "1rem",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <img
                                src={serie.poster_path ? `${IMAGE_BASE_URL}${serie.poster_path}` : ""}
                                alt={serie.name}
                                style={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />
                            <h3 style={{ margin: "0.5rem 0" }}>
                                #{index + 1} {serie.name}
                            </h3>
                            <p style={{ fontSize: "0.9rem", color: "#d1d5db" }}>
                                Nota média: {serie.vote_average.toFixed(1)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
