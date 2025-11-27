// src/pages/SeriesDetails.js
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import commentService from "../services/commentService";

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
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
        </svg>
    ),
    globe: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    film: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
    ),
    arrow: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    ),
};

const SeriesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Estados da série
    const [serie, setSerie] = useState(null);
    const [cast, setCast] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados dos comentários
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentText, setCommentText] = useState("");

    // Edição de comentário
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // 🆕 estados para avaliação
    const [rating, setRating] = useState(0);          // 1 a 5
    const [watchedAt, setWatchedAt] = useState("");  // yyyy-mm-dd (input date)

    // 🆕 Estado para o botão de "Assistido"
    const [isWatched, setIsWatched] = useState(false);
    const [loadingWatched, setLoadingWatched] = useState(false);

    // 🆕 Controle visual dos spoilers
    const [revealedSpoilers, setRevealedSpoilers] = useState({});

    const toggleSpoiler = (id) => {
        setRevealedSpoilers(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    // 🆕 Estado para controlar o "Ver mais" de textos longos
    const [expandedComments, setExpandedComments] = useState({});

    // 🆕 USEEFFECT: Verifica se o usuário já assistiu
    useEffect(() => {
        const checkWatchedStatus = async () => {
            // Se não tiver usuário logado ou não tiver ID da série, não faz nada
            if (!user || !id) return;

            try {
                const response = await fetch(`http://localhost:4000/watched/check/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsWatched(data); // true ou false
                }
            } catch (err) {
                console.error("Erro ao verificar status de assistido:", err);
            }
        };

        checkWatchedStatus();
    }, [id, user]);

    // 🆕 FUNÇÃO DO CLIQUE NO BOTÃO
    const handleWatchToggle = async () => {
        if (!user) {
            alert("Você precisa estar logado para salvar séries!");
            return;
        }

        setLoadingWatched(true);

        try {
            const headers = {
                "Content-Type": "application/json"
            };

            if (isWatched) {
                // --> REMOVER
                await fetch(`http://localhost:4000/watched/remove/${id}`, {
                    method: "DELETE",
                    headers: headers,
                    credentials: "include"
                });
                setIsWatched(false);
            } else {
                // --> ADICIONAR
                await fetch("http://localhost:4000/watched/add", {
                    method: "POST",
                    headers: headers,
                    credentials: "include",
                    body: JSON.stringify({
                        series_id: id,
                        title: serie.name,
                        poster_path: serie.poster_path
                    })
                });
                setIsWatched(true);
            }
        } catch (error) {
            console.error("Erro ao atualizar lista:", error);
            alert("Erro ao salvar. Verifique se você está logado.");
        } finally {
            setLoadingWatched(false);
        }
    };

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

        const fetchComments = async () => {
            try {
                const result = await commentService.getBySeries(id);
                setComments(result);
            } catch (err) {
                console.error("Erro ao carregar comentários:", err);
            } finally {
                setLoadingComments(false);
            }
        };

        fetchDetails();
        fetchComments();
    }, [id]);

    async function handleSubmitComment(e) {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await commentService.create(
                id,
                commentText,
                rating || null,
                watchedAt || null,
                serie.name
            );

            // limpa campos
            setCommentText("");
            setRating(0);
            setWatchedAt("");

            // recarrega lista
            const updated = await commentService.getBySeries(id);
            setComments(updated);
        } catch (err) {
            console.error("Erro ao enviar comentário:", err);
        }
    }


    async function handleSaveEdit(commentId) {
        if (!editingText.trim()) return;

        try {
            await commentService.update(commentId, editingText);
            const updated = await commentService.getBySeries(id);
            setComments(updated);
            setEditingId(null);
            setEditingText("");
        } catch (err) {
            console.error("Erro ao editar comentário:", err);
        }
    }

    async function handleDelete(commentId) {
        try {
            await commentService.remove(commentId);
            const updated = await commentService.getBySeries(id);
            setComments(updated);
        } catch (err) {
            console.error("Erro ao excluir comentário:", err);
        }
    }

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
            {/* HEADER COM BACKDROP */}
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
                    >
                        {icons.arrow} Voltar
                    </button>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
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

                    {/* Informações da série */}
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

                        {/* Rating + Info básica */}
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
                                    {icons.tv} {serie.number_of_seasons} Temporada
                                    {serie.number_of_seasons > 1 ? "s" : ""}
                                </div>
                            )}

                            {serie.status && (
                                <div style={{
                                    padding: "0.4rem 0.8rem",
                                    background:
                                        serie.status === "Returning Series"
                                            ? "rgba(34,197,94,0.2)"
                                            : "rgba(239,68,68,0.2)",
                                    color:
                                        serie.status === "Returning Series"
                                            ? "#22c55e"
                                            : "#ef4444",
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

                        {/* Botão de Adicionar serie */}
                        <div style={{ marginBottom: "2rem" }}>
                            <button
                                onClick={handleWatchToggle}
                                disabled={loadingWatched}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    border: "none",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: loadingWatched ? "wait" : "pointer",
                                    transition: "all 0.2s ease",
                                    // Lógica de Cores:
                                    backgroundColor: isWatched ? "#22c55e" : "#8b5cf6",
                                    color: "white",
                                    boxShadow: isWatched
                                        ? "0 0 15px rgba(34, 197, 94, 0.4)"
                                        : "0 4px 15px rgba(139, 92, 246, 0.4)",
                                    opacity: loadingWatched ? 0.7 : 1
                                }}
                            >
                                {loadingWatched ? (
                                    <span>⏳ Salvando...</span>
                                ) : isWatched ? (
                                    <>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Assistida
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Marcar como Assistida
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Sinopse */}
                        <div style={{ marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: 24, fontWeight: "700", marginBottom: "1rem" }}>
                                Sinopse
                            </h2>
                            <p style={{
                                fontSize: 16,
                                lineHeight: 1.8,
                                color: "#cbd5e1"
                            }}>
                                {serie.overview || "Sem descrição disponível."}
                            </p>
                        </div>

                        {/* Detalhes */}
                        <div style={{
                            background: "rgba(30,41,59,0.4)",
                            backdropFilter: "blur(10px)",
                            borderRadius: 16,
                            padding: "1.5rem",
                            border: "1px solid rgba(255,255,255,0.05)",
                            marginBottom: "2rem"
                        }}>
                            <h3 style={{ fontSize: 20, fontWeight: "700", marginBottom: "1rem" }}>
                                Detalhes
                            </h3>

                            <div style={{ display: "grid", gap: "0.75rem" }}>
                                {serie.number_of_episodes && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120 }}>Episódios:</span>
                                        <span style={{ fontWeight: "600" }}>{serie.number_of_episodes}</span>
                                    </div>
                                )}

                                {serie.original_language && (
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        <span style={{
                                            color: "#94a3b8",
                                            minWidth: 120,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8
                                        }}>
                                            {icons.globe} Idioma:
                                        </span>
                                        <span style={{ fontWeight: "600" }}>
                                            {serie.original_language.toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {serie.networks && serie.networks.length > 0 && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120 }}>Rede:</span>
                                        <span style={{ fontWeight: "600" }}>
                                            {serie.networks.map((n) => n.name).join(", ")}
                                        </span>
                                    </div>
                                )}

                                {serie.production_companies && serie.production_companies.length > 0 && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <span style={{ color: "#94a3b8", minWidth: 120 }}>Produtoras:</span>
                                        <span style={{ fontWeight: "600" }}>
                                            {serie.production_companies.slice(0, 3).map((p) => p.name).join(", ")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Elenco */}
                        {cast.length > 0 && (
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{
                                    fontSize: 24,
                                    fontWeight: "700",
                                    marginBottom: "1rem"
                                }}>
                                    Elenco Principal
                                </h3>

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
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
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
                                            <p style={{
                                                fontSize: 13,
                                                fontWeight: "600",
                                                marginBottom: 2
                                            }}>
                                                {actor.name}
                                            </p>
                                            <p style={{ fontSize: 11, color: "#94a3b8" }}>
                                                {actor.character}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trailer */}
                        {video && (
                            <div>
                                <h3 style={{
                                    fontSize: 24,
                                    fontWeight: "700",
                                    marginBottom: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12
                                }}>
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

                {/* COMENTÁRIOS */}
                <div style={{ marginTop: "3rem" }}>
                    <h2 style={{ fontSize: 24, fontWeight: "700", marginBottom: "1rem" }}>
                        Comentários da comunidade
                    </h2>

                    {user ? (
                        <form onSubmit={handleSubmitComment} style={{ marginBottom: "2rem" }}>
                            {/* textarea do comentário */}
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Escreva sua avaliação sobre a série..."
                                style={{
                                    width: "100%",
                                    height: "120px",
                                    padding: "1rem",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "rgba(30,41,59,0.3)",
                                    color: "#fff",
                                    fontSize: 16,
                                    marginBottom: "0.75rem",
                                }}
                            />

                            {/* linha com rating + data assistida */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "1rem",
                                    alignItems: "center",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                {/* seletor de nota */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: "#cbd5e1", fontSize: 14 }}>Sua nota:</span>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setRating(n)}
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: "999px",
                                                    border:
                                                        rating === n
                                                            ? "2px solid #facc15"
                                                            : "1px solid rgba(148,163,184,0.6)",
                                                    background:
                                                        rating === n
                                                            ? "rgba(250,204,21,0.15)"
                                                            : "transparent",
                                                    color: rating === n ? "#fde68a" : "#e5e7eb",
                                                    fontSize: 13,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* data que assistiu */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: "#cbd5e1", fontSize: 14 }}>Visto em:</span>
                                    <input
                                        type="date"
                                        value={watchedAt}
                                        onChange={(e) => setWatchedAt(e.target.value)}
                                        style={{
                                            height: 32,
                                            borderRadius: 8,
                                            border: "1px solid rgba(148,163,184,0.6)",
                                            background: "rgba(15,23,42,0.9)",
                                            color: "#e5e7eb",
                                            padding: "0 0.5rem",
                                            fontSize: 13,
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                    border: "none",
                                    borderRadius: 12,
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Enviar avaliação
                            </button>
                        </form>
                    ) : (
                        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
                            Faça login para deixar sua avaliação.
                        </p>
                    )}


                    {loadingComments ? (
                        <p style={{ color: "#94a3b8" }}>Carregando comentários...</p>
                    ) : comments.length === 0 ? (
                        <p style={{ color: "#94a3b8" }}>
                            Nenhum comentário ainda. Seja o primeiro!
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {comments.map((c) => {
                                // Variáveis de apoio
                                const isSpoiler = c.is_spoiler;
                                const isRevealed = revealedSpoilers[c.id];
                                const isEditing = editingId === c.id;

                                // Lógica do texto longo
                                const fullText = c.content || "";
                                const isLong = fullText.length > 220;
                                const isExpanded = expandedComments[c.id];
                                const textToShow = isExpanded || !isLong ? fullText : fullText.slice(0, 220) + "…";

                                return (
                                    <div key={c.id} style={{
                                        background: "rgba(30,41,59,0.6)",
                                        padding: "1rem",
                                        borderRadius: 12,
                                        border: "1px solid rgba(255,255,255,0.1)",
                                    }}>
                                        {/* Cabeçalho do Comentário */}
                                        <p style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>
                                            <strong>{c.user_name || "Usuário"}</strong>
                                        </p>

                                        {/* ⚠️ ÁREA DE PROTEÇÃO DE SPOILER */}
                                        {isSpoiler && !isRevealed ? (
                                            <div style={{
                                                background: "rgba(15, 23, 42, 0.8)",
                                                border: "1px dashed #ef4444",
                                                borderRadius: 8,
                                                padding: "1.5rem",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 10,
                                                textAlign: "center"
                                            }}>
                                                <span style={{ fontSize: 24 }}>🙈</span>
                                                <div style={{ color: "#ef4444", fontWeight: "bold" }}>
                                                    Alerta de Spoiler detectado
                                                </div>
                                                <button
                                                    onClick={() => toggleSpoiler(c.id)}
                                                    style={{
                                                        background: "transparent",
                                                        border: "1px solid #94a3b8",
                                                        color: "#cbd5e1",
                                                        padding: "6px 16px",
                                                        borderRadius: 6,
                                                        cursor: "pointer",
                                                        fontSize: 13,
                                                        marginTop: 5
                                                    }}
                                                >
                                                    Ver comentário mesmo assim
                                                </button>
                                            </div>
                                        ) : (
                                            /* ✅ CONTEÚDO NORMAL (Texto ou Edição) */
                                            <>
                                                {isEditing ? (
                                                    <>
                                                        <textarea
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                            style={{ width: "100%", padding: 10, borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid #333", marginBottom: 10, minHeight: 80 }}
                                                        />
                                                        <div style={{ display: "flex", gap: 10 }}>
                                                            <button onClick={() => handleSaveEdit(c.id)} style={{ background: "#22c55e", padding: "6px 14px", borderRadius: 8, color: "#fff", border: "none", cursor: "pointer" }}>Salvar</button>
                                                            <button onClick={() => { setEditingId(null); setEditingText(""); }} style={{ background: "#ef4444", padding: "6px 14px", borderRadius: 8, color: "#fff", border: "none", cursor: "pointer" }}>Cancelar</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p style={{ color: "#e2e8f0", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{textToShow}</p>

                                                        {isLong && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setExpandedComments(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                                                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#60a5fa", fontSize: 13, marginTop: 4 }}
                                                            >
                                                                {isExpanded ? "Ver menos" : "Ver mais"}
                                                            </button>
                                                        )}

                                                        {/* Botões de Ação (Só para o dono) */}
                                                        {user?.id === c.user_id && (
                                                            <div style={{ marginTop: 14, display: "flex", gap: 12, fontSize: 13 }}>
                                                                <button
                                                                    onClick={() => { setEditingId(c.id); setEditingText(c.content); }}
                                                                    style={{ background: "none", border: "none", color: "#c4b5fd", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(c.id)}
                                                                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeriesDetails;
