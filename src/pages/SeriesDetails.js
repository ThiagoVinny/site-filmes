import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const icons = {
    star: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    ),
    calendar: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    tv: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="17 2 12 7 7 2"/>
        </svg>
    ),
    globe: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
    ),
    film: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <line x1="7" y1="2" x2="7" y2="22"/>
            <line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/>
            <line x1="2" y1="17" x2="7" y2="17"/>
            <line x1="17" y1="17" x2="22" y2="17"/>
            <line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
    ),
    arrow: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
        </svg>
    ),
};

const SeriesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [serie, setSerie] = useState(null);
    const [cast, setCast] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                const resSerie = await fetch(
                    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`
                );
                if (!resSerie.ok) throw new Error("Erro ao buscar detalhes da série.");
                const serieData = await resSerie.json();
                setSerie(serieData);

                const resCast = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
                const castData = await resCast.json();
                setCast(castData.cast?.slice(0, 8) || []);

                const resVideo = await fetch(
                    `${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=pt-BR`
                );
                const videoData = await resVideo.json();
                const trailer = videoData.results?.find(
                    (v) => v.type === "Trailer" && v.site === "YouTube"
                );
                setVideo(trailer);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        border: "4px solid rgba(139,92,246,0.2)",
                        borderTopColor: "#8b5cf6",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 16px"
                    }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ fontSize: 18, color: "#94a3b8" }}>Carregando série...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
                padding: "2rem"
            }}>
                <p style={{ fontSize: 18 }}>{error}</p>
            </div>
        );
    }

    if (!serie) return null;

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            color: "white",
        }}>
            {/* Header com backdrop */}
            <div style={{ position: "relative", marginBottom: "2rem" }}>
                {serie.backdrop_path && (
                    <>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${BACKDROP_BASE_URL}${serie.backdrop_path})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: 0.2,
                            zIndex: 0
                        }}></div>
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(to bottom, transparent, #0f172a)",
                            zIndex: 1
                        }}></div>
                    </>
                )}

                <div style={{ position: "relative", zIndex: 2, padding: "2rem 2rem 4rem" }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0.75rem 1.25rem",
                            backgroundColor: "rgba(30,41,59,0.7)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12,
                            cursor: "pointer",
                            color: "white",
                            fontSize: 15,
                            fontWeight: "600",
                            transition: "all 0.3s",
                            marginBottom: "2rem"
                        }}
                        onMouseEnter={e => {
                            e.target.style.backgroundColor = "rgba(30,41,59,0.9)";
                            e.target.style.transform = "translateX(-4px)";
                        }}
                        onMouseLeave={e => {
                            e.target.style.backgroundColor = "rgba(30,41,59,0.7)";
                            e.target.style.transform = "translateX(0)";
                        }}
                    >
                        {icons.arrow} Voltar
                    </button>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem 3rem" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "350px 1fr",
                    gap: "3rem",
                    marginBottom: "3rem"
                }}>
                    {/* Poster */}
                    {serie.poster_path && (
                        <div style={{
                            borderRadius: 20,
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                            position: "sticky",
                            top: "2rem",
                            height: "fit-content"
                        }}>
                            <img
                                src={`${IMAGE_BASE_URL}${serie.poster_path}`}
                                alt={serie.name}
                                style={{ width: "100%", display: "block" }}
                            />
                        </div>
                    )}

                    {/* Informações */}
                    <div>
                        <h1 style={{
                            fontSize: 48,
                            fontWeight: "800",
                            marginBottom: "1rem",
                            lineHeight: 1.2
                        }}>
                            {serie.name}
                        </h1>

                        {serie.tagline && (
                            <p style={{
                                fontSize: 18,
                                color: "#94a3b8",
                                fontStyle: "italic",
                                marginBottom: "1.5rem"
                            }}>
                                "{serie.tagline}"
                            </p>
                        )}

                        {/* Rating e info básica */}
                        <div style={{
                            display: "flex",
                            gap: "1.5rem",
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: "2rem"
                        }}>
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "0.5rem 1rem",
                                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                                borderRadius: 12,
                                fontWeight: "700",
                                fontSize: 18
                            }}>
                                {icons.star} {serie.vote_average?.toFixed(1) || "N/A"}
                            </div>

                            {serie.first_air_date && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8" }}>
                                    {icons.calendar} {new Date(serie.first_air_date).getFullYear()}
                                </div>
                            )}

                            {serie.number_of_seasons && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8" }}>
                                    {icons.tv} {serie.number_of_seasons} Temporada{serie.number_of_seasons > 1 ? 's' : ''}
                                </div>
                            )}

                            {serie.status && (
                                <div style={{
                                    padding: "0.4rem 0.8rem",
                                    background: serie.status === "Returning Series" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                                    color: serie.status === "Returning Series" ? "#22c55e" : "#ef4444",
                                    borderRadius: 8,
                                    fontSize: 14,
                                    fontWeight: "600"
                                }}>
                                    {serie.status}
                                </div>
                            )}
                        </div>

                        {/* Gêneros */}
                        {serie.genres && serie.genres.length > 0 && (
                            <div style={{ marginBottom: "2rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {serie.genres.map((g) => (
                                        <span key={g.id} style={{
                                            padding: "0.5rem 1rem",
                                            background: "rgba(139,92,246,0.2)",
                                            border: "1px solid rgba(139,92,246,0.3)",
                                            borderRadius: 20,
                                            fontSize: 14,
                                            color: "#c4b5fd"
                                        }}>
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sinopse */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: 24, fontWeight: "700", marginBottom: "1rem" }}>Sinopse</h2>
                            <p style={{
                                fontSize: 16,
                                lineHeight: 1.8,
                                color: "#cbd5e1"
                            }}>
                                {serie.overview || "Sem descrição disponível."}
                            </p>
                        </div>

                        {/* Detalhes adicionais */}
                        <div style={{
                            background: "rgba(30,41,59,0.4)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 16,
                            padding: "1.5rem",
                            border: "1px solid rgba(255,255,255,0.05)",
                            marginBottom: "2rem"
                        }}>
                            <h3 style={{ fontSize: 20, fontWeight: "700", marginBottom: "1rem" }}>Detalhes</h3>

                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                {serie.number_of_episodes && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120 }}>Episódios:</span>
                                        <span style={{ fontWeight: "600" }}>{serie.number_of_episodes}</span>
                                    </div>
                                )}

                                {serie.original_language && (
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120, display: "flex", alignItems: "center", gap: 8 }}>
                                            {icons.globe} Idioma:
                                        </span>
                                        <span style={{ fontWeight: "600" }}>{serie.original_language.toUpperCase()}</span>
                                    </div>
                                )}

                                {serie.networks && serie.networks.length > 0 && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120 }}>Rede:</span>
                                        <span style={{ fontWeight: "600" }}>{serie.networks.map(n => n.name).join(", ")}</span>
                                    </div>
                                )}

                                {serie.production_companies && serie.production_companies.length > 0 && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120 }}>Produtoras:</span>
                                        <span style={{ fontWeight: "600" }}>{serie.production_companies.slice(0, 3).map(p => p.name).join(", ")}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Elenco */}
                        {cast.length > 0 && (
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ fontSize: 24, fontWeight: "700", marginBottom: "1rem" }}>Elenco Principal</h3>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                                    gap: "1rem"
                                }}>
                                    {cast.map((actor) => (
                                        <div key={actor.id} style={{ textAlign: "center" }}>
                                            <div style={{
                                                width: "100%",
                                                height: 120,
                                                borderRadius: 12,
                                                overflow: "hidden",
                                                marginBottom: "0.5rem",
                                                background: "rgba(30,41,59,0.5)"
                                            }}>
                                                {actor.profile_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                        alt={actor.name}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 32,
                                                        color: "#475569"
                                                    }}>
                                                        👤
                                                    </div>
                                                )}
                                            </div>
                                            <p style={{ fontSize: 13, fontWeight: "600", marginBottom: 2 }}>{actor.name}</p>
                                            <p style={{ fontSize: 11, color: "#94a3b8" }}>{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trailer */}
                        {video && (
                            <div>
                                <h3 style={{ fontSize: 24, fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 12 }}>
                                    {icons.film} Trailer
                                </h3>
                                <div style={{
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
                                }}>
                                    <iframe
                                        width="100%"
                                        height="450"
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        title="Trailer"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeriesDetails;