// src/components/AddToFolderModal.js
import React, { useEffect, useState } from "react";
import { getFolders } from "../services/foldersService";

export default function AddToFolderModal({ serie, onSelectFolder, onClose }) {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serie) return;
        async function loadFolders() {
            try {
                setLoading(true);
                const data = await getFolders();
                setFolders(data || []);
            } catch (err) {
                console.error("Erro ao carregar pastas:", err);
            } finally {
                setLoading(false);
            }
        }
        loadFolders();
    }, [serie]); // toda vez que abrir com uma nova série

    if (!serie) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "rgba(17,25,40,0.85)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: "1.5rem 2rem",
                    width: 380,
                    color: "white",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
            >
                <h3 style={{ marginBottom: 20, fontSize: 18 }}>
                    Adicionar <span style={{ color: "#a855f7" }}>{serie.name}</span> à pasta:
                </h3>

                {loading ? (
                    <p style={{ color: "#9ca3af" }}>Carregando pastas...</p>
                ) : folders.length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>Nenhuma pasta criada ainda.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {folders.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => onSelectFolder(f)}
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: 8,
                                    padding: "0.6rem 1rem",
                                    color: "white",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    transition: "all .2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                                }
                            >
                                📁 {f.name}
                            </button>
                        ))}
                    </div>
                )}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: 20,
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                    }}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
