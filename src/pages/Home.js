import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const IMAGE_PROFILE_URL = "https://image.tmdb.org/t/p/w200";

const icons = {
    search: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    ),
    star: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    ),
    calendar: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    trophy: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2h12v5c0 3.31-2.69 6-6 6s-6-2.69-6-6V2zm-2 5H2v2c0 2.21 1.79 4 4 4h.17A7.98 7.98 0 0 1 6 11V7zm16 0h-2v4c0 .69-.09 1.36-.26 2H20c2.21 0 4-1.79 4-4V7h-2zm-8 8c-1.38 0-2.63-.56-3.54-1.47L6 16v6h12v-6l-2.46-2.47A4.98 4.98 0 0 1 12 15z"/>
        </svg>
    ),
};

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const handleSearch = () => onSearch(query.trim());
    const handleClear = () => { setQuery(""); onSearch(""); };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto 3rem", position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                {icons.search}
            </span>
            <input
                type="text"
                value={query}
                placeholder="Buscar séries..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                    width: "100%",
                    padding: "1rem 10rem 1rem 3rem",
                    borderRadius: 16,
                    border: "2px solid rgba(255,255,255,0.1)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    fontSize: 16,
                    outline: "none",
                    transition: "all 0.3s"
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.backgroundColor = "rgba(255,255,255,0.05)";
                }}
            />
            {query && (
                <button
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        right: 100,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(107,114,128,0.3)",
                        border: "none",
                        borderRadius: 10,
                        padding: "0.6rem 1rem",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(107,114,128,0.5)"}
                    onMouseLeave={(e) => e.target.style.background = "rgba(107,114,128,0.3)"}
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
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.6rem 1.5rem",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-50%) scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(-50%) scale(1)"}
            >
                Buscar
            </button>
        </div>
    );
};

