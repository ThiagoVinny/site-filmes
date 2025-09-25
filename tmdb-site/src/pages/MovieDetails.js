import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetails = () => {
    const { id } = useParams(); // pega o id da URL
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
                if (!res.ok) throw new Error("Erro ao buscar detalhes do filme.");
                const data = await res.json();
                setMovie(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <p style={{ color: "white", textAlign: "center", padding: "2rem" }}>Carregando filme...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</p>;
    if (!movie) return null;

    return (
        <div style={{ minHeight: "100vh", padding: "2rem", background: "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)", color: "white" }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "2rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "rgba(107, 114, 128, 0.5)",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    color: "white"
                }}
            >
                ← Voltar
            </button>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                <img
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ""}
                    alt={movie.title}
                    style={{ width: "300px", borderRadius: "1rem" }}
                />
                <div style={{ maxWidth: "600px" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{movie.title}</h1>
                    <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
                        {movie.release_date ? `Lançamento: ${movie.release_date}` : ""}
                    </p>
                    <p style={{ marginBottom: "1rem" }}>
                        {movie.overview || "Sem descrição disponível."}
                    </p>
                    <p>
                        Nota: ⭐ {movie.vote_average?.toFixed(1) || "N/A"} ({movie.vote_count} votos)
                    </p>
                    {movie.genres && (
                        <p>
                            Gêneros: {movie.genres.map(g => g.name).join(", ")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
