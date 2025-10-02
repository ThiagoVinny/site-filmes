import React, { useEffect, useState } from "react";

const API_KEY = "ee4baf041aa87a38a21cb891835ae1ca";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_PROFILE_URL = "https://image.tmdb.org/t/p/w200";

const icons = {
    star: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    ),
};

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

    if (loading) return <p style={{ color: "white" }}>Carregando atores...</p>;

    return (
        <div style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            padding: "1rem 0",
            marginBottom: 32
        }}>
            {atores.map((ator) => (
                <div
                    key={ator.id}
                    style={{
                        flex: "0 0 auto",
                        width: 160,
                        background: "rgba(30,41,59,0.8)",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.7)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.5)";
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
                    <div style={{ padding: "0.5rem" }}>
                        <p style={{
                            fontWeight: "bold",
                            color: "white",
                            fontSize: 14,
                            margin: "4px 0",
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center"
                        }}>
                            {ator.name}
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: "#94a3b8",
                            margin: "2px 0",
                            textAlign: "center"
                        }}>
                            {ator.known_for_department || "Acting"}
                        </p>
                        <p style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            fontSize: 14,
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

export default AtoresDestaque;