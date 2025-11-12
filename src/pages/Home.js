import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = {
    poster: (p) =>
        p
            ? `https://image.tmdb.org/t/p/w500${p}`
            : "https://via.placeholder.com/500x750?text=Sem+Imagem",
    profile: (p) =>
        p
            ? `https://image.tmdb.org/t/p/w200${p}`
            : "https://via.placeholder.com/200x300?text=Sem+Foto",
};

const Icon = {
    star: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    ),
    calendar: (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    trophy: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2h12v5c0 3.31-2.69 6-6 6s-6-2.69-6-6V2zm-2 5H2v2c0 2.21 1.79 4 4 4h.17A7.98 7.98 0 0 1 6 11V7zm16 0h-2v4c0 .69-.09 1.36-.26 2H20c2.21 0 4-1.79 4-4V7h-2zm-8 8c-1.38 0-2.63-.56-3.54-1.47L6 16v6h12v-6l-2.46-2.47A4.98 4.98 0 0 1 12 15z" />
        </svg>
    ),
};

const ui = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(1200px 500px at 20% -10%, rgba(139,92,246,.25), transparent), radial-gradient(900px 400px at 80% 0%, rgba(236,72,153,.18), transparent), linear-gradient(135deg,#0f172a,#1e1b4b 50%,#0f172a)",
        color: "#fff",
        padding: "2rem 1.2rem",
    },
    title: {
        fontSize: 44,
        fontWeight: 800,
        background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 6,
    },
    subtitle: { color: "#94a3b8", fontSize: 16 },
    glass: {
        background: "rgba(17,25,40,.55)",
        border: "1px solid rgba(255,255,255,.06)",
        boxShadow: "0 12px 40px rgba(0,0,0,.35)",
        backdropFilter: "blur(10px)",
        borderRadius: 16,
    },
    chip: {
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(10px)",
        borderRadius: 8,
        padding: "4px 10px",
        display: "flex",
        alignItems: "center",
        gap: 4,
        color: "#fbbf24",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
        gap: 24,
    },
    btn: (grad) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "1rem 2rem",
        background: grad,
        color: "#fff",
        borderRadius: 14,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 16,
        transition: "all .25s",
        boxShadow: "0 10px 28px rgba(0,0,0,.25)",
    }),
};

const fetchJSON = async (url) => {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Erro na requisição");
    return r.json();
};

const Loading = ({ text = "Carregando..." }) => (
    <div
        style={{
            display: "grid",
            placeItems: "center",
            padding: "4rem 0",
            color: "#94a3b8",
        }}
    >
        <div
            style={{
                width: 46,
                height: 46,
                border: "4px solid rgba(139,92,246,.25)",
                borderTopColor: "#8b5cf6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
            }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ marginTop: 14 }}>{text}</p>
    </div>
);

