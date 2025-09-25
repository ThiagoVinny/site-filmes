import React, { useEffect, useState } from "react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";

const MovieCard = ({ movie }) => {
    const [cast, setCast] = useState([]);
    const [genres, setGenres] = useState([]);

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    useEffect(() => {
        // Buscar detalhes do filme
        fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`)
            .then(res => res.json())
            .then(data => setGenres(data.genres || []))
            .catch(err => console.error(err));

        // Buscar elenco
        fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`)
            .then(res => res.json())
            .then(data => setCast(data.cast?.slice(0, 3) || [])) // pegar top 3 atores
            .catch(err => console.error(err));
    }, [movie.id]);

    return (
        <div style={{ backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 16, overflow: "hidden", cursor: "pointer" }}>
            <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ""} alt={movie.title} style={{ width: "100%", height: 300, objectFit: "cover" }} />
            <div style={{ padding: "1rem", color: "white" }}>
                <h3>{movie.title}</h3>
                <p>{movie.overview?.substring(0, 100)}...</p>
                <span>{releaseYear} | ⭐ {rating}</span>
                <div style={{ marginTop: 8 }}>
                    <strong>Gêneros:</strong> {genres.map(g => g.name).join(", ")}
                </div>
                <div style={{ marginTop: 4 }}>
                    <strong>Elenco:</strong> {cast.map(c => c.name).join(", ")}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
