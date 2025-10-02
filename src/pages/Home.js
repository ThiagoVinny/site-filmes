import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const icons = {
    search: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
        </svg>
    ),
    star: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
    ),
    calendar: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    loader: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>
    ),
};

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const handleSearch = () => onSearch(query.trim());
    const handleClear = () => { setQuery(""); onSearch(""); };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto 2rem", position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                {icons.search}
            </span>
            <input
                type="text"
                value={query}
                placeholder="Buscar filmes..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                    width: "100%",
                    padding: "0.75rem 4rem 0.75rem 2.5rem",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: 16,
                    outline: "none"
                }}
            />
            {query && (
                <button
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        right: 80,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(107,114,128,0.5)",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.5rem 1rem",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    Limpar
                </button>
            )}
            <button
                onClick={handleSearch}
                style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                    border: "none",
                    borderRadius: 8,
                    padding: "0.5rem 1.2rem",
                    color: "white",
                    cursor: "pointer"
                }}
            >
                Buscar
            </button>
        </div>
    );
};

// ---------- MOVIE CARD ----------
const MovieCard = ({ movie }) => {
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    return (
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
                backgroundColor: "rgba(30,41,59,0.8)",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
            }}
                 onMouseEnter={e => {
                     e.currentTarget.style.transform = "scale(1.05)";
                     e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.6)";
                 }}
                 onMouseLeave={e => {
                     e.currentTarget.style.transform = "scale(1)";
                     e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
                 }}
            >
                <img
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ""}
                    alt={movie.title}
                    style={{ width: "100%", height: 350, objectFit: "cover" }}
                />
                <div style={{ padding: 12 }}>
                    <h3 style={{ fontSize: 16, marginBottom: 4 }}>{movie.title}</h3>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14 }}>
                        {icons.calendar} <span>{releaseYear}</span>
                        {icons.star} <span>{rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const LoadingSpinner = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5rem 0", color: "white" }}>
        <div style={{ marginBottom: 16 }}>{icons.loader}</div>
        <p>Carregando filmes...</p>
    </div>
);

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => fetchPopular(), []);

    const fetchPopular = async () => {
        try {
            setLoading(true);
            let allMovies = [];
            let page = 1;

            while (allMovies.length < 50) {
                const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
                if (!res.ok) throw new Error("Erro ao carregar filmes.");
                const data = await res.json();
                allMovies = [...allMovies, ...(data.results || [])];
                if (page >= data.total_pages) break;
                page++;
            }

            setMovies(allMovies.slice(0, 50));
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar filmes.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        if (!query) return fetchPopular();
        setLoading(true);
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => { setMovies(data.results || []); setLoading(false); setError(null); })
            .catch(() => { setMovies([]); setError("Erro na busca."); setLoading(false); });
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#581c87 50%,#0f172a 100%)", color: "white", padding: "2rem 1rem" }}>
            <h1 style={{ textAlign: "center", marginBottom: 24, fontSize: "2rem" }}>Filmes Populares</h1>
            <SearchBar onSearch={handleSearch} />

            {loading ? <LoadingSpinner /> :
                error ? <p style={{ textAlign: "center", color: "red" }}>{error}</p> :
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: 24
                    }}>
                        {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
            }
        </div>
    );
}
