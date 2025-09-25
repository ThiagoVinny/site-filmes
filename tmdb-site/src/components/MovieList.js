import React, { useEffect, useState } from "react";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";

function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`)
            .then(response => response.json())
            .then(data => {
                setMovies(data.results);
            })
            .catch(error => console.error("Erro ao buscar filmes:", error));
    }, []);

    return (
        <div>
            {movies.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {movies.map(movie => (
                        <li key={movie.id} style={{ marginBottom: "20px" }}>
                            <h2>{movie.title}</h2>
                            <p>{movie.overview}</p>
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Carregando filmes...</p>
            )}
        </div>
    );
}

export default MovieList;