const SeriesCard = ({ s }) => {
    const year = s.first_air_date
        ? new Date(s.first_air_date).getFullYear()
        : "N/A";
    const rating = s.vote_average ? s.vote_average.toFixed(1) : "N/A";
    return (
        <Link to={`/series/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
                style={{
                    ...ui.glass,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform .25s, box-shadow .25s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                        "0 20px 44px rgba(139,92,246,.35)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = ui.glass.boxShadow;
                }}
            >
                <div style={{ position: "relative" }}>
                    <img
                        src={IMG.poster(s.poster_path)}
                        alt={s.name || "Série"}
                        style={{
                            width: "100%",
                            height: 340,
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                    <div style={{ position: "absolute", top: 10, right: 10, ...ui.chip }}>
                        {Icon.star}
                        <b>{rating}</b>
                    </div>
                </div>
                <div style={{ padding: 14 }}>
                    <h3
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            lineHeight: 1.35,
                            marginBottom: 8,
                            height: 44,
                            overflow: "hidden",
                        }}
                    >
                        {s.name}
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            color: "#94a3b8",
                            fontSize: 14,
                        }}
                    >
                        {Icon.calendar}
                        <span>{year}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const AtoresDestaque = () => {
    const [itens, setItens] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoad(true);
                const data = await fetchJSON(
                    `${BASE_URL}/person/popular?api_key=${API_KEY}&language=pt-BR&page=1`
                );
                setItens((data.results || []).slice(0, 12));
            } finally {
                setLoad(false);
            }
        })();
    }, []);

    if (load) return <Loading text="Carregando atores..." />;

    return (
        <div
            style={{
                display: "flex",
                gap: 14,
                overflowX: "auto",
                overflowY: "hidden",
                padding: "6px 2px",
                marginBottom: 40,
                scrollbarWidth: "thin",
                scrollbarColor: "#8b5cf6 rgba(255,255,255,.08)",
            }}
        >
            {itens.map((a) => (
                <div
                    key={a.id}
                    style={{
                        ...ui.glass,
                        width: 150,
                        flex: "0 0 auto",
                        overflow: "hidden",
                        transition: "transform .25s, box-shadow .25s",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                            "0 14px 40px rgba(236,72,153,.35)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = ui.glass.boxShadow;
                    }}
                >
                    <img
                        src={IMG.profile(a.profile_path)}
                        alt={a.name}
                        style={{ width: "100%", height: 210, objectFit: "cover" }}
                    />
                    <div style={{ padding: 10 }}>
                        <p
                            style={{
                                fontWeight: 700,
                                fontSize: 14,
                                textAlign: "center",
                                height: 38,
                                display: "grid",
                                placeItems: "center",
                            }}
                        >
                            {a.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
                            {a.known_for_department || "Acting"}
                        </p>
                        <p
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                color: "#fbbf24",
                                marginTop: 6,
                            }}
                        >
                            {Icon.star}
                            {a.popularity.toFixed(1)}
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
    const [err, setErr] = useState("");

    const fetchPopular = async () => {
        try {
            setLoading(true);
            const pages = await Promise.all(
                [1, 2].map((p) =>
                    fetchJSON(
                        `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${p}`
                    )
                )
            );
            const all = pages.flatMap((d) => d.results || []).slice(0, 50);
            setSeries(all);
            setErr("");
        } catch {
            setSeries([]);
            setErr("Erro ao carregar séries.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopular();
    }, []);

    const handleSearch = async (query) => {
        if (!query) return fetchPopular();
        try {
            setLoading(true);
            const data = await fetchJSON(
                `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
                    query
                )}`
            );
            setSeries(data.results || []);
            setErr("");
        } catch {
            setSeries([]);
            setErr("Erro na busca.");
        } finally {
            setLoading(false);
        }
    };

    const header = useMemo(
        () => (
            <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h1 style={ui.title}>🎬 Cinefy</h1>
                <p style={ui.subtitle}>Descubra as melhores séries do momento</p>
            </div>
        ),
        []
    );

    return (
        <div style={ui.page}>
            {header}

            {/* Barra de busca compacta e centralizada */}
            <SearchBar onSearch={handleSearch} />

            <section style={{ margin: "0 auto 54px", maxWidth: 1400 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <h2
                        style={{
                            fontSize: 26,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        ✨ Atores em Destaque
                    </h2>
                </div>
                <AtoresDestaque />
            </section>

            <div style={{ textAlign: "center", marginBottom: 56 }}>
                <Link
                    to="/ranking"
                    style={ui.btn("linear-gradient(135deg,#f59e0b,#ef4444)")}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                    }
                >
                    {Icon.trophy} Ver Ranking Top 10
                </Link>
            </div>

            <section style={{ maxWidth: 1400, margin: "0 auto" }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 22 }}>
                    🔥 Séries Populares
                </h2>
                {loading ? (
                    <Loading text="Carregando séries..." />
                ) : err ? (
                    <p style={{ textAlign: "center", color: "#ef4444", fontSize: 18 }}>
                        {err}
                    </p>
                ) : (
                    <div style={ui.grid}>
                        {series.map((s) => (
                            <SeriesCard key={s.id} s={s} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
