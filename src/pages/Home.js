import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SeriesCard from "../components/SeriesCard";
import AtoresDestaque from "./AtoresDestaque";
import AddToFolderModal from "../components/AddToFolderModal";
import { getFolders, addSerieToFolder } from "../services/foldersService"; // ✅ importa o service

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";

const Icon = {
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

export default function Home() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [folders, setFolders] = useState([]);
    const [selectedSerie, setSelectedSerie] = useState(null);

    // 🔹 Busca de séries populares
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

    // 🔹 Busca as pastas do usuário
    useEffect(() => {
        getFolders()
            .then(setFolders)
            .catch((err) => console.error("Erro ao carregar pastas:", err));
    }, []);

    // 🔹 Busca personalizada
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

    // 🔹 Adiciona série à pasta
    const handleAddToFolder = async (folder) => {
        if (!selectedSerie) return;

        try {
            await addSerieToFolder(folder.id, selectedSerie.id, "tv");
            alert(`✅ Série adicionada em "${folder.name}" com sucesso!`);
        } catch (err) {
            console.error("Erro ao adicionar série:", err);
            alert("❌ Erro ao adicionar série à pasta.");
        } finally {
            setSelectedSerie(null);
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
                            <SeriesCard
                                key={s.id}
                                data={s}
                                basePath="/series"
                                onAddToFolder={() => setSelectedSerie(s)} // ✅ passa série clicada
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 🔹 Modal para escolher a pasta */}
            {selectedSerie && (
                <AddToFolderModal
                    serie={selectedSerie}
                    onSelectFolder={handleAddToFolder}
                    onClose={() => setSelectedSerie(null)}
                />
            )}
        </div>
    );
}