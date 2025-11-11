import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getFolders, createFolder, deleteFolder } from "../services/foldersService";

const createInitialProfile = (user) => {
    const baseName = user?.email ? user.email.split("@")[0] : "Cinéfilo";
    return {
        displayName: baseName,
        bio: "Amante de séries e clássicos da TV | Sempre buscando aquela joia escondida",
        stats: {
            filmes: 0,
            esteAno: 0,
            seguidores: 0,
            seguindo: 0,
        },
        folders: [],
    };
};

export default function Profile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("perfil");
    const [profile, setProfile] = useState(() => createInitialProfile(user));
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderDescription, setNewFolderDescription] = useState("");

    useEffect(() => {
        if (!user) return;
        async function loadFolders() {
            try {
                const data = await getFolders();
                setProfile((prev) => ({
                    ...prev,
                    folders: data,
                }));
            } catch (err) {
                console.error("Erro ao carregar pastas:", err);
            }
        }
        loadFolders();
    }, [user]);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        const name = newFolderName.trim();
        if (!name) return;
        try {
            const newFolder = await createFolder(name, newFolderDescription);
            setProfile((prev) => ({
                ...prev,
                folders: [newFolder, ...prev.folders],
            }));
            setNewFolderName("");
            setNewFolderDescription("");
        } catch (err) {
            console.error("Erro ao criar pasta:", err);
        }
    };

    const handleDeleteFolder = async (id) => {
        try {
            await deleteFolder(id);
            setProfile((prev) => ({
                ...prev,
                folders: prev.folders.filter((f) => f.id !== id),
            }));
        } catch (err) {
            console.error("Erro ao deletar pasta:", err);
        }
    };

    if (!user) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "radial-gradient(circle at top, #1f2937 0, #020617 55%)",
                    color: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                }}
            >
                <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
                    Você precisa estar logado para acessar o perfil.
                </p>
            </div>
        );
    }

    const listsCount = profile.folders.length;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "radial-gradient(circle at top, #312e81 0, #020617 55%)",
                color: "#e5e7eb",
                padding: "3rem 1.5rem 4rem",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div style={{ width: "100%", maxWidth: 1100 }}>
                <section
                    style={{
                        textAlign: "center",
                        marginBottom: "2.5rem",
                    }}
                >
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "999px",
                            border: "3px solid #4f46e5",
                            margin: "0 auto 1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                                "radial-gradient(circle at 30% 0, rgba(248,250,252,.12), transparent 55%)",
                        }}
                    >
                        <div
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: "999px",
                                border: "2px solid #9ca3af",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 32,
                            }}
                        >
                            👤
                        </div>
                    </div>

                    <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
                        {profile.displayName}
                    </h1>
                    <p
                        style={{
                            maxWidth: 600,
                            margin: "0 auto",
                            fontSize: "0.95rem",
                            color: "#9ca3af",
                        }}
                    >
                        {profile.bio}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "2.5rem",
                            marginTop: "1.8rem",
                            fontSize: "0.9rem",
                        }}
                    >
                        <ProfileStat label="Filmes" value={profile.stats.filmes} />
                        <Separator />
                        <ProfileStat label="Este ano" value={profile.stats.esteAno} />
                        <Separator />
                        <ProfileStat label="Listas" value={listsCount} />
                        <Separator />
                        <ProfileStat label="Seguidores" value={profile.stats.seguidores} />
                        <Separator />
                        <ProfileStat label="Seguindo" value={profile.stats.seguindo} />
                    </div>
                </section>

                <section
                    style={{
                        background: "rgba(15,23,42,0.85)",
                        borderRadius: 999,
                        padding: 4,
                        display: "inline-flex",
                        gap: 4,
                        marginBottom: "2.5rem",
                    }}
                >
                    <TabButton
                        active={activeTab === "perfil"}
                        onClick={() => setActiveTab("perfil")}
                    >
                        Perfil
                    </TabButton>
                    <TabButton
                        active={activeTab === "avaliacoes"}
                        onClick={() => setActiveTab("avaliacoes")}
                    >
                        Avaliações
                    </TabButton>
                    <TabButton
                        active={activeTab === "assistidas"}
                        onClick={() => setActiveTab("assistidas")}
                    >
                        Séries assistidas
                    </TabButton>
                </section>

                {activeTab === "perfil" && (
                    <PerfilTab
                        folders={profile.folders}
                        newFolderName={newFolderName}
                        newFolderDescription={newFolderDescription}
                        setNewFolderName={setNewFolderName}
                        setNewFolderDescription={setNewFolderDescription}
                        onCreateFolder={handleCreateFolder}
                        onDeleteFolder={handleDeleteFolder}
                    />
                )}

                {activeTab === "avaliacoes" && (
                    <div style={{ marginTop: "1rem", color: "#9ca3af" }}>
                        <p>Em breve você verá aqui suas avaliações de séries.</p>
                    </div>
                )}

                {activeTab === "assistidas" && (
                    <div style={{ marginTop: "1rem", color: "#9ca3af" }}>
                        <p>Em breve você verá aqui as séries que marcou como assistidas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfileStat({ label, value }) {
    return (
        <div style={{ textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#6b7280" }}>
                {label}
            </div>
            <div style={{ fontSize: "1.1rem", marginTop: 4 }}>{value}</div>
        </div>
    );
}

function Separator() {
    return (
        <div
            style={{
                width: 1,
                background: "linear-gradient(to bottom, transparent, #4b5563, transparent)",
                alignSelf: "stretch",
            }}
        />
    );
}

function TabButton({ active, children, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                border: "none",
                borderRadius: 999,
                padding: "0.45rem 1.8rem",
                fontSize: "0.9rem",
                cursor: "pointer",
                background: active ? "#4f46e5" : "transparent",
                color: active ? "#f9fafb" : "#9ca3af",
                boxShadow: active ? "0 0 18px rgba(79,70,229,0.6)" : "none",
                transition: "all 0.2s ease",
            }}
        >
            {children}
        </button>
    );
}

function PerfilTab({
                       folders,
                       newFolderName,
                       newFolderDescription,
                       setNewFolderName,
                       setNewFolderDescription,
                       onCreateFolder,
                       onDeleteFolder,
                   }) {
    return (
        <section>
            <form
                onSubmit={onCreateFolder}
                style={{
                    background: "rgba(15,23,42,0.9)",
                    borderRadius: 16,
                    padding: "1.5rem",
                    marginBottom: "2rem",
                    display: "grid",
                    gridTemplateColumns: "2fr 3fr auto",
                    gap: "0.75rem",
                    alignItems: "center",
                }}
            >
                <div>
                    <label
                        style={{ display: "block", fontSize: "0.8rem", marginBottom: 4, color: "#9ca3af" }}
                    >
                        Nome da pasta
                    </label>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Ex: Terror Psicológico"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label
                        style={{ display: "block", fontSize: "0.8rem", marginBottom: 4, color: "#9ca3af" }}
                    >
                        Descrição (opcional)
                    </label>
                    <input
                        type="text"
                        value={newFolderDescription}
                        onChange={(e) => setNewFolderDescription(e.target.value)}
                        placeholder="Uma coleção com minhas séries favoritas do gênero..."
                        style={inputStyle}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        marginTop: 18,
                        height: 40,
                        padding: "0 1.5rem",
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        background:
                            "radial-gradient(circle at 30% 0, rgba(248,250,252,.25), transparent 55%), #4f46e5",
                        color: "#f9fafb",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        boxShadow: "0 10px 25px rgba(15,23,42,0.8)",
                    }}
                >
                    Criar pasta
                </button>
            </form>

            <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.95rem" }}>Minhas pastas</span>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          {folders.length} {folders.length === 1 ? "lista" : "listas"}
        </span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                    gap: "1.25rem",
                }}
            >
                {folders.map((folder) => (
                    <div
                        key={folder.id}
                        style={{
                            background: "linear-gradient(135deg, #020617, #111827)",
                            borderRadius: 18,
                            padding: "1rem 1.1rem",
                            boxShadow: "0 18px 35px rgba(15,23,42,0.8)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    width: "100%",
                                    height: 110,
                                    borderRadius: 14,
                                    marginBottom: "0.9rem",
                                    background:
                                        "linear-gradient(135deg, rgba(79,70,229,0.6), rgba(236,72,153,0.5))",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",
                                    padding: "0.75rem",
                                    fontSize: "0.8rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#e5e7eb",
                                }}
                            >
                                Pasta
                            </div>
                            <h3 style={{ margin: 0, marginBottom: 4, fontSize: "1rem" }}>{folder.name}</h3>
                            {folder.description && (
                                <p
                                    style={{
                                        margin: 0,
                                        marginBottom: 8,
                                        fontSize: "0.8rem",
                                        color: "#9ca3af",
                                    }}
                                >
                                    {folder.description}
                                </p>
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 8,
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                            }}
                        >
                            <span>0 itens</span>
                            <button
                                type="button"
                                onClick={() => onDeleteFolder(folder.id)}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    color: "#f97373",
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                }}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))}

                <div
                    style={{
                        borderRadius: 18,
                        border: "1px dashed rgba(75,85,99,0.9)",
                        padding: "1rem 1.1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        background:
                            "radial-gradient(circle at top, rgba(79,70,229,0.18), rgba(15,23,42,1))",
                    }}
                    onClick={() => {
                        const name = prompt("Nome da nova pasta:");
                        if (name) {
                            const fakeEvent = { preventDefault() {} };
                            setNewFolderName(name);
                            onCreateFolder(fakeEvent);
                        }
                    }}
                >
                    <span style={{ fontSize: "0.9rem", color: "#9ca3af" }}>+ Criar nova pasta</span>
                </div>
            </div>
        </section>
    );
}

const inputStyle = {
    width: "100%",
    height: 40,
    borderRadius: 999,
    border: "1px solid #374151",
    padding: "0 14px",
    backgroundColor: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "0.85rem",
};
