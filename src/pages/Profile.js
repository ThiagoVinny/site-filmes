import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getFolders,
    createFolder,
    deleteFolder,
    getFolderSeries,
} from "../services/foldersService";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

const gradientBg =
    "radial-gradient(1200px 800px at 20% -10%, rgba(139,92,246,.25), transparent), radial-gradient(900px 500px at 80% 0%, rgba(236,72,153,.18), transparent), linear-gradient(135deg,#0f172a,#1e1b4b 50%,#0f172a)";

export default function Profile() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("perfil");
    const [profile, setProfile] = useState({
        displayName: user?.email?.split("@")[0] || "Cinéfilo",
        bio: "Amante de séries e clássicos da TV | Sempre buscando aquela joia escondida",
        stats: { filmes: 0, esteAno: 0, seguidores: 0, seguindo: 0 },
        folders: [],
    });

    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderDescription, setNewFolderDescription] = useState("");

    useEffect(() => {
        if (!user) return;

        async function load() {
            const folders = await getFolders();

            const fullFolders = await Promise.all(
                folders.map(async (f) => {
                    const items = await getFolderSeries(f.id);

                    // Buscar até 4 posters reais do TMDB
                    const posters = await Promise.all(
                        items.slice(0, 4).map(async (item) => {
                            try {
                                const r = await fetch(
                                    `https://api.themoviedb.org/3/tv/${item.tmdb_id}?api_key=ee4baf041aa87a38a21cb891835ae1ca&language=pt-BR`
                                );
                                const j = await r.json();
                                return j.poster_path || null;
                            } catch {
                                return null;
                            }
                        })
                    );

                    return {
                        ...f,
                        itemCount: items.length,
                        posters: posters.filter(Boolean),
                    };
                })
            );

            setProfile((prev) => ({ ...prev, folders: fullFolders }));
        }

        load();
    }, [user]);

    if (!user) return <Center text="Você precisa estar logado." />;

    async function handleCreateFolder(e) {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const res = await createFolder(newFolderName, newFolderDescription);
        if (res?.id) {
            setProfile((prev) => ({
                ...prev,
                folders: [{ ...res, itemCount: 0, posters: [] }, ...prev.folders],
            }));
            setNewFolderName("");
            setNewFolderDescription("");
        }
    }

    async function handleDeleteFolder(id) {
        await deleteFolder(id);
        setProfile((prev) => ({
            ...prev,
            folders: prev.folders.filter((f) => f.id !== id),
        }));
    }

    return (
        <div style={{ minHeight: "100vh", background: gradientBg, padding: "3rem 1rem" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <Header profile={profile} />

                {/* abas */}
                <div style={styles.tabRow}>
                    {["perfil", "avaliacoes", "assistidas"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                ...styles.tab,
                                ...(activeTab === tab ? styles.tabActive : {}),
                            }}
                        >
                            {tab === "perfil"
                                ? "Perfil"
                                : tab === "avaliacoes"
                                    ? "Avaliações"
                                    : "Assistidas"}
                        </button>
                    ))}
                </div>

                {activeTab === "perfil" && (
                    <section>
                        {/* form */}
                        <form onSubmit={handleCreateFolder} style={styles.form}>
                            <input
                                placeholder="Nome da pasta"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                style={styles.input}
                            />
                            <input
                                placeholder="Descrição (opcional)"
                                value={newFolderDescription}
                                onChange={(e) => setNewFolderDescription(e.target.value)}
                                style={styles.input}
                            />
                            <button style={styles.createBtn}>Criar pasta</button>
                        </form>

                        <div style={styles.grid}>
                            {profile.folders.map((folder) => (
                                <Link
                                    key={folder.id}
                                    to={`/folders/${folder.id}`}
                                    style={styles.folder}
                                >
                                    {/* GRID 2x2 de posters */}
                                    <div style={styles.posterGrid}>
                                        {folder.posters.length > 0 ? (
                                            folder.posters.slice(0, 4).map((p, i) => (
                                                <img
                                                    key={i}
                                                    src={`${IMAGE_BASE_URL}${p}`}
                                                    style={styles.poster}
                                                    alt=""
                                                />
                                            ))
                                        ) : (
                                            <div style={styles.noPosters}>Sem prévia</div>
                                        )}
                                    </div>

                                    <h3 style={styles.folderTitle}>{folder.name}</h3>

                                    {folder.description && (
                                        <p style={styles.folderDesc}>{folder.description}</p>
                                    )}

                                    <div style={styles.folderFooter}>
                                        <span>{folder.itemCount} itens</span>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteFolder(folder.id);
                                            }}
                                            style={styles.delete}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

function Center({ text }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f172a",
                color: "#fff",
            }}
        >
            {text}
        </div>
    );
}

