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
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
                if (!res.ok) throw new Error("Erro ao buscar séries.");
                const data = await res.json();
                setSeries(data.results);
                setFilteredSeries(data.results);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar séries.");
            } finally {
                setLoading(false);
            }
        };
        fetchSeries();
    }, []);

    const handleSearch = (query) => {
        const filtered = series.filter((s) =>
            s.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSeries(filtered);
    };

    if (loading) return <p style={{ textAlign: "center", padding: "2rem", color: "white" }}>Carregando séries...</p>;
    if (error) return <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>{error}</p>;

    return (
        <div style={{
            padding: "2rem",
            background: "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)",
            minHeight: "100vh",
            color: "white"
        }}>
            <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem" }}>Séries Populares</h1>

            <div style={{ maxWidth: 400, margin: "0 auto 2rem" }}>
                <SearchBar onSearch={handleSearch} />
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem"
            }}>
                {filteredSeries.map((s) => (
                    <Link
                        key={s.id}
                        to={`/series/${s.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div
                            style={{
                                backgroundColor: "rgba(30,41,59,0.8)",
                                borderRadius: "1rem",
                                overflow: "hidden",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                cursor: "pointer",
                                transition: "transform 0.3s, box-shadow 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.7)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
                            }}
                        >
                            {s.poster_path ? (
                                <img
                                    src={`${IMAGE_BASE_URL}${s.poster_path}`}
                                    alt={s.name}
                                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "350px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#1e293b",
                                    color: "#9ca3af"
                                }}>
                                    Sem Imagem
                                </div>
                            )}
                            <div style={{ padding: "1rem" }}>
                                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{s.name}</h2>
                                <p style={{
                                    fontSize: "0.9rem",
                                    height: "60px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {s.overview || "Sem descrição disponível."}
                                </p>

                                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                                    {s.first_air_date && (
                                        <span style={{
                                            backgroundColor: "#3b82f6",
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: "0.3rem"
                                        }}>
                                            Estreia: {s.first_air_date.slice(0, 4)}
                                        </span>
                                    )}
                                    {s.vote_average != null && (
                                        <span style={{
                                            backgroundColor: "#facc15",
                                            color: "#0f172a",
                                            padding: "0.2rem 0.5rem",
                                            borderRadius: "0.3rem",
                                            fontWeight: "bold"
                                        }}>
                                            ⭐ {s.vote_average.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {s.genres && s.genres.length > 0 && (
                                    <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#d1d5db" }}>
                                        <strong>Gêneros:</strong> {s.genres.map(g => g.name).join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SeriesList;
