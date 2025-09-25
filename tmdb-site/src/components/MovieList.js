import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`)
            .then((res) => res.json())
            .then((data) => {
                setMovies(data.results);
                setFilteredMovies(data.results);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar filmes:", err);
                setLoading(false);
            });
    }, []);

    const handleSearch = (query) => {
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMovies(filtered);
    };

    if (loading) return <p style={{ textAlign: "center", padding: "2rem" }}>Carregando filmes...</p>;

    return (
        <div style={{ padding: "2rem", background: "#0f172a", minHeight: "100vh", color: "white" }}>
            <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Filmes Populares</h1>

            <SearchBar onSearch={handleSearch} />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "2rem",
                }}
            >
                {filteredMovies.map((movie) => (
                    <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
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
                            {movie.poster_path && (
                                <img
                                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                                />
                            )}
                            <div style={{ padding: "1rem" }}>
                                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{movie.title}</h2>
                                <p style={{ fontSize: "0.9rem", height: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {movie.overview || "Sem descrição disponível."}
                                </p>
                                <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                                    ⭐ {movie.vote_average?.toFixed(1) || "N/A"} ({movie.vote_count})
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MovieList;
