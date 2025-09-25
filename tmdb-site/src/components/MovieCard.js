import React from "react";
import { Link } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie }) => {
    const releaseYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    return (
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
                style={{
                    position: 'relative',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
            >
                <img
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ""}
                    alt={movie.title}
                    style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem' }}>
                    <h3>{movie.title}</h3>
                    <p>{movie.overview?.substring(0, 100)}...</p>
                    <span>{releaseYear} | ⭐ {rating}</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
