import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function SeriesList() {
    const [series, setSeries] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`)
            .then((res) => res.json())
            .then((data) => {
                setSeries(data.results);
                setFilteredSeries(data.results);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar séries:", err);
                setLoading(false);
            });
    }, []);

    const handleSearch = (query) => {
        const filtered = series.filter((s) =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSeries(filtered);
    };

    if (loading) return <p style={{ textAlign: "center", padding: "2rem" }}>Carregando séries...</p>;

    return (
        <div style={{ padding: "2rem", background: "#0f172a", minHeight: "100vh", color: "white" }}>
            <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Séries Populares</h1>

            <SearchBar onSearch={handleSearch} />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "2rem",
                }}
            >
                {filteredSeries.map((s) => (
                    <Link
                        key={s.id}
                        to={`/series/${s.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div
                            style={{
                                backgroundColor: "#1e293b",
                                borderRadius: "1rem",
                                overflow: "hidden",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
                            }}
                        >
                            {s.poster_path && (
                                <img
                                    src={`${IMAGE_BASE_URL}${s.poster_path}`}
                                    alt={s.name}
                                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                                />
                            )}
                            <div style={{ padding: "1rem" }}>
                                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{s.name}</h2>
                                <p style={{ fontSize: "0.9rem", height: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {s.overview || "Sem descrição disponível."}
                                </p>
                                <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                                    ⭐ {s.vote_average?.toFixed(1) || "N/A"} ({s.vote_count})
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SeriesList;