function Header({ profile }) {
    return (
        <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={styles.avatar}>
                <div style={styles.avatarInner}>👤</div>
            </div>

            <h1 style={styles.name}>{profile.displayName}</h1>
            <p style={styles.bio}>{profile.bio}</p>

            <div style={styles.statsRow}>
                <Stat label="Filmes" value={profile.stats.filmes} />
                <Stat label="Este ano" value={profile.stats.esteAno} />
                <Stat label="Listas" value={profile.folders.length} />
                <Stat label="Seguidores" value={profile.stats.seguidores} />
                <Stat label="Seguindo" value={profile.stats.seguindo} />
            </div>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div style={{ minWidth: 80, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase" }}>
                {label}
            </div>
            <div style={{ fontSize: 18, marginTop: 4, color: "#e2e8f0" }}>{value}</div>
        </div>
    );
}

const styles = {
    avatar: {
        width: 115,
        height: 115,
        borderRadius: "50%",
        border: "3px solid #8b5cf6",
        margin: "0 auto 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInner: {
        width: 55,
        height: 55,
        borderRadius: "50%",
        border: "2px solid #9ca3af",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 30,
    },

    name: {
        fontSize: 32,
        fontWeight: 800,
        marginBottom: 6,
        background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    bio: { maxWidth: 550, margin: "0 auto", color: "#94a3b8", fontSize: 15 },

    statsRow: {
        display: "flex",
        justifyContent: "center",
        gap: 25,
        marginTop: 25,
        flexWrap: "wrap",
    },

    tabRow: {
        display: "inline-flex",
        gap: 8,
        background: "rgba(15,23,42,.6)",
        padding: 5,
        borderRadius: 999,
        marginBottom: 40,
    },
    tab: {
        border: "none",
        background: "transparent",
        padding: "8px 24px",
        borderRadius: 999,
        color: "#9ca3af",
        cursor: "pointer",
        transition: ".2s",
    },
    tabActive: {
        background: "#4f46e5",
        color: "#fff",
        boxShadow: "0 0 15px rgba(79,70,229,.5)",
    },

    form: {
        display: "flex",
        gap: 10,
        padding: 20,
        borderRadius: 16,
        background: "rgba(15,23,42,0.8)",
        marginBottom: 30,
        flexWrap: "wrap",
    },
    input: {
        flex: 1,
        height: 42,
        borderRadius: 10,
        border: "1px solid #374151",
        background: "rgba(15,23,42,.9)",
        padding: "0 14px",
        color: "#fff",
    },
    createBtn: {
        height: 42,
        padding: "0 16px",
        borderRadius: 10,
        border: "none",
        background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 20,
    },

    folder: {
        padding: 18,
        background: "rgba(15,23,42,.75)",
        borderRadius: 16,
        textDecoration: "none",
        color: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,.4)",
        transition: ".2s",
    },
    folderTitle: { margin: 0, fontSize: 18 },
    folderDesc: { margin: "6px 0 10px", color: "#9ca3af", fontSize: 14 },

    folderFooter: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        marginTop: 8,
        color: "#9ca3af",
    },

    delete: {
        background: "transparent",
        border: "none",
        color: "#f87171",
        cursor: "pointer",
    },

    posterGrid: {
        width: "100%",
        height: 120,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 4,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
        background: "rgba(255,255,255,0.04)",
    },
    poster: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    noPosters: {
        gridColumn: "1 / span 2",
        gridRow: "1 / span 2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: "#94a3b8",
    },
};
