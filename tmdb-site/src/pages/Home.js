import React, { useEffect, useState } from "react";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Ícones como componentes simples
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="21 21l-4.35-4.35"/>
    </svg>
);

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const FilmIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
);

const LoaderIcon = () => (
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
);

// Componente SearchBar melhorado
const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="relative max-w-2xl mx-auto mb-8">
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pesquisar Séries..."
                    style={{
                        width: '100%',
                        paddingLeft: '3rem',
                        paddingRight: '8rem',
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '1rem',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                        e.target.style.borderColor = 'transparent';
                    }}
                    onBlur={(e) => {
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'rgba(107, 114, 128, 0.5)',
                                color: 'white',
                                borderRadius: '0.75rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.7)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.5)'}
                        >
                            Limpar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSearch}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                            color: 'white',
                            borderRadius: '0.75rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)'}
                    >
                        Buscar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente MovieCard melhorado
const MovieCard = ({ movie }) => {
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    const cardStyle = {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        border: 'none',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }}
        >
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#374151"/><stop offset="100%" style="stop-color:#1f2937"/></linearGradient></defs><rect width="300" height="450" fill="url(#bg)"/><text x="150" y="225" text-anchor="middle" fill="#9ca3af" font-size="16" font-family="system-ui">Sem Imagem</text></svg>')}`}
                    alt={movie.title}
                    style={{
                        width: '100%',
                        height: '24rem',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />

                {/* Rating badge */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.4rem 0.7rem',
                    borderRadius: '1rem',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                }}>
                    <div style={{ color: '#fbbf24' }}>
                        <StarIcon />
                    </div>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{rating}</span>
                </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    transition: 'color 0.2s ease'
                }}>
                    {movie.title}
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#d1d5db',
                    marginBottom: '0.75rem'
                }}>
                    <CalendarIcon />
                    <span style={{ fontSize: '14px' }}>{releaseYear}</span>
                </div>

                <p style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {movie.overview || "Sem descrição disponível."}
                </p>
            </div>
        </div>
    );
};

// Componente de Loading
const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 0',
        color: 'white'
    }}>
        <div style={{ color: '#3b82f6', marginBottom: '1rem' }}>
            <LoaderIcon />
        </div>
        <p style={{ fontSize: '18px' }}>Carregando séries...</p>
    </div>
);

// Componente principal Home
function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchMode, setSearchMode] = useState(false);

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    const fetchPopularMovies = () => {
        setLoading(true);
        setSearchMode(false);
        fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`)
            .then(res => res.json())
            .then(data => {
                setMovies(data.results || []);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar Séries:", err);
                setError("Não foi possível carregar as séries.");
                setLoading(false);
            });
    };

    const handleSearch = (query) => {
        if (!query) {
            fetchPopularMovies();
            return;
        }

        setLoading(true);
        setSearchMode(true);
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                setMovies(data.results || []);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.error("Erro na busca:", err);
                setError("Não foi possível realizar a busca.");
                setMovies([]);
                setLoading(false);
            });
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)'
    };

    const headerStyle = {
        position: 'relative',
        overflow: 'hidden'
    };

    const headerOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))'
    };

    const headerContentStyle = {
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
    };

    const titleContainerStyle = {
        textAlign: 'center',
        marginBottom: '2rem'
    };

    const iconTitleStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '1rem'
    };

    const titleStyle = {
        fontSize: '3rem',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    };

    const subtitleStyle = {
        color: '#d1d5db',
        fontSize: '18px',
        maxWidth: '32rem',
        margin: '0 auto'
    };

    const contentStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem 3rem'
    };

    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
    };

    const sectionTitleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white'
    };

    const backButtonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(107, 114, 128, 0.5)',
        color: 'white',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '2rem',
        padding: '0 1rem'
    };

    const emptyStateStyle = {
        textAlign: 'center',
        padding: '5rem 0'
    };

    const errorBoxStyle = {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '24rem',
        margin: '0 auto'
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div style={headerOverlayStyle} />
                <div style={headerContentStyle}>
                    <div style={titleContainerStyle}>
                        <div style={iconTitleStyle}>
                            <div style={{ color: '#60a5fa' }}>
                                <FilmIcon />
                            </div>
                            <h1 style={titleStyle}>CineHub</h1>
                        </div>
                        <p style={subtitleStyle}>
                            Descubra as séries mais populares e encontre sua próxima aventura cinematográfica
                        </p>
                    </div>

                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            {/* Content */}
            <div style={contentStyle}>
                {/* Section Title */}
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>
                        {searchMode ? "Resultados da Pesquisa" : "Séries Populares"}
                    </h2>
                    {searchMode && (
                        <button
                            onClick={fetchPopularMovies}
                            style={backButtonStyle}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.7)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.5)'}
                        >
                            Ver Populares
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {loading && <LoadingSpinner />}

                {/* Error State */}
                {error && (
                    <div style={emptyStateStyle}>
                        <div style={errorBoxStyle}>
                            <p style={{ color: '#fca5a5', fontSize: '18px', marginBottom: '1rem' }}>{error}</p>
                            <button
                                onClick={fetchPopularMovies}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                )}

                {/* Movies Grid */}
                {!loading && !error && (
                    <>
                        {movies && movies.length > 0 ? (
                            <div style={gridStyle}>
                                {movies.map(movie => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            <div style={emptyStateStyle}>
                                <div style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                    <FilmIcon />
                                </div>
                                <p style={{ color: '#9ca3af', fontSize: '20px', marginBottom: '1rem' }}>
                                    {searchMode ? "Nenhuma série encontrada para sua pesquisa." : "Nenhuma série encontrada."}
                                </p>
                                {searchMode && (
                                    <button
                                        onClick={fetchPopularMovies}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                                    >
                                        Ver Séries Populares
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                input::placeholder {
                    color: #9ca3af;
                }

                @media (max-width: 640px) {
                    .grid-cols-responsive {
                        grid-template-columns: 1fr;
                    }
                }

                @media (min-width: 640px) and (max-width: 768px) {
                    .grid-cols-responsive {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 768px) and (max-width: 1024px) {
                    .grid-cols-responsive {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (min-width: 1024px) and (max-width: 1280px) {
                    .grid-cols-responsive {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                @media (min-width: 1280px) {
                    .grid-cols-responsive {
                        grid-template-columns: repeat(5, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
export default Home;