const SeriesCard = ({ serie }) => {
    const year = serie.first_air_date ? new Date(serie.first_air_date).getFullYear() : "N/A";
    const rating = serie.vote_average ? serie.vote_average.toFixed(1) : "N/A";

    return (
        <Link to={`/series/${serie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
                backgroundColor: "rgba(30,41,59,0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.05)"
            }}
                 onMouseEnter={e => {
                     e.currentTarget.style.transform = "translateY(-8px)";
                     e.currentTarget.style.boxShadow = "0 20px 40px rgba(139,92,246,0.3)";
                 }}
                 onMouseLeave={e => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                 }}
            >
                <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                        src={serie.poster_path ? `${IMAGE_BASE_URL}${serie.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Imagem"}
                        alt={serie.name || "Série"}
                        style={{ width: "100%", height: 350, objectFit: "cover", display: "block" }}
                    />
                    <div style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 8,
                        padding: "4px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#fbbf24"
                    }}>
                        {icons.star} <span style={{ fontWeight: "bold" }}>{rating}</span>
                    </div>
                </div>
                <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 16, marginBottom: 8, fontWeight: "600", lineHeight: 1.4, height: 44, overflow: "hidden" }}>
                        {serie.name}
                    </h3>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#94a3b8" }}>
                        {icons.calendar} <span>{year}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const LoadingSpinner = ({ text = "Carregando..." }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5rem 0", color: "white" }}>
        <div style={{
            width: 48,
            height: 48,
            border: "4px solid rgba(139,92,246,0.2)",
            borderTopColor: "#8b5cf6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: 16, color: "#94a3b8" }}>{text}</p>
    </div>
);

const AtoresDestaque = () => {
    const [atores, setAtores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAtores = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
                if (!res.ok) throw new Error("Erro ao carregar atores.");
                const data = await res.json();
                setAtores(data.results.slice(0, 15));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAtores();
    }, []);

    if (loading) return <LoadingSpinner text="Carregando atores..." />;

    return (
        <div style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            padding: "1rem 0",
            marginBottom: 48,
            scrollbarWidth: "thin",
            scrollbarColor: "#8b5cf6 rgba(255,255,255,0.1)"
        }}>
            {atores.map((ator) => (
                <div
                    key={ator.id}
                    style={{
                        flex: "0 0 auto",
                        width: 160,
                        background: "rgba(30,41,59,0.6)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.05)"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                    }}
                >
                    <img
                        src={ator.profile_path ? `${IMAGE_PROFILE_URL}${ator.profile_path}` : "https://via.placeholder.com/200x300?text=Sem+Foto"}
                        alt={ator.name}
                        style={{
                            width: "100%",
                            height: 240,
                            objectFit: "cover"
                        }}
                    />
                    <div style={{ padding: 12 }}>
                        <p style={{
                            fontWeight: "600",
                            color: "white",
                            fontSize: 14,
                            margin: "4px 0",
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            lineHeight: 1.3
                        }}>
                            {ator.name}
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: "#94a3b8",
                            margin: "4px 0",
                            textAlign: "center"
                        }}>
                            {ator.known_for_department || "Acting"}
                        </p>
                        <p style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            fontSize: 13,
                            marginTop: 8,
                            color: "#fbbf24"
                        }}>
                            {icons.star} <span>{ator.popularity.toFixed(1)}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function Home() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPopularSeries();
    }, []);

    const fetchPopularSeries = async () => {
        try {
            setLoading(true);
            let all = [];
            let page = 1;

            while (all.length < 50) {
                const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
                if (!res.ok) throw new Error("Erro ao carregar séries.");
                const data = await res.json();
                all = [...all, ...(data.results || [])];
                if (page >= data.total_pages) break;
                page++;
            }

            setSeries(all.slice(0, 50));
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar séries.");
            setSeries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        if (!query) return fetchPopularSeries();
        setLoading(true);
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`)
            .then(res => { if (!res.ok) throw new Error("Erro na busca"); return res.json(); })
            .then(data => { setSeries(data.results || []); setLoading(false); setError(null); })
            .catch(() => { setSeries([]); setError("Erro na busca."); setLoading(false); });
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            color: "white",
            padding: "2rem 1.5rem"
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1 style={{
                    fontSize: 48,
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 8
                }}>
                    🎬 Cinefly
                </h1>
                <p style={{ color: "#94a3b8", fontSize: 16 }}>Descubra as melhores séries do momento</p>
            </div>

            <SearchBar onSearch={handleSearch} />

            {/* Seção Atores */}
            <section style={{ marginBottom: 64, maxWidth: 1400, margin: "0 auto 64px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 28, fontWeight: "700", display: "flex", alignItems: "center", gap: 12 }}>
                        ✨ Atores em Destaque
                    </h2>
                </div>
                <AtoresDestaque />
            </section>

            {/* Botão Ranking */}
            <div style={{ textAlign: "center", marginBottom: 64 }}>
                <Link to="/ranking" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "1rem 2rem",
                    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                    color: "white",
                    borderRadius: 16,
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: 18,
                    transition: "all 0.3s",
                    boxShadow: "0 8px 24px rgba(245,158,11,0.3)"
                }}
                      onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 32px rgba(245,158,11,0.5)";
                      }}
                      onMouseLeave={e => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 8px 24px rgba(245,158,11,0.3)";
                      }}
                >
                    {icons.trophy} Ver Ranking Top 10
                </Link>
            </div>

            {/* Seção Séries */}
            <section style={{ maxWidth: 1400, margin: "0 auto" }}>
                <h2 style={{ fontSize: 28, fontWeight: "700", marginBottom: 32 }}>
                    🔥 Séries Populares
                </h2>
                {loading ? <LoadingSpinner text="Carregando séries..." /> :
                    error ? <p style={{ textAlign: "center", color: "#ef4444", fontSize: 18 }}>{error}</p> :
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: 24
                        }}>
                            {series.map(s => <SeriesCard key={s.id} serie={s} />)}
                        </div>
                }
            </section>
        </div>
    );
}