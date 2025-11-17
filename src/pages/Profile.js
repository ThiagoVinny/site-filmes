// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import commentService from "../services/commentService";
import {
    getFolders,
    createFolder,
    deleteFolder,
    getFolderSeries,
} from "../services/foldersService";

const gradientBg =
    "radial-gradient(1200px 800px at 20% -10%, rgba(139,92,246,.25), transparent), radial-gradient(900px 500px at 80% 0%, rgba(236,72,153,.18), transparent), linear-gradient(135deg,#0f172a,#1e1b4b 50%,#0f172a)";

// mesma API usada em SeriesDetails
const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

export default function Profile() {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("perfil");

    const [profile, setProfile] = useState({
        displayName: user?.email?.split("@")[0] || "Cinéfilo",
        bio: "Amante de séries e clássicos da TV | Sempre buscando aquela joia escondida",
        stats: { filmes: 0, esteAno: 0, seguidores: 0, seguindo: 0 },
        folders: [],
    });

    // comentários do usuário
    const [userComments, setUserComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);

    // mapa de séries por id (para pegar poster, nome, ano)
    const [seriesMap, setSeriesMap] = useState({});
    const [loadingSeries, setLoadingSeries] = useState(false);

    // quais comentários estão “expandido” (ver mais)
    const [expandedComments, setExpandedComments] = useState({});

    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderDescription, setNewFolderDescription] = useState("");

    // estado de edição de comentário
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        if (!user) return;

        async function load() {
            try {
                // carregar pastas
                const folders = await getFolders();
                const foldersWithCounts = await Promise.all(
                    folders.map(async (f) => {
                        const items = await getFolderSeries(f.id);
                        return { ...f, itemCount: items.length };
                    })
                );

                setProfile((prev) => ({ ...prev, folders: foldersWithCounts }));

                // carregar comentários do usuário
                if (!user?.id) return;

                const comments = await commentService.getByUser(user.id);
                setUserComments(comments);
            } catch (err) {
                console.error("Erro ao carregar dados do perfil:", err);
            } finally {
                setLoadingComments(false);
            }
        }

        load();
    }, [user]);

    // buscar detalhes das séries para cada comentário (titulo, ano, poster)
    useEffect(() => {
        async function loadSeriesDetails() {
            if (userComments.length === 0) return;

            setLoadingSeries(true);
            try {
                const uniqueIds = [
                    ...new Set(userComments.map((c) => c.series_id).filter(Boolean)),
                ];

                const map = { ...seriesMap };

                for (const id of uniqueIds) {
                    if (map[id]) continue; // já temos

                    try {
                        const res = await fetch(
                            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=pt-BR`
                        );
                        if (!res.ok) continue;
                        const data = await res.json();
                        map[id] = data;
                    } catch (err) {
                        console.error("Erro ao carregar série", id, err);
                    }
                }

                setSeriesMap(map);
            } finally {
                setLoadingSeries(false);
            }
        }

        loadSeriesDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userComments]);

    if (!user) return <Center text="Você precisa estar logado." />;

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const res = await createFolder(newFolderName, newFolderDescription);
        if (res?.id) {
            setProfile((prev) => ({
                ...prev,
                folders: [{ ...res, itemCount: 0 }, ...prev.folders],
            }));
            setNewFolderName("");
            setNewFolderDescription("");
        }
    };

    const handleDeleteFolder = async (id) => {
        await deleteFolder(id);
        setProfile((prev) => ({
            ...prev,
            folders: prev.folders.filter((f) => f.id !== id),
        }));
    };

    const toggleExpand = (id) => {
        setExpandedComments((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const formatFullDate = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return null;

        return d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div style={{ minHeight: "100vh", background: gradientBg, padding: "3rem 1rem" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <Header profile={profile} />

                {/* Tabs */}
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
                                    : "Séries assistidas"}
                        </button>
                    ))}
                </div>

                {/* PERFIL */}
                {activeTab === "perfil" && (
                    <section>
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

                {/* AVALIAÇÕES */}
                {activeTab === "avaliacoes" && (
                    <section style={{ padding: 20 }}>
                        <h2
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#c3c9d1",
                                marginBottom: 20,
                            }}
                        >
                            Minhas avaliações
                        </h2>

                        {loadingComments || loadingSeries ? (
                            <p style={{ color: "#94a3b8" }}>Carregando avaliações…</p>
                        ) : userComments.length === 0 ? (
                            <p style={{ color: "#94a3b8" }}>
                                Você ainda não fez nenhuma avaliação.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 20,
                                }}
                            >
                                {userComments.map((c) => {
                                    const serie = seriesMap[c.series_id];
                                    const title = serie?.name || "Série desconhecida";
                                    const year = serie?.first_air_date
                                        ? new Date(serie.first_air_date).getFullYear()
                                        : null;
                                    const posterUrl = serie?.poster_path
                                        ? `${IMAGE_BASE_URL}${serie.poster_path}`
                                        : null;

                                    const rating = c.rating || null;
                                    const dateToShow = c.watched_at || c.created_at;
                                    const formattedDate = formatFullDate(dateToShow);

                                    const isExpanded = !!expandedComments[c.id];
                                    const maxLen = 220;
                                    const fullText = c.content || "";
                                    const isLong = fullText.length > maxLen;
                                    const textToShow =
                                        isExpanded || !isLong
                                            ? fullText
                                            : fullText.slice(0, maxLen) + "…";

                                    const isEditing = editingId === c.id;

                                    return (
                                        <div
                                            key={c.id}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "120px 1fr",
                                                gap: 18,
                                                background: "rgba(15,23,42,.9)",
                                                borderRadius: 18,
                                                padding: 16,
                                                border: "1px solid rgba(148,163,184,.35)",
                                                boxShadow: "0 18px 40px rgba(15,23,42,.9)",
                                            }}
                                        >
                                            {/* Poster */}
                                            <div
                                                style={{
                                                    borderRadius: 14,
                                                    overflow: "hidden",
                                                    background: "rgba(15,23,42,0.9)",
                                                    border: "1px solid rgba(30,64,175,0.8)",
                                                }}
                                            >
                                                {posterUrl ? (
                                                    <img
                                                        src={posterUrl}
                                                        alt={title}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            paddingTop: "150%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "#64748b",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        Sem imagem
                                                    </div>
                                                )}
                                            </div>

                                            {/* Conteúdo da avaliação */}
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                {/* Linha título + rating */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        gap: 12,
                                                        marginBottom: 6,
                                                    }}
                                                >
                                                    <div>
                                                        <Link
                                                            to={`/series/${c.series_id}`}
                                                            style={{
                                                                textDecoration: "none",
                                                                color: "#e5e7eb",
                                                            }}
                                                        >
                                                            <h3
                                                                style={{
                                                                    margin: 0,
                                                                    fontSize: 18,
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {title}
                                                            </h3>
                                                        </Link>
                                                        {year && (
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    marginTop: 2,
                                                                    fontSize: 13,
                                                                    color: "#9ca3af",
                                                                }}
                                                            >
                                                                {year}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {rating && (
                                                        <div
                                                            style={{
                                                                alignSelf: "flex-start",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                gap: 6,
                                                                minWidth: 64,
                                                                padding: "0.35rem 0.9rem",
                                                                borderRadius: 999,
                                                                background:
                                                                    "linear-gradient(135deg,#facc15,#f97316)",
                                                                color: "#111827",
                                                                fontWeight: 700,
                                                                fontSize: 14,
                                                                boxShadow:
                                                                    "0 0 18px rgba(250,204,21,0.65)",
                                                            }}
                                                        >
                                                            <span style={{ fontSize: 15 }}>★</span>
                                                            <span>{rating}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Texto ou modo edição */}
                                                {isEditing ? (
                                                    <>
                                                        <textarea
                                                            value={editingText}
                                                            onChange={(e) =>
                                                                setEditingText(e.target.value)
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                minHeight: "120px",
                                                                padding: "12px",
                                                                borderRadius: "10px",
                                                                background:
                                                                    "rgba(15,23,42,0.9)",
                                                                color: "#fff",
                                                                border:
                                                                    "1px solid rgba(255,255,255,0.2)",
                                                                marginBottom: "12px",
                                                                resize: "vertical",
                                                                fontSize: 15,
                                                                lineHeight: 1.5,
                                                            }}
                                                        />

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: 12,
                                                                marginBottom: 4,
                                                            }}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    try {
                                                                        await commentService.update(
                                                                            c.id,
                                                                            editingText
                                                                        );
                                                                        setUserComments((prev) =>
                                                                            prev.map((item) =>
                                                                                item.id === c.id
                                                                                    ? {
                                                                                        ...item,
                                                                                        content:
                                                                                        editingText,
                                                                                    }
                                                                                    : item
                                                                            )
                                                                        );
                                                                        setEditingId(null);
                                                                    } catch (err) {
                                                                        console.error(
                                                                            "Erro ao salvar edição:",
                                                                            err
                                                                        );
                                                                        alert(
                                                                            err.message ||
                                                                            "Erro ao salvar edição"
                                                                        );
                                                                    }
                                                                }}
                                                                style={{
                                                                    background: "#22c55e",
                                                                    padding: "8px 18px",
                                                                    borderRadius: 8,
                                                                    color: "#fff",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                Salvar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingId(null);
                                                                    setEditingText("");
                                                                }}
                                                                style={{
                                                                    background: "#ef4444",
                                                                    padding: "8px 18px",
                                                                    borderRadius: 8,
                                                                    color: "#fff",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p
                                                            style={{
                                                                marginTop: 8,
                                                                marginBottom: 6,
                                                                fontSize: 14,
                                                                lineHeight: 1.7,
                                                                color: "#e2e8f0",
                                                            }}
                                                        >
                                                            {textToShow}
                                                        </p>

                                                        {/* Ver mais / menos */}
                                                        {isLong && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleExpand(c.id)
                                                                }
                                                                style={{
                                                                    background: "none",
                                                                    border: "none",
                                                                    padding: 0,
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize: 13,
                                                                        color: "#60a5fa",
                                                                    }}
                                                                >
                                                                    {isExpanded
                                                                        ? "Ver menos"
                                                                        : "Ver mais"}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                                {/* Rodapé da avaliação */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        marginTop: 14,
                                                        fontSize: 13,
                                                        color: "#94a3b8",
                                                    }}
                                                >
                                                    {/* Data */}
                                                    <div>
                                                        {formattedDate && (
                                                            <span>
                                                                Visto em {formattedDate}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Botões editar / excluir */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 14,
                                                        }}
                                                    >
                                                        {/* Editar */}
                                                        {!isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingId(c.id);
                                                                    setEditingText(c.content || "");
                                                                }}
                                                                style={{
                                                                    background: "none",
                                                                    border: "none",
                                                                    color: "#60a5fa",
                                                                    cursor: "pointer",
                                                                    fontSize: 13,
                                                                    textDecoration: "underline",
                                                                }}
                                                            >
                                                                Editar
                                                            </button>
                                                        )}

                                                        {/* Remover */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    !window.confirm(
                                                                        "Deseja realmente excluir este comentário?"
                                                                    )
                                                                )
                                                                    return;

                                                                commentService
                                                                    .remove(c.id)
                                                                    .then(() => {
                                                                        setUserComments((prev) =>
                                                                            prev.filter(
                                                                                (item) =>
                                                                                    item.id !== c.id
                                                                            )
                                                                        );
                                                                    })
                                                                    .catch((err) => {
                                                                        console.error(
                                                                            "Erro ao excluir comentário:",
                                                                            err
                                                                        );
                                                                        alert(
                                                                            err.message ||
                                                                            "Erro ao excluir comentário"
                                                                        );
                                                                    });
                                                            }}
                                                            style={{
                                                                background: "none",
                                                                border: "none",
                                                                color: "#f87171",
                                                                cursor: "pointer",
                                                                fontSize: 13,
                                                                textDecoration: "underline",
                                                            }}
                                                        >
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {/* ASSISTIDAS — placeholder por enquanto */}
                {activeTab === "assistidas" && (
                    <section style={{ padding: 20 }}>
                        <p style={{ color: "#94a3b8" }}>
                            Em breve: suas séries marcadas como assistidas.
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}

/* COMPONENTES SIMPLES */
function Center({ text }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
                background: "#0f172a",
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
            <div
                style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </div>
            <div style={{ fontSize: 18, marginTop: 4 }}>{value}</div>
        </div>
    );
}

/* 🎨 ESTILOS */
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
        color: "#c3c9d1",
    },
    bio: {
        maxWidth: 550,
        margin: "0 auto",
        color: "#94a3b8",
        fontSize: 15,
    },
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
        color: "#9ca3af",
    },
    delete: {
        background: "transparent",
        border: "none",
        color: "#f87171",
        cursor: "pointer",
    },
};
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